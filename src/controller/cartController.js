const { cartModel } = require("../model/cartModel");
const { productModel } = require("../model/productModel");
const mongoose=require('mongoose')
const objectId=mongoose.Types.ObjectId;



const createCart=async(req,res)=>{
try {
    const { product_id, product_name, color, qty, size } = req.body;

    let user_id = req.headers.id;

    // find the stock products
    let product = await productModel.findById(product_id);

    // Find existing cart
    let existingCart = await cartModel.findOne({
      user_id,
      product_id,
      product_name,
      color,
      size,
    });

    if (!!existingCart === true) {
      // For existing products
      let newReqBody = {
        user_id,
        product_id,
        product_name,
        color,
        size,
        qty: parseInt(existingCart.qty) + parseInt(qty),
      };

      const carts = await cartModel.find({ product_id }).select("qty");
      const totalQty = carts.reduce((sum, item) => sum + Number(item.qty), 0);
      if (Number(product?.stock) < Number(Number(totalQty) + Number(qty))) {
       // console.log("ok1",product?.stock,Number(Number(totalQty) + Number(qty)))
        return res.status(200).json({
          success: false,
          message: "You have added all the products in stock.",
        });
      }
      const updateData = await cartModel.updateOne(
        { _id: existingCart._id, user_id: existingCart.user_id },
        { $set: newReqBody }
      );

      res.status(200).json({
        success: true,
        message: "Cart update.",
        updateData,
      });
    } else {
      // For new products
      const carts = await cartModel.find({ product_id }).select("qty");
      const totalQty = carts.reduce((sum, item) => sum + Number(item.qty), 0);

       if (Number(product?.stock) < Number(Number(totalQty) + Number(qty))) {
         //console.log("ok2",product?.stock,(totalQty+qty))
        return res.status(200).json({
          success: false,
          message: "You have added all the products in stock. ",
        });
      }

      const data = await cartModel.create({
        user_id,
        product_id,
        product_name,
        color,
        qty,
        size,
      });

      res.status(200).json({
        success: true,
        message: "Product add to cart successfully",
        data,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Something went wrong.",
    });
  }

}

const readCart=async(req,res)=>{
    try{
        const user_id=new objectId(req.headers.id);
        //console.log(user_id)
        const matchStage={$match:{ user_id }}
        const JoinWithProduct={$lookup:{
            from:'products',localField:'product_id',foreignField:'_id',as:"product"
        }}
        const unwind3={$unwind:'$product'}
        const JoinWithBrand={$lookup:
        {from:'brands',localField:'product.brand_id',foreignField:'_id',as:'brand'}}
const JoinWithCategory={$lookup:{
    from:'categories',localField:'product.category_id',foreignField:'_id',as:'category'
}}
const unwind1={$unwind:"$brand"} //Brand is not inserted into my brand collection for this unwind1 is not provided into the aggregate pipeline
const unwind2={$unwind:"$category"}
let projectionStage = {
      $project: {
        _id: 1,
        user_id: 0,
        "product._id": 0,
        "product.category_id": 0,
        "product.brand_id": 0,
        "product.createdAt": 0,
        "product.updatedAt": 0,
        "product.description": 0,
        "brand._id": 0,
        "brand.createdAt": 0,
        "brand.updatedAt": 0,
        "category._id": 0,
        "category.createdAt": 0,
        "category.updatedAt": 0,

        category_id: 0,
        brand_id: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    };

const data=await cartModel.aggregate([matchStage,JoinWithProduct,unwind3,JoinWithBrand,JoinWithCategory,unwind2,projectionStage])
res.status(200).json({success:true,message:'Cart Fetched successfully',data:data})
}catch(err){
      res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})  
    }

}


const updateCart=async(req,res)=>{
  try{
const {product_id,qty,inc}=req.body;
let user_id=req.headers.id;
let cart_id=new objectId(req.params.cart_id);
let initQty=1;
if(inc){
let product=await productModel.findById(product_id);

const carts=await cartModel.find({product_id}).select("qty");
const totalQty=carts.reduce((sum,item)=>sum+Number(item.qty),0)

if(Number(product?.stock) >= Number(totalQty+initQty)){
 
  const data=await cartModel.updateOne(
    {_id:cart_id,user_id:user_id},
    {$set:{user_id,product_id,qty}}
  )
  return res.status(200).json({success:true,message:"Cart Update Successfully",data})
}else{
return res.status(200).json({success:false,message:'You added all product in stock'})
}
}else{
 const data=await cartModel.updateOne({_id:cart_id,user_id:user_id},
   {$set:{user_id,product_id,qty}}
 );
 return res.status(200).json({success:true,message:'Cart Updated Successfully',data})
}
  }catch(err){
  res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})  
  }
}


// const updateCart=async(req,res)=>{
//   try{
//  const {product_id,qty,inc}=req.body;
//  const user_id= req.headers.id;
//  const cart_id=new objectId(req.params.cart_id);
// let initQty=1;
// if(inc){
// let product=await productModel.find({_id:product_id})
// console.log(product?.stock)
// const cart=await cartModel.find({product_id}).select("qty");

// const totalQty=cart.reduce((sum,item) => sum+Number(item.qty),0)

// if(Number(product?.stock) >= Number(Number(totalQty)+Number(initQty))){
  
// const data=await cartModel.updateOne(
//   {_id:cart_id,user_id:user_id},
//   {$set:{user_id,product_id,qty}}
// )
// return res.status(200).json({success:true,message:'Cart Update Success inc+1',data:data})

// }else{
//   console.log(product?.stock)
//   //console.log(product?.stock,Number(Number(totalQty)+Number(initQty)))
//  return res.status(200).json({success:false,message:'You have added all cart'})
// }
// }else{
//  const data=await cartModel.updateOne(
//   {_id:cart_id,user_id:user_id},
//   {$set:{user_id,product_id,qty}}
//  )

// return res.status(200).json({success:true,message:'Cart Update Success inc-1',data:data})
// }
//   }catch(err){
// res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})  
//   }
// }



const deleteCart=async(req,res)=>{
  try{
 let cart_id=new objectId(req.params.cart_id)
 let data=await cartModel.deleteOne(cart_id)
 return res.status(200).json({success:true,message:'Cart deleted Successfully'})
  }catch(err){
    res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})  
  }
}
module.exports={createCart,readCart,updateCart,deleteCart}
