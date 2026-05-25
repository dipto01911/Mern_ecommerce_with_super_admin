
const mongoose=require('mongoose');
const { cartModel } = require('../model/cartModel');
const { userModel } = require('../model/userModel');
const { invoiceModel } = require('../model/invoiceModel');
const {invoiceProductModel}=require('../model/invoiceProductModel')
const{productModel}=require('../model/productModel')
const objectId=mongoose.Types.ObjectId
const FormData=require('form-data')
const axios=require('axios')
const {Parser}=require('json2csv')
 const {SSLCZ_STORE_ID,SSLCZ_STORE_PASSWD,SSLCZ_CURRENCY,SSLCZ_SUCCESS_URL,SSLCZ_FAIL_URL,
     SSLCZ_CANCEL_URL,SSLCZ_IPN_URL,SSLCZ_INIT_URL}=require('../../config')

 let redirect_url='/cart-thank-you';

const createInvoice=async(req,res)=>{
 try{
 const user_id= new objectId(req.headers.id);
 const cus_email=req.headers.email;
 let matchStage={$match:{user_id}}
 let joinWithProduct={$lookup:{
    from:'products',localField:'product_id',foreignField:'_id',as:'product'
 }}

 let unwind1={$unwind:'$product'}
 let cartProducts=await cartModel.aggregate([matchStage,joinWithProduct,unwind1])
 //res.json(cartProducts)
if(cartProducts.length>0){
let totalAmount=0;
cartProducts.forEach((item)=>{
    let price;
    if(item?.product?.is_discount){
   price=parseFloat(item?.product?.discount_price)
    }else{
 price=parseFloat(item?.product?.price)
    }
    totalAmount=totalAmount+parseInt(item?.qty * price)
})
let vat=totalAmount*0.15
let shipping=75;

let totalPayable=totalAmount+vat+shipping;
//console.log(parseFloat(totalPayable).toFixed(2))

let user =await userModel.findById(user_id)
//res.json(user)
//console.log(user)
if([
user.cus_add,
user.cus_city,
user.cus_country,
user.cus_fax,
user.cus_name,
user.cus_phone,
user.cus_postcode,
user.cus_state,
user.ship_add,
user.ship_city,
user.ship_country,
user.ship_name,
user.ship_phone,
user.ship_postcode,
user.ship_state
].every((v)=> v===undefined)){
    return res.status(200).json({
          success: false,
          message:
            "Please go dashboard & complete your profile information data!",
        })
}

let cus_details={
    Name:user?.cus_name,
    Email:cus_email,
    Address:user?.cus_add,
    Phone:user?.cus_phone
};

let ship_details={
    Name:user?.ship_name,
    City:user?.ship_city,
    Address:user?.ship_add,
    Phone:user?.ship_phone
}

let tran_id = "tra-" + Date.now() + Math.floor(Math.random() * 90000000);
let val_id = "val-" + Date.now() + Math.floor(Math.random() * 90000000);

let createInvoice=await invoiceModel.create({
    user_id:user_id,
    payable:parseFloat(totalPayable).toFixed(2),
    cus_details:cus_details,
    ship_details:ship_details,
    tran_id:tran_id,
    val_id:val_id,
    vat:vat,
    total:totalAmount
})


let invoice_id=createInvoice._id;
cartProducts.forEach(async(item)=>{
    await invoiceProductModel.create({
       user_id: user_id,
          product_name: item?.product_name,
          product_id: item?.product_id,
          invoice_id: invoice_id,
          qty: item?.qty,
          price:
            item.product.is_discount === true
              ? item?.product?.discount_price
              : item?.product?.price,
          color: item?.color,
          size: item?.size,
  
    })
})
      for (const item of cartProducts) {
        await productModel .updateOne(
          { _id: item.product_id },
          { $inc: { stock: -item.qty } }
        );
      }

     await cartModel.deleteMany({ user_id: user_id });

   let paymentSetting={
  store_id:SSLCZ_STORE_ID,
  store_passwd:SSLCZ_STORE_PASSWD,
  currency:SSLCZ_CURRENCY,
  success_url:SSLCZ_SUCCESS_URL,
  fail_url:SSLCZ_FAIL_URL,
  cancel_url:SSLCZ_CANCEL_URL,
  ipn_url:SSLCZ_IPN_URL,
  init_url:SSLCZ_INIT_URL
   
}

let form=new FormData()

form.append("store_id",paymentSetting.store_id);
form.append("store_passwd",paymentSetting.store_passwd);
form.append("total_amount",totalPayable.toString());
form.append("currency",paymentSetting.currency);
form.append('tran_id',tran_id);
form.append("success_url",`${paymentSetting.success_url}/${tran_id}`);
form.append("fail_url",`${paymentSetting.fail_url}/${tran_id}`);
form.append("cancel_url",`${paymentSetting.cancel_url}/${tran_id}`);
form.append("ipn_url",`${paymentSetting.ipn_url}/${tran_id}`);

form.append("cus_name",user?.cus_name)
form.append("cus_email",cus_email)
form.append("cus_add1",user?.cus_add)
form.append("cus_add2",user?.cus_add)
form.append("cus_city",user?.cus_city)
form.append("cus_state",user?.cus_state)
form.append("cus_postcode",user?.cus_state)
form.append("cus_country",user?.cus_country)
form.append("cus_phone",user?.cus_phone)


form.append("shipping_method","YES")
form.append("ship_name",user?.ship_name)
form.append("ship_add1",user?.ship_add)
form.append("ship_add2",user?.ship_add)
form.append("ship_city",user?.ship_city)
form.append("ship_state",user?.ship_state)
form.append("ship_country",user?.ship_country)
form.append("ship_postcode",user?.ship_postcode)
form.append("ship_phone",user?.ship_phone)


form.append("product_name","According Invoice")
form.append("product_category","According Invoice")
form.append("product_profile","According Invoice")
form.append("product_amount","According Invoice")

let SSLRes=await axios.post(paymentSetting.init_url,form);
 res.status(200).json({success:true,message:'Payment updated Successfully',data:SSLRes.data})
}
else{
 return res.status(200).json({success:false,message:'Cart empty!'})
}
 }catch(err){
 res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
 }
}

const readInvoiceSingleUser=async(req,res)=>{
    try{
    let page_no=Number(req.params.page_no);
    let per_page=Number(req.params.per_page)
    let user_id=new objectId(req.headers.id)

    let skipRow=(page_no-1)*per_page;
    let matchStage={$match:{user_id}}
    let sortStage={createdAt:-1}
    let facetStage={
        $facet:{
            totalCount:[{$count:"count"}],
            data:[
                {$sort:sortStage},
                {$skip:skipRow},
                {$limit:per_page}
            ]

        }
    }

let data=await invoiceModel.aggregate([matchStage,facetStage])
res.status(200).json({success:true,message:'Invoice fetched Successfully',data:data[0]})

    }catch(err){
        res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
}


const readSingleInvoiceSingleUser=async(req,res)=>{
 
    try{
       
        let invoice_id=new objectId(req.params.invoice_id)
        let matchStage={$match:{_id:invoice_id}}
        let joinWithInvoieProduct={$lookup:{
            from:'invoiceproducts',localField:'_id',foreignField:'invoice_id',as:"invoiceProducts"
        }}
       //let unwind1={$unwind:"$invoiceProducts"}
        let data =await invoiceModel.aggregate([matchStage,joinWithInvoieProduct])
        res.status(200).json({success:true,message:'Data Fetched Success',data:data[0]})
    }catch(err){
         res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
}


const readInvoiceProductListSingleUser=async(req,res)=>{
    try{
   let user_id=new objectId(req.headers.id)
   let per_page=Number(req.params.per_page)
   let page_no=Number(req.params.page_no)
   let skipRow=(page_no-1)*per_page;
   let sortStage={createdAt:-1}
   let matchStage={$match:{user_id}}
   let joinWithProduct={$lookup:{
    from:"products",localField:'product_id',foreignField:'_id',as:"product"
   }}
   //let unwind1={$unwind:"$product"}
  let facetStage={
    $facet:{
        "totalCount":[{$count:'count'}],
        product:[
            {$sort:sortStage},
            {$skip:skipRow},
            {$limit:per_page}
        ]
    }
  }
  
  let data=await invoiceProductModel.aggregate([matchStage,joinWithProduct, facetStage])
  res.status(200).json({success:true,message:'Data Fetched Success',data:data[0]})
}catch(err){
         res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
    }


const paymentSuccess=async(req,res)=>{
        try{
  let tran_id=req.params.tran_id;
    await invoiceModel.updateOne({tran_id:tran_id},{payment_status:"success"})
    res.redirect(redirect_url)
        }catch(err){
             res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
        }
    }
const paymentCancel=async(req,res)=>{
    try{
     let tran_id=req.params.tran_id;
    await invoiceModel.updateOne({tran_id:tran_id},{payment_status:"cancel"})
    res.redirect(redirect_url)
    }catch(err){
          res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
}

const paymentFail=async(req,res)=>{
    try{
     let tran_id=req.params.tran_id;
    await invoiceModel.updateOne({tran_id:tran_id},{payment_status:"failed"})
    res.redirect(redirect_url)
    }catch(err){
          res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
}

const paymentIpn=async(req,res)=>{
    try{
 let tran_id=req.params.tran_id;
 res.status(200).json({success:true,message:`Payment success on Invoice ${tran_id}`})
    }catch(err){
  res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
}

const allOrderList=async(req,res)=>{
    try{
 let page_no=Number(req.params.page_no)||1
 let per_page=Number(req.params.per_page)||10
let skipRow=(page_no-1)*per_page

const  {from,to}=req.query;

const fromDate = from
      ? new Date(`${from}T00:00:00`)
      : new Date("1970-01-01T00:00:00");

    const toDate = to ? new Date(`${to}T23:59:59.999`) : new Date();
  
    const matchStage = {
  $match: {
    createdAt: {
      $gte: fromDate,
      $lte: toDate
    }
  }
};

  const joinWithProduct={
    $lookup:{
        from:'invoiceproducts',localField:'_id',foreignField:'invoice_id',as:'product'
    }
  }
const facetStage={
    $facet:{
        totalCount:[{$count:"count"}],
        products:[
            {$sort:{createdAt:-1}},
            {$skip:skipRow},
            {$limit:per_page}
        ]
    }
}

let data=await invoiceModel.aggregate([matchStage,joinWithProduct,facetStage])
res.status(200).json({success:true,message:'Data Fetched Success',data:data[0]})
    }catch(err){
  res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
}


const exportCSV=async(req,res)=>{
    try{
    const {from,to}=req.query;
    const fromDate = from
      ? new Date(`${from}T00:00:00`)
      : new Date("1970-01-01T00:00:00");

    const toDate = to ? new Date(`${to}T23:59:59.999`) : new Date();

const matchStage = {
  $match: {
    createdAt: {
      $gte: fromDate,
      $lte: toDate
    }
  }
};
const sortStage={$sort:{createdAt:-1}}
const data=await invoiceModel.aggregate([matchStage,sortStage])
const fields=[
    "_id",
    "user_id",
    "payable",
    "deliver_status",
    "payment_status",
    "total",
    "vat",
    "createdAt"
]

const parser=new Parser({fields})
const csv=parser.parse(data)

res.header('Content-Type',"text/csv")
res.attachment("invoices.csv")
res.send(csv)
    }catch(err){
         res.status(500).json({success:false,message:'Something went wrong',data:err.toString()})
    }
}


const invoiceUpdate=async(req,res)=>{
    try{
 const { _id, user_id, delivery_status } = req.body;

    // Find the invoice
    const checkInvoice = await invoiceModel.findById(_id);
    if (!checkInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found!",
      });
    }

    //  Prevent multiple updates
    if (checkInvoice.delivery_status === "delivered") {
      return res.status(200).json({
        success: false,
        message: "Product already delivered!",
      });
    }
    if (checkInvoice.delivery_status === "cancel") {
      return res.status(200).json({
        success: false,
        message: "Product already canceled!",
      });
    }

    //  Handle logic based on payment_status
    const paymentStatus = checkInvoice.payment_status;

    if (paymentStatus === "success") {
      // ✅ Payment successful: allow deliver or cancel

      if (delivery_status === "delivered") {
        // Update invoice as delivered
        const data = await invoiceModel.findByIdAndUpdate(
          { _id, user_id },
          { delivery_status },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Product delivered successfully!",
          data,
        });
      }

      if (delivery_status === "cancel") {
        return res.status(200).json({
          success: false,
          message: "Payment is success. You can't cancel!",
        });
      }

      // Invalid delivery_status
      return res.status(200).json({
        success: false,
        message: "Invalid deliver status update!",
      });
    } else {
      //  Payment not successful: allow only cancel
      if (delivery_status === "cancel") {
        const invoiceProducts = await invoiceProductModel.find({
          invoice_id: _id,
        });
        // Restock each product
        for (const item of invoiceProducts) {
          await productModel.updateOne(
            { _id: item.product_id },
            { $inc: { stock: item.qty } }
          );
        }

        // Update invoice as canceled

        const data = await invoiceModel.findByIdAndUpdate(
          { _id, user_id },
          { delivery_status },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Unpaid order canceled and stock restored!",
          data,
        });
      }

      return res.status(200).json({
        success: false,
        message: "Cannot deliver because payment was not successful!",
      });
    }

    }catch(err){
 res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
    }
}


module.exports={createInvoice,readInvoiceSingleUser,
    readSingleInvoiceSingleUser,readInvoiceProductListSingleUser,paymentSuccess,
paymentCancel,paymentFail,paymentIpn,allOrderList,exportCSV,invoiceUpdate}