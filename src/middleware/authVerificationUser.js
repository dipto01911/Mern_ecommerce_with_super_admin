

const {EncodeToken,DecodeToken}=require('../utility/Tokenhelper')

const AuthUser=(req,res,next)=>{
    let token=req.cookies['u_token']
    let decoded=DecodeToken(token)
    if(decoded === null){
        return res.status(401).json({status:401,message:'Unauthorized'})
    }
    else{
        let email=decoded['email']
        let id=decoded['id']
        req.headers.email=email;
        req.headers.id=id;
        next()
    }
}
module.exports={AuthUser}