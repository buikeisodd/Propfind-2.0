/** Converts a Mongoose doc to a plain object with `id` instead of `_id`. */
export function toClient(doc) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  const { _id, __v, passwordHash, nin, securityAnswerHash, ...rest } = obj;
  return { id: _id?.toString?.() ?? _id, ...rest };
}

export function toClientList(docs) {
  return docs.map(toClient);
}

export function serializeUser(user) {
  const clean = toClient(user);
  return clean;
}
