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
    const allowedOrigins = ['http://localhost:5173','https://mern-auth-project-rie8.onrender.com',];
    await connectdb();
    app.use(express.json());
    app.use(cookieParser());

    app.use(cors({ origin: allowedOrigins, credentials: true }));

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
