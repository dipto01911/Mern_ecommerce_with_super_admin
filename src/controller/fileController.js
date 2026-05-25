const { fileModel } = require("../model/fileModel");
const fs=require('fs')
const path=require('path')
const fileUpload=async(req,res)=>{
    try{
 const{filename}=req.file;
 const data=await fileModel.create({filename})
 res.status(200).json({success:true,message:"File upload success",data:data})
    }catch(err){
        res.status(500).json({success:true,message:"Something went wrong",data:err.toString()})
    }
}


const allFile=async(req,res)=>{
    try{
  let per_page=Number(req.params.per_page)
  let page_no=Number(req.params.page_no)
  let skipRow=(page_no-1)*per_page;
  let sortStage={createdAt:-1}
  let facetStage={
$facet:{
    totalCount:[{$count:"count"}],
    files:[
        {$sort:sortStage},
        {$skip:skipRow},
        {$limit:per_page}
    ]
}
  }
let projectionStage={$project:{
"files.updatedAt": 0}}
let data=await fileModel.aggregate([facetStage,projectionStage])

res.status(200).json({success:true,message:'File Fetched Success',data:data[0]})
    }catch(err){
         res.status(500).json({success:true,message:"Something went wrong",data:err.toString()})
    }
}

const fileRemove=async(req,res)=>{
    try{
  let _id=req.body?._id;
  let filename=req.body?.filename;
  const filePath=path.join(__dirname,`../../uploads/${filename}`)
  fs.unlink(filePath,(err)=>{
    if(err){
        console.log(err)
    }
  })

  const data=await fileModel.deleteOne({_id,filename})
  res.status(200).json({success:true,message:'File Removed successfully',data:data})
    }catch(err){
        res.status(500).json({success:true,message:"Something went wrong",data:err.toString()})
    }
}

module.exports={fileUpload,allFile,fileRemove}