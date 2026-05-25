const { categoryModel } = require("../model/categoryModel");
const { productModel } = require("../model/productModel");

const createCategory=async(req,res)=>{
    try{
const {category_name,category_img}=req.body;
let data=await categoryModel.create({category_img,category_name})
res.status(200).json({success:true,message:'Category Created Successfully',data:data})
    }catch(err){
    res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
    }
}

const allCategory=async(req,res)=>{
    try{
 let page_no=Number(req.params.page_no);
 let per_page=Number(req.params.per_page)
 let skipRow=(page_no-1)*per_page;
 let sortStage={createdAt:-1};

 let joinWWithProduct={$lookup:{
    from:'products',localField:'_id',foreignField:'category_id',as:'products'
}}

const addProductCount={$addFields:{totalProducts:{$size:'$products'}}}

let facetStage={
    $facet:{
        totalCount:[{$count:'count'}],
        categories:[
            {$sort:sortStage},
            {$skip:skipRow},
            {$limit:per_page},
            joinWWithProduct,
            addProductCount,
            {$project:{
                updatedAt:0,
                products:0
            }}
        ]
    }
}

let data=await categoryModel.aggregate([facetStage])
res.status(200).json({success:true,message:'Category Fetched Success',data:data[0]})


}catch(err){
       res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
    }
}

const singleCategory=async(req,res)=>{
    try{
 const id=req.params.id;
 let data=await categoryModel.findById(id)
 res.status(200).json({success:true,message:'Category Fetched Success',data})
    }catch(err){
         res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
    }
}

const updateCategory=async(req,res)=>{
    try{
  let id=req.params.id;
  const {category_name,category_img}=req.body;
  let data=await categoryModel.findByIdAndUpdate(id,{category_img,category_name})
 res.status(200).json({success:'true',message:'Updated Success',data:data})    
}catch(err){
      res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
     
    }
}

const deleteCategory=async(req,res)=>{
 try{
 let id=req.params.id;
 let product=await productModel.find({category_id:id})
 if(product.length>0){
    return res.status(200).json({success:false,message:'Please delete product from product model first '})
 }
 await categoryModel.findByIdAndDelete(id)
 res.status(200).json({success:true,message:'Category delete Success'})
 }catch(err){
   res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
     
 }
}

module.exports={createCategory,allCategory,singleCategory,updateCategory,deleteCategory}