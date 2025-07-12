import express from "express";
import { connectdb } from "./mongodb.js";
import routes from './Routes/router.js';
import userRoute from "./userRoute.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 4000;

(async () => {
  try {
    await connectdb();

    const allowedOrigins = [
      'http://localhost:5173',
      'https://mern-auth-project-rie8.onrender.com',
      'https://mern-auth-nrxl.onrender.com',
    ];

    app.use(cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }));

    app.use(express.json());
    app.use(cookieParser());

    app.use('/api/auth', routes);
    app.use('/api/user', userRoute);

    app.get("/", (req, res) => {
      res.send("hello");
    });

    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
})();
