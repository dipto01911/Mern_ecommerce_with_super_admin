const express=require('express')
const ratelimit=require('express-rate-limit')
const mongoSanitize=require('express-mongo-sanitize')
const path=require('path')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const helmet=require('helmet')
const hpp=require('hpp')
const app=express()
const Routes=require('./src/routes/api')
const {DATA_LIMIT,URL_ENCODE,RATE_LIMIT,MAX_LIMIT,WEB_CACHE}=require('./config')
 app.use(cors())
 app.use(helmet())

 app.use(hpp())
 app.use(cookieParser())

 app.use(express.json({limit:DATA_LIMIT}))
 app.use(express.urlencoded({extended:URL_ENCODE}))

 const limiter=ratelimit({
    windowMs:RATE_LIMIT,
    max:MAX_LIMIT
})

app.set('etag',WEB_CACHE)
app.use('/api/v2',Routes)
app.use('/api/v2/get-file',express.static("uploads"))

//FrontEnd Connecting with server

// app.use('/super-admin',
//     express.static(path.join(__dirname,"client","super-admin","dist"))

// )

// app.get('/super-admin/:path(*)',(req,res)=>{
//     res.sendFile(
//         path.resolve(__dirname,"client","super-admin","dist","index.html")
//     )
// })

//For Super-admin

const distPath = path.join(__dirname, "client", "super-admin", "dist");
const indexPath = path.join(distPath, "index.html");

app.use('/super-admin', express.static(distPath));

app.get(/^\/super-admin(\/.*)?$/, (req, res) => {
    res.sendFile(indexPath);
});

// app.use(express.static(path.join(__dirname,"client","ecommerce","dist")))
// app.get('*',(req,res)=>{
//     res.sendFile(
//         path.resolve(__dirname,"client","ecommerce","dist","index.html")
//     )
// })


//For client

const distPath1 = path.join(__dirname, "client", "ecommerce", "dist");
const indexPath1 = path.join(distPath1, "index.html");

app.use("/", express.static(distPath1));

app.get(/^\/(.*)?$/, (req, res) => {
  res.sendFile(indexPath1);
});

module.exports=app;