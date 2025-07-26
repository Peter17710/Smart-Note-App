import express from 'express';
import { addUser, deleteUser, uploadProfilePic} from './userControllers.js';
import { uploadArray, uploadSingle} from './../../utils/fileUpload.js';
import { protectRoutes } from '../Auth/authControllers.js';


const userApp = express.Router();   


userApp.post('/addUser' , uploadArray('images'), protectRoutes  , addUser)
userApp.delete('/deleteUser/:id' , protectRoutes  , deleteUser)
userApp.patch('/upload-profile-pic', protectRoutes, uploadSingle('profilePic', 'uploads/profilePics'), uploadProfilePic);


export default userApp;