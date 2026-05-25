const { brandModel } = require("../model/brandModel");
const { productModel } = require("../model/productModel");


const createBrand=async(req,res)=>{
    try{
const {brand_name,brand_img}=req.body;
let data=await brandModel.create({brand_img,brand_name})
res.status(200).json({success:true,message:'Brand Created Successfully',data:data})
    }catch(err){
    res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
    }
}

const allBrand=async(req,res)=>{
    try{
 let page_no=Number(req.params.page_no);
 let per_page=Number(req.params.per_page)
 let skipRow=(page_no-1)*per_page;
 let sortStage={createdAt:-1};

 let joinWWithProduct={$lookup:{
    from:'products',localField:'_id',foreignField:'brand_id',as:'products'
}}

const addProductCount={$addFields:{totalProducts:{$size:'$products'}}}

let facetStage={
    $facet:{
        totalCount:[{$count:'count'}],
        brands:[
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

let data=await brandModel.aggregate([facetStage]);
res.status(200).json({success:true,message:'Brand Fetched Success',data:data[0]})


}catch(err){
       res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
    }
}



const singleBrand=async(req,res)=>{
    try{
 const id=req.params.id;
 let data=await brandModel.findById(id)
 res.status(200).json({success:true,message:'Brand Fetched Success',data})
    }catch(err){
         res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
    }
}

const updateBrand=async(req,res)=>{
    try{
  let id=req.params.id;
  const {brand_name,brand_img}=req.body;
  let data=await brandModel.findByIdAndUpdate(id,{brand_img,brand_name})
 res.status(200).json({success:'true',message:'Updated Success',data:data})    
}catch(err){
      res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
     
    }
}

const deleteBrand=async(req,res)=>{
 try{
 let id=req.params.id;
 let product=await productModel.find({brand_id:id})
 if(product.length>0){
    return res.status(200).json({success:false,message:'Please delete product from product model first '})
 }
 await brandModel.findByIdAndDelete(id)
 res.status(200).json({success:true,message:'Brand delete Success'})
 }catch(err){
   res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
     
 }
}


module.exports={createBrand,allBrand,singleBrand,updateBrand,deleteBrand}