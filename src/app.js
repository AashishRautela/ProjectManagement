import express from 'express';
import cookieParser from 'cookie-parser';
import { ErrorResponse } from './utils/common/index.js';

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// import routes
import routes from './routes/index.js';

// mount routes
app.use('/', routes);

app.use((err, req, res, next) => {
  const errorResponse = ErrorResponse();
  errorResponse.error = err;
  errorResponse.message = err.message || 'Something went wrong';

  return res
    .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(errorResponse);
});

// ✅ Export app
export { app };
