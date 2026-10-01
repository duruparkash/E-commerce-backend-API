const sendSuccess = (res, statusCode, message, data) =>
  res.status(statusCode).json({ success: true, message, ...(data !== undefined && { data }) });

module.exports = { sendSuccess };
