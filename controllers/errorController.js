const AppError = require('../utils/appError');

//handle Invalid IDs errors in production env
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

//handle Duplicate Fields errors in production env
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];

  const message = `Duplicate field value, ${value}. Please use another value.`;
  return new AppError(message, 400);
};

//handle Validation error
const handleValidationDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

//handle JWT error
const handleJWTError = () => {
  return new AppError('Invalid token. Please login again!', 401);
};

//handle JWT expired error
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please login again', 401);
};

const sendErrorDev = (err, req, res) => {
  console.log(req);
  //A)API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //B)Rendered Website
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  //A)API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      //Operational, trusted error: send message to the client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming or other unknown error: do not leak error details
    //1) Log error
    console.error('Error', err);

    //2) send general message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  //B) Rendered website
  if (err.isOperational) {
    //Operational, trusted error: send message to the client
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  //Programming or other unknown error: do not leak error details
  //1) Log error
  console.error('Error', err);

  //2) send general message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  // taking arguments from AppError.js
  err.statusCode = err.statusCode || 500; // default as 500
  err.status = err.status || 'error'; // default as error

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err); // do not alter the original err object

    //invalid IDs error
    if (error.name == 'CastError') error = handleCastErrorDB(error);

    //Duplicate fields
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    //Validation error
    if (error.name === 'ValidationError') error = handleValidationDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
