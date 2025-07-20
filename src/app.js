import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// import routes
import routes from './routes/index.js';

// mount routes
app.use(
  '/',
  (req, res, next) => {
    console.log('--->1', req.body);
    next();
  },
  routes
);

// ✅ Export app
export { app };
