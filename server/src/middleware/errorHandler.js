export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);

  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Validation failed.",
      details: err.issues?.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ error: `That ${field} is already in use.` });
  }

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    error: err.message || "Something went wrong.",
    ...(err.details ? { details: err.details } : {}),
  });
}
