import express from 'express';
import userAuth from '../middleware/midleware.js'
import { isAuthenticated, login, logout, register,resetOtp,resetPassword,sendVerifyOtp,verifyEmail } from '../Controller/controller.js';
const routes =express.Router();
routes.post('/signup',register);
routes.post('/login',login);
routes.post('/logout',logout);
routes.post('/send-verify-otp',userAuth,sendVerifyOtp);
routes.post('/verify-account',userAuth,verifyEmail);
routes.get('/is-auth',userAuth,isAuthenticated);
routes.post('/send-reset-otp',resetOtp);
routes.post('/reset-password',resetPassword);

export default routes;