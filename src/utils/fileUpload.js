import mongoose from "mongoose" ;
import appError from "./appError.js";
import multer from "multer";

    // Modified to accept a folder parameter
    const uploadFile = (folder = 'uploads') =>{ // Default to 'uploads'
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              // Use the provided folder or default to 'uploads'
              cb(null, folder);
            },
            filename: function (req, file, cb) {
              // Generate a unique filename using ObjectId and original name
              cb(null, new mongoose.Types.ObjectId() +'_'+ file.originalname );
            }
          })

          function fileFilter (req, file, cb) {
            if(file.mimetype.startsWith("image")){
                cb(null, true)
            }else{
                cb(new appError("invalid image type",401), false)
            }
          }

          const upload = multer({ storage: storage , fileFilter })
          return upload ;
    }

    export const uploadSingle = (fieldname, folder) => uploadFile(folder).single(fieldname) ;
    export const uploadArray = (fieldname, folder) => uploadFile(folder).array(fieldname,10) ;
    export const uploadFields = (fieldname, folder) => uploadFile(folder).fields(fieldname) ;
