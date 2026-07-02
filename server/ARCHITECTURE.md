# PropFind 2.0 — Backend Architecture

## Stack
- **Runtime:** Node.js 18+, Express 4, ESM modules
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT access tokens (15m, header-based) + refresh tokens (30d, httpOnly cookie), bcrypt password hashing
- **Real-time:** Socket.io, JWT-authenticated handshake, per-inquiry rooms
- **Media:** Cloudinary, signed direct-upload from the client (server never proxies image bytes)
- **Validation:** Zod schemas on every mutating route
- **Hardening:** helmet, cors (locked to CLIENT_ORIGIN), express-rate-limit (tighter on auth routes), express-mongo-sanitize (NoSQL injection), compression, morgan logging

This mirrors the stack already used on Starlight Station (Node/Express + MongoDB Atlas + Cloudinary), deployed the same way: as its own Render Web Service with **Root Directory** set to `server/`.

## Why two collections for "sellers" (User vs Agent)

`User` is the private, authenticated identity (email, password hash, role). `Agent` is the public storefront record shown in listings and the Agent Directory (name, bio, agency, rating, performance). A `User` with role `owner` or `agent` is auto-linked to exactly one `Agent` record on first authentication (`ensureAgentForUser`, in `src/utils/ownership.js`).

This is the direct backend counterpart to the frontend bug that was just fixed: previously, new Private Seller signups had no linked Agent record, so their listings and inquiries had nothing to attach to and silently fell back to a default agent. Every ownership check server-side (`assertOwnsProperty`, `assertCanAccessInquiry`) resolves through this same link, so that entire bug class — a seller seeing the whole marketplace as "their" listings, or seeker messages vanishing — can't recur once the frontend talks to this API instead of local state.

## Listing moderation

New listings are created with `status: "pending"` and are **not** returned by the public `GET /api/properties` browse endpoint, which hard-filters to `status: "active"` regardless of query params. An admin must explicitly approve them via `PATCH /api/admin/properties/:id/status`. This differs from the current frontend (which instant-publishes to `active`) — intentional, and something to decide on before wiring up: either keep moderation server-side (recommended) or have the frontend show a "pending review" state after publish.

## API Reference

All mutating requests expect `Authorization: Bearer <accessToken>` unless noted. Refresh token travels as an httpOnly cookie automatically.

### Auth — `/api/auth`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/signup` | — | body: name, email, password, role (seeker\|owner\|agent), securityAnswer |
| POST | `/login` | — | body: email, password |
| POST | `/refresh` | cookie | returns new access token |
| POST | `/logout` | ✔ | clears refresh cookie |
| GET | `/me` | ✔ | current user |
| POST | `/forgot-password` | — | body: email, securityAnswer (deliberately vague response) |

### Properties — `/api/properties`
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | — | public catalog; query: city, listingType, propertyType, minPrice, maxPrice, bedrooms, bathrooms, q, sort |
| GET | `/mine` | owner\|agent | **only the caller's own listings** |
| GET | `/:id` | — | increments view count if active |
| POST | `/` | owner\|agent | creates as `pending` |
| PATCH | `/:id` | owner\|agent\|admin | 403 if not the owning agent |
| DELETE | `/:id` | owner\|agent\|admin | 403 if not the owning agent |
| POST | `/:id/promote` | owner\|agent | flags only — see Payments note below |

### Agents — `/api/agents`
`GET /`, `GET /:id` public. `PATCH /:id/verify` admin-only.

### Inquiries — `/api/inquiries`
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | ✔ | scoped: seekers see their own sent inquiries; owners/agents see inquiries on their own properties; admin sees all |
| POST | `/` | seeker | creates inquiry + first chat message |
| PATCH | `/:id` | ✔ | status/notes update, ownership-checked |
| POST | `/:id/reply` | ✔ | appends chat message, emits `inquiry:message` over socket.io to room `inquiry:<id>` |

### Saved Searches — `/api/saved-searches`
Standard CRUD, scoped to `req.user`.

### Reports — `/api/reports`
`POST /` any authenticated user. `GET /`, `PATCH /:id` admin-only. Setting status `removed` auto-sets the property to `off-market`.

### Support Tickets — `/api/support-tickets`
`POST /`, `GET /mine`, `POST /:id/reply` for the ticket owner or admin. `GET /`, `PATCH /:id/status` admin-only.

### Uploads — `/api/uploads`
`GET /signature` (owner/agent) returns a Cloudinary signed-upload payload; the client uploads directly to Cloudinary with it.

### Admin — `/api/admin` (all routes admin-only)
`GET /stats`, `GET /properties/pending`, `PATCH /properties/:id/status`, `GET /users`, `PATCH /users/:id/suspend`.

## Real-time chat
Client connects with `io(SERVER_URL, { auth: { token: accessToken } })`, then emits `inquiry:join` with the inquiry id when opening a thread. Server emits `inquiry:message` with the full updated inquiry document whenever either side replies via `POST /api/inquiries/:id/reply`.

## What's intentionally NOT built yet
- **Payments.** `POST /:id/promote` flips promotion flags but does not charge anything — there's no fake "success" response pretending money moved. Wire a real provider (Paystack/Flutterwave, given the ₦ market) via server-side webhook verification before this goes live for real transactions.
- **Email delivery.** Password reset and notification emails are integration points (see comments in `authController.js`), not implemented — needs a provider (Postmark/SendGrid) and templates.
- **Image transformation/moderation.** Cloudinary upload works as-is; consider adding Cloudinary's AI moderation add-on before allowing public listing photos live unreviewed.

## Frontend integration (not yet done — this is a separate pass)
The React app currently holds every entity in `useState` and never calls an API. Wiring this backend in means, per entity:
1. Replace `useState<Property[]>(INITIAL_PROPERTIES)` etc. with a fetch on mount (React Query or plain `useEffect` + fetch) hitting the routes above.
2. Replace direct `setProperties`/`setInquiries`/etc. mutations with API calls, then reconcile local state from the response (or refetch).
3. Add an auth context that stores the access token in memory (not localStorage — refresh token cookie handles persistence) and attaches it to every request.
4. Swap `ListingForm`'s photo handling from static Unsplash URLs to the Cloudinary signed-upload flow.
5. Connect `InboxChat` to socket.io for live updates instead of relying purely on local state.

This is a genuinely large refactor (every `handle*` function in `App.tsx` touches local state directly) — recommend doing it entity-by-entity, starting with Properties + Auth, rather than as one big-bang change.

## Environment setup
1. Copy `server/.env.example` to `server/.env` and fill in a MongoDB Atlas URI (same account/project as Starlight Station is fine — separate database name) and Cloudinary credentials.
2. `cd server && npm install`
3. `npm run seed:clean` — wipes and repopulates with 4 demo accounts (password `Password123!`) and 3 sample listings (one intentionally left `pending` to demonstrate moderation).
4. `npm run dev`

## Deployment (Render, matching Starlight Station)
- New Web Service, root directory `server`
- Build command: `npm install`
- Start command: `npm start`
- Env vars: everything in `.env.example`, with `NODE_ENV=production` and `CLIENT_ORIGIN` set to the deployed frontend URL
- `ALLOW_PROD_SEED` should stay unset/false — never run `npm run seed:clean` against production data by accident.
