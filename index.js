
const mongoose=require('mongoose')
const app=require('./app')
const dotenv=require('dotenv')
dotenv.config({path:'./.env'})
mongoose.connect(process.env.MONGO_URI)

.then(()=>{
app.listen(process.env.PORT,()=>console.log(`Server Running..${process.env.PORT}`))
}).catch((err)=>{
    console.log('Error occured',err.toString())
})