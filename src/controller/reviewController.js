const { reviewModel } = require("../model/reviewModel");
const mongoose=require('mongoose')
const objectId=mongoose.Types.ObjectId;


const createReview=async(req,res)=>{
    try{
    const {product_id,invoice_id,des,rating}=req.body;
    const user_id=req.headers['id']
    const data=await reviewModel.updateOne({user_id,product_id,invoice_id},
        {user_id,product_id,invoice_id,des,rating},{new:true,upsert:true}
    )
    res.status(200).json({success:true,message:'Review Create Success',data:data})

    }catch(err){
        res.status(500).json({success:'false',message:'Something went wrong',data:err.toString()})    
    }
}

const allReview=async(req,res)=>{
    try{
  const per_page=Number(req.params.per_page)
  const page_no=Number(req.params.page_no)
const skipRow=(page_no-1)*per_page;
const sortStage={createdAt: -1};
const JoinStageWithUser={
 $lookup:{
    from:'users',localField:'user_id',foreignField:'_id',as:"user"
 }
}
const JoinWithProductStage={
    $lookup:{
        from:'products',localField:'product_id',foreignField:'_id',as:'product'
    }
}

const unwindStage1={$unwind:'$user'}
const unwindStage2={$unwind:'$product'}
const ProjectionStage={$project:{
    _id:1,
    invoice_id:1,
    product_id:1,
    user_id:1,
    createdAt:1,
    des:1,
    rating:1,
    "user.cus_name":1,
    "user.email":1,
    "product.title":1,
    "product.images":1,
}
}

const facetStage={
    $facet:{
        totalCount:[{$count:'count'}],
        data:[
          {$sort:sortStage},
           {$skip: skipRow},
           {$limit:per_page},
           JoinWithProductStage,
            unwindStage2,
           JoinStageWithUser,
           unwindStage1,
           ProjectionStage

        ]
    }
}

const data=await reviewModel.aggregate([facetStage])

res.status(200).json({success:true,message:'Data Fetched Success',data:data[0]
})

    }catch(err){
       res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})     
    }
}



const singleProductReview=async(req,res)=>{
    try{
 const product_id=new objectId(req.params.product_id);
const matchStage={$match:{product_id}}
const JoinWithUser={$lookup:{
    from:'users',localField:'user_id',foreignField:'_id',as:'user'
}}
const unwind={$unwind:'$user'}
const projectionStage={$project:{
    createdAt:1,
    updatedAt:1,
    des:1,
    rating:1,
    "user.cus_name":1,
    "user.email":1
}}
const data=await reviewModel.aggregate([matchStage,JoinWithUser,unwind,projectionStage])
res.status(200).json({success:true,message:'Review Fetched Success',data:data})
    }catch(err){
        res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})    
    }
}







const SingleReview=async(req,res)=>{
    try{
let user_id=req.headers.id;
let{product_id,invoice_id}=req.body;
let matchingStage={
$match:{
    user_id:new objectId(user_id),
    product_id:new objectId(product_id),
    invoice_id:new objectId(invoice_id)
}
};

let data=await reviewModel.aggregate([matchingStage]);
res.status(200).json({
    success:true,message:'Review fetched Successfully',
    data:data
})

    }catch(err){
         res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})    
    }
}


module.exports={createReview,allReview,singleProductReview,SingleReview}