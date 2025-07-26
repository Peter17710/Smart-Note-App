import { User } from "../../../db/models/user.model.js";
import { handleAsyncError } from "../../Middleware/handleAsyncError.js";
import appError from "../../utils/appError.js";


export const addUser = handleAsyncError(async (req, res, next) => {
    let checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) return next(new appError("User already exists", 409));
    req.body.images = req.files && req.files.length > 0 ? req.files.map(ele => ele.filename) : [];
    let user = new User(req.body);
    let savedUser = await user.save();

    res.send({ Message: "User added successfully", savedUser });
});


export const getUser = handleAsyncError( async(req,res,next)=>{
    const getUser  = await User.findById(req.params.id)
    res.json({message: "Done!" , getUser})
    })

    
export const deleteUser = handleAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const deletedUser = await User.findByIdAndDelete(userId); 
  res.json({Message: "User deleted successfully", deletedUser });
})


export const uploadProfilePic = handleAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new appError('No file uploaded!', 400));
  }
  const userId = req.user._id; 
  const profilePicPath = `/uploads/profilePics/${req.file.filename}`;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePic: profilePicPath },
    { new: true } 
  );

  if (!updatedUser) {
    return next(new appError('User not found or could not be updated', 404));
  }

  res.status(200).json({
    message: 'Profile picture uploaded successfully',
    profilePic: updatedUser.profilePic,
  });
});




