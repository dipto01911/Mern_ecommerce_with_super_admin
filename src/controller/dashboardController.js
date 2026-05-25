const { brandModel } = require("../model/brandModel");
const { categoryModel } = require("../model/categoryModel");
const { invoiceModel } = require("../model/invoiceModel");
const { productModel } = require("../model/productModel");
const { reviewModel } = require("../model/reviewModel");
const { userModel } = require("../model/userModel")

const dashedSummary=async(req,res)=>{
    try{
 const totalUser=await userModel.countDocuments();
 const totalProduct=await productModel.countDocuments();
 const totalOrders=await invoiceModel.countDocuments();
 const totalReview=await reviewModel.countDocuments();
 const totalCategories=await categoryModel.countDocuments();
 const totalBrands=await brandModel.countDocuments();

const pendingOrders=await invoiceModel.countDocuments({
    delivery_status:"pending"
})
const deliveredOrders=await invoiceModel.countDocuments({
 delivery_status:"delivered"
})
const cancelOrders=await invoiceModel.countDocuments({
    delivery_status:"cancel"
})
const totalIncomingAgg=await invoiceModel.aggregate([
    {$match:{payment_status:"success"}},
    {$group:{_id:null,total:{$sum:"$payable"}}}
])
const totalIncome=totalIncomingAgg.length > 0 ? totalIncomingAgg[0].total:0;

res.status(200).json({success:true,message:'Dash board Fetched Success',data:{
    totalUser,totalProduct,totalOrders,totalReview,totalCategories,totalBrands,pendingOrders,deliveredOrders,cancelOrders,totalIncome
}})
    }catch(err){
        res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
}

module.exports={dashedSummary}