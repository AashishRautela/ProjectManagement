import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ Export app
export { app };
