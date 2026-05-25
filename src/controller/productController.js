const mongoose  = require("mongoose");
const { productModel } = require("../model/productModel");
const { options, search } = require("../routes/api");
const ObjectId=mongoose.Types.ObjectId;
const createProduct=async(req,res)=>{
try{

    const {title,images, short_description,price, is_discount,discount_price,remark,stock,color,size,description,category_id,brand_id}=req.body;

    if(discount_price>price){
        return res.status(200).json({success:false,message:'The discount price must be smaller than main price'})
    }
let data=await productModel.create({title,images, short_description,price, is_discount,discount_price,remark,stock,color,size,description,category_id,brand_id})
res.status(200).json({success:true,message:"product create successfully",data:data})
}catch(err){
    res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
}
}

const allProduct=async (req,res)=>{
    try{
 const page_no=Number(req.params.page_no);
 const per_page=Number(req.params.per_page);
 const  category_id=req.params.category_id;
 const brand_id=req.params.brand_id;
 const remark=req.params.remark;
 const keyword=req.params.keyword;

 let skipRow=(page_no-1)*per_page;
 let sortStage={createdAt:-1}
 let matchingStage;
 if(category_id !=="0"){
    matchingStage={
        $match:{category_id:new ObjectId(category_id)}
    }
 }

 else  if(brand_id !=="0"){
    matchingStage={
        $match:{brand_id:new ObjectId(brand_id)}
    }
 }
else  if(remark !=="0"){
    matchingStage={
        $match:{remark:remark}
    }
 }
else  if(keyword !=="0"){
   let searchRegex={$regex:keyword,
    $options:"i",
   }
let searchParams=[{title: searchRegex}]
let searchStage={
    $or:searchParams
}
matchingStage={$match:searchStage}
}else{
    matchingStage={$match:{}}
}

let JoinWithCategoryStage={$lookup:{from:'categories',localField:'category_id',foreignField:'_id',as:'category'}}
let facetStage={
    $facet:{
        totalCount:[{$count:'count'}],
        products:[
            {$sort:sortStage},
            {$skip:skipRow},
            {$limit:per_page},
            JoinWithCategoryStage,
            {
                $project:{
                    _id:1,
                    category_id:1,
                    brand_id:1,
                    title:1,
                    images:1,
                    price:1,
                    is_discount:1,
                    discount_price:1,
                    remark:1,
                    stock:1,
                    createdAt:1,
                    "category.category_name":1      
                    }
            }
        ]
 
        
    }
}
let products=await productModel.aggregate([matchingStage,facetStage])
res.status(200).json({success:true,message:'Products fetched Successfully',data:products[0]})
}catch(err){
     res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const singleProduct=async(req,res)=>{
    try{
  const id=new ObjectId(req.params.id);
  let matchStage={
    $match:{_id:id}
  }

  let joinWithCategory={$lookup:{from:'categories',localField:'category_id',foreignField:'_id',as:"category"}}
let joinWithBrand={$lookup:{from:'brands',localField:'brand_id',foreignField:'_id',as:"brand"}}
let data=await productModel.aggregate([matchStage,joinWithBrand,joinWithCategory])

res.status(200).json({success:true,message:'Product fetched Successfully',data:data})
    }catch(err){
        res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const updateProduct=async(req,res)=>{
    try{
        const id=req.params.id;
 const {title,images, short_description,price, is_discount,discount_price,remark,stock,color,size,description,category_id,brand_id}=req.body;
 const updatedData={title,images, short_description,price, is_discount,discount_price,remark,stock,color,size,description,category_id,brand_id}
 if(discount_price>price){
        return res.status(200).json({success:false,message:'The discount price must be smaller than main price'})
    }

   let data=await productModel.findByIdAndUpdate(id,updatedData,{new:true})
   
   res.status(200).json({success:'true',message:'Product Updated Successfully',data:data})
    }catch(err){
    res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}

const deleteProduct=async(req,res)=>{
    try{
const id=req.params.id;
let data=await productModel.findByIdAndDelete(id)
res.status(200).json({success:true,message:"data deleted Successfully",data:data})
}catch(err){
         res.status(500).json({success:false,err:err.toString(),message:'Something went wrong'})
    }
}
module.exports={createProduct,allProduct,singleProduct,updateProduct,deleteProduct}