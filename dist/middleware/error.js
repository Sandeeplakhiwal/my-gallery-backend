import ErrorHandler from "../utils/errorHandler.js";
const ErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";
  // Wrong mongodb id error
  if (err.name === "JsonWebTokenError") {
    const message = `Resouce not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // Wrong JsonWebToken
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, try again";
    err = new ErrorHandler(message, 400);
  }
  // JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
export default ErrorMiddleware;
