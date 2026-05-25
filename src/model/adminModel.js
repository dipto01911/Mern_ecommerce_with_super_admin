
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const DataSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
       type:String,required:true
    }
        
},{versionKey:false,timestamps:true})

//Hash Password Before save
DataSchema.pre('save',async function(){
if(!this.isModified("password")) return ;
    this.password=await bcrypt.hash(this.password,10)

})

const adminModel=mongoose.model('admins',DataSchema)

module.exports={adminModel}