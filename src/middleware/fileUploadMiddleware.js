
const multer=require('multer');
const { fileModel } = require('../model/fileModel');

const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads");
    },
    filename:(req,file,cb)=>{
        const SanitizeFilename=file.originalname.replace(/\s+/g,"")
        cb(null,"api-img"+Date.now()+"-"+SanitizeFilename);
    },
})

const upload=multer({
     storage:fileStorageEngine,
     limits:{fileSize:10 * 1024 * 1024},
     fileFilter:(req,file,cb)=>{
        cb(null,true);
     }
})

const fileUploadMiddleware=(req,res,next)=>{
    upload.single("file")(req,res,(err)=>{
        if(err){
            if(err?.code === "LIMIT_FILE_SIZE"){
                return res.status(400).json({success:false,message:'File too large !'})
            }
               return res.status(400).json({success:false,message:"File upload failed"})
        }
        next();
     
    })
}

module.exports={fileUploadMiddleware}