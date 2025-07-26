import { authMiddleware, Login, Logout, Register , forgetPassword, resetPassword } from "./authControllers.js";
import express from 'express';


const authApp = express.Router();

authApp.post('/register', Register);
authApp.post('/login', Login);
authApp.post('/logout', authMiddleware , Logout);
authApp.post('/forget-password', forgetPassword);
authApp.post('/reset-password', resetPassword);


export default authApp;