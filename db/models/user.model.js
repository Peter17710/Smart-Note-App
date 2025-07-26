import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: [2, 'too short category name']
    },
    email: {
        type: String,
        unique: true
    },
    images: [String],
    password: String,     
    changePasswordAt: Date,
     resetOTP: String,
    resetOTPExpires: Date,
    profilePic: String 

},
{timestamps: true , versionKey:false})


   userSchema.pre("save", function () {
  if (this.isModified("password") && this.password) {
    this.password = bcrypt.hashSync(this.password, 7);
  }
});



  export const User = mongoose.model('User' , userSchema)
