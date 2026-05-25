
const { userModel } = require('../model/userModel');
const { EncodeToken } = require('../utility/Tokenhelper');
const options={
    maxAge:25920000000,
    httpOnly:false,
    sameSite:"none",
    secure:true
}
const bcrypt=require('bcrypt');

const userRegister=async(req,res)=>{
    try{
  const {email,password}=req.body;
  const user=await userModel.find({email})
  if(user.length>0){
    return res.status(200).json({success:false,message:'Email already Register'})
  }

  let data=await userModel.create({email,password})
  return res.status(200).json({success:true,message:'User Registration Success',data:data})
    }catch(err){
        res.status(500).json({success:true,error:err.toString(),message:'Something went wrong'})
    }
}

const userLogin=async(req,res)=>{
try{
const {email,password}=req.body;
const user=await userModel.findOne({email})
if(!user){
    return res.status(200).json({success:false,message:'Invalid email or password'})
}

const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
    return res.status(200).json({success:false,message:'Password not matching'})
}

if(isMatch){
 const token=EncodeToken(user.email,user._id.toString())
  res.cookie('u_token',token,options)

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
    res.status(500).json({success:true,error:err.toString(),message:'Something went wrong'})
}
}

const userRead=async(req,res)=>{
    try{
   let email=req.headers['email']
   let MatchStage={$match:{email:email}}
   let project={$project:{
    password:0,
   }}
   let data =await userModel.aggregate([MatchStage,project])
   
 res.status(200).json({success:true,data:data[0]})
    }catch(err){
         res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const userVerify=async(req,res)=>{
    try{
 res.status(200).json({success:true,message:'Verify Success'})
    }catch(err){
     res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const userLogout=async(req,res)=>{
    try{
   res.clearCookie('u_token')
   res.status(200).json({success:true,message:'Logout Successfully'})
    }catch(err){
     res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const userUpdate=async(req,res)=>{
    try{
 const email=req.headers['email'];
  const id=req.headers['id'];
  const {password,cus_name,cus_add,cus_city,cus_country,cus_fax,cus_phone,cus_postcode,cus_state,
ship_name, ship_add,ship_city,ship_country,ship_phone,ship_postcode,ship_state}=req.body;
 
  const UpdatedData={password,cus_name,cus_add,cus_city,cus_country,cus_fax,cus_phone,cus_postcode,cus_state,
ship_name, ship_add,ship_city,ship_country,ship_phone,ship_postcode,ship_state}

  const user=await userModel.findOne({email:email,_id:id});
 
  if(!user){
     return res.status(200).json({success:'false',message:'Invalid email'})
  }
  if(password){
     const hashPassword=await bcrypt.hash(password,10)
     UpdatedData.password=hashPassword
  }
  const isMatch=await bcrypt.compare(password,UpdatedData.password)
  if(!isMatch){
  return res.status(200).json({success:true,message:'Email and password not match'})
  }
  if(isMatch){
    const user=await userModel.findByIdAndUpdate(id,UpdatedData)
  }
 let token=EncodeToken(user?.email,user?._id.toString())
  res.cookie('u_token',token,options)
  res.status(200).json({success:true,message:'user Updated Successfully',user:{email:user.email}})
    }catch(err){
        res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

module.exports={userRegister,userLogin,userRead,userVerify,userLogout,userUpdate}