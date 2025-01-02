// const ErrorHandler = require("../utils/ErrorHandler")

// module.export = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.message = err.message || "Internal Server Error";

//   //wrong mongodb id error
//   if (err.name === "CastError") {
//     const message = `Resource not found. Invalid: ${err.path}`;
//     err = new ErrorHandler(message, 400);
//   }

//   //mongoose duplicate key error
//   if (err.code === 11000) {
//     const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
//     err = new ErrorHandler(message, 400);
//   }

//   //wrong jwt error
//   if (err.name === "JsonWebTokenError") {
//     const message = `Json Web Token is invalid. Try again`;
//     err = new ErrorHandler(message, 400);
//   }

//   //jwt expire error
//   if (err.name === "TokenExpiredError") {
//     const message = `Json Web Token is Expired. Try again`;
//     err = new ErrorHandler(message, 400);
//   }

//   res.status(err.statusCode).json({
//     success: false,
//     message: err.message,
//   });
// }

const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resources not found with this id.. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again letter`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expired
  if (err.name === "TokenExpiredError") {
    const message = `Your Url is expired please try again letter!`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};