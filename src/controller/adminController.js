const { adminModel } = require("../model/adminModel");
const bcrypt=require('bcrypt');
const { EncodeToken } = require("../utility/Tokenhelper");
const options={
    maxAge:25920000000,
    httpOnly:false,
    sameSite:"none",
    secure:true
}
const register=async(req,res)=>{
    try{
 const {email,password}=req.body;
 let user=await adminModel.create({email,password})
 res.status(200).json({success:'true',message:'Admin Created Successfully'})
    }catch(err){
        res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const Login=async(req,res)=>{
    try{
const {email,password}=req.body;
const user=await adminModel.findOne({email})
if(!user){
    return res.status(200).json({success:false,message:'Invalid email or password'})
}

const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
    return res.status(200).json({success:false,message:'Password not matching'})
}

if(isMatch){
 const token=EncodeToken(user.email,user._id.toString())
  res.cookie('a_token',token,options)

return res.status(200).json({
    success:true,
    message:'Login Success',
    user:{
        id:user._id,
        email:user.email,
    },
    token:token
})
}
    }catch(err){
         res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
    }

const AdminRead=async(req,res)=>{
    try{
   let email=req.headers['email']
   let MatchStage={$match:{email:email}}
   let project={$project:{
    password:0,
   }}
   let data =await adminModel.aggregate([MatchStage,project])
   
 res.status(200).json({success:true,data:data[0]})
    }catch(err){
         res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const AdminVerify=async(req,res)=>{
    try{
 res.status(200).json({success:true,message:'Verify Success'})
    }catch(err){
     res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const AdminLogout=async(req,res)=>{
    try{
   res.clearCookie('a_token')
   res.status(200).json({success:true,message:'Logout Successfully'})
    }catch(err){
     res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}


const AdminUpdate=async(req,res)=>{
    try{
 const {email,password}=req.body;
 const id=req.headers['id']

 const UpdatedData={email}
 const user=await adminModel.findOne({_id:id});

 if(!user){
    return res.status(200).json({success:'false',message:'Invalid email'})
 }
 if(password){
    const hashPassword=await bcrypt.hash(password,10)
    UpdatedData.password=hashPassword
 }
const updatedUser=await adminModel.findByIdAndUpdate(id,UpdatedData)
let token=EncodeToken(updatedUser?.email,updatedUser?._id.toString())
 res.cookie('a_token',token,options)
 res.status(200).json({success:true,message:'Admin Updated Successfully',user:{email:updatedUser.email}})

    }catch(err){
       res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

module.exports={register,Login,AdminRead,AdminVerify,AdminLogout,AdminUpdate}