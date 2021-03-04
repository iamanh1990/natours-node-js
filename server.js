const mongoose = require('mongoose');
const dotenv = require('dotenv');

//handle Uncaught Exceptions error
process.on('uncaughtException', (err) => {
	console.log(err.name, err.message);
	console.log('Uncaught Exception. Shutting down...');
	process.exit(1);
});

const app = require('./app');
const AppError = require('./utils/appError');

//set up environment variables
dotenv.config({ path: './config.env' });

//connect to database - MongoDB via mongoose

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => console.log('DB connection successful'));

// 4) listening to the port - start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
});

//handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	console.log('Unhandled Rejection. Shutting down...');
	server.close(() => {
		process.exit(1);
	});
});
