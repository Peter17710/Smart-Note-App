import { User } from "../../../db/models/user.model.js"
import { handleAsyncError } from "../../Middleware/handleAsyncError.js"
import appError from "../../utils/appError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";



   export const Register = handleAsyncError( async(req,res,next)=>{
    let checkUser = await User.findOne({email: req.body.email})
    if (checkUser) return next(new appError("email already exist!" , 409))
    let user = new User (req.body)
    let added = await user.save()    
    res.status(201).json({message: "added" , added}) 
})



    export const Login = handleAsyncError(async(req,res,next)=>{
    let founded = await User.findOne({email: req.body.email})

    if(!founded) return next(new appError("invalid email or password" , 401))
    const match = bcrypt.compareSync(req.body.password , founded.password)

    if(founded && match){
        let token = jwt.sign({name:founded.name , userId:founded._id , role:founded.role} , "token")
      return  res.status(201).json({message: "Done!" , token})
    }
    next(new appError("invalid email or password" , 401))
    })



export const revokedTokens = [];

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new appError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];
    if (revokedTokens.includes(token)) {
        return next(new appError("Token has been revoked", 401));
    }

    try {
        const decoded = jwt.verify(token, "token");
        req.user = decoded;
        next();
    } catch (err) {
        next(new appError("Invalid token", 401));
    }
};


export const Logout = handleAsyncError(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new appError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];
    revokedTokens.push(token);
    res.status(200).json({ message: "Logged out successfully" });
});



 export const protectRoutes = handleAsyncError(async(req,res,next)=>{
        let {token} = req.headers
        if(!token) return next(new appError("Please provide token" , 401))
        
        let decoded = await jwt.verify(token , "token")

        let user = await User.findById(decoded.userId)
        if(!user) return next(new appError("invalid user" , 404))

        if(user.changePasswordAt){
            let changePasswordTime = Math.round(user.changePasswordAt.getTime() / 1000);
            
        if(changePasswordTime>decoded.iat) return next(new appError("token invalid" , 401))
        }
        req.user = user 
        next()
    })



   export const forgetPassword = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const genericMsg = "If this email is registered, you will receive an OTP shortly.";

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(200).json({ message: genericMsg });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
        to: user.email,
        subject: "Your Password Reset OTP",
        text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ message: genericMsg });
});

async function sendEmail({ to, subject, text }) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,       
        },
    });

    await transporter.sendMail({
        from: '"Smart Note App" <> ',
        to,
        subject,
        text,
    });
}


export const resetPassword = handleAsyncError(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new appError("User not found", 404));
    }

    if (!user.resetOTP || user.resetOTP !== otp || user.resetOTPExpires < Date.now()) {
        return next(new appError("Invalid or expired OTP", 400));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = undefined; 
    user.resetOTPExpires = undefined;
    user.changePasswordAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
});