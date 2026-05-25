
const jwt=require('jsonwebtoken')
const{JWT_KEY,JWT_TIME}=require('../../config')

const EncodeToken=(email,id)=>{
let payload={email,id}
return jwt.sign(payload,JWT_KEY,{expiresIn:JWT_TIME})
}

const DecodeToken=(token)=>{
    try{
     let decoded=jwt.verify(token,JWT_KEY)
     return decoded
    }catch(err){
  return null
    }
}

module.exports={EncodeToken,DecodeToken}