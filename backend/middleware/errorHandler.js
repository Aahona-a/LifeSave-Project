function notFound(req, res) {
  res.status(404).json({ success: false, message: 'API route not found' });
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'A record with this value already exists' });
  const status = err.statusCode || 500;
  const body = { success: false, message: status === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Internal server error' };
  if (err.details) body.details = err.details;
  if (process.env.NODE_ENV !== 'production' && status === 500) body.stack = err.stack;
  res.status(status).json(body);
}
module.exports = { notFound, errorHandler };
