const { JsonWebTokenError } = require("jsonwebtoken");

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (err instanceof JsonWebTokenError) {
    err.message = "you have no access to this route";
    err.statusCode = 401;
  }
  if (process.env.NODE_ENV === "development")
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  else {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }
  next();
};

module.exports = globalError;
