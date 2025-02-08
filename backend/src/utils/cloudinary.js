// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLODINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_SECRET_KEY
// })
// const deleteOnCloudinary = async (url,resource_type) => {
//     try {
//         await cloudinary.api.delete_resources([url], { type: 'upload', resource_type: resource_type }).then(console.log);

//     } catch (error) {
//         console.log(error);
//     }
    
// }


// const uploadOnCloudinary = async (localFilePath)=>{// localFilePath =means uploaded file
//     try {
//         if (!localFilePath)//if the user is not uploading returning null then he exits immediately
//             return null 
//        const response = await cloudinary.uploader.upload(localFilePath,//uploading the 
//         {resource_type:"auto"})//uploading type is auto (file, text, png, video etc)
//             fs.unlinkSync(localFilePath)
//             return response
//         }
        
//      catch (error) {
//             fs.unlinkSync(localFilePath)//deleting the saved file which is stored in the ret server . The process will look like this  CLIENT -> SERVER -> CLOUDINARY 
//         return null
//     }
// }
// export {uploadOnCloudinary, deleteOnCloudinary}
import { v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
export const uploadOnCloudinary = async (filePath) => {
    try { if(!filePath)
        return null;
      const result = await cloudinary.uploader.upload(filePath, {resource_type:"auto"})//uploading type is auto (file, text, png, video etc)
      fs.unlinkSync(filePath)
      return result;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error.message);
      return null; // Return null explicitly if upload fails
    }
  };
  