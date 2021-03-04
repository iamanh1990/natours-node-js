const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

// 1) create server
const app = express();

// 2) using middlewares

//Seting PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static file
app.use(express.static(path.join(__dirname, 'public')));

//Security HTTP Headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
    },
  })
);

//Developement logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
//Cookie parser, reading cookie from browser cookie into req.cookies
app.use(cookieParser());

//Data sanitization against NoSQL query injections
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Preventing parameters pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//A testing middleware for how long a request takes
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later in an hour',
});

app.use('/api', limiter);

// 3) create routes to API - also middlewares

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

//Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
