import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config";
import { ErrorToast,SuccessToast } from "../helper/helper";

const invoiceStore=create((set)=>({
//create-invoice
createInvoiceLoading:true,
createInvoiceRequest:async()=>{
    try{
 let res=await axios.get(baseURL+'/create-invoice',{
    withCredentials:true,
    credentials:"include"
 });
 if(res?.data?.success===true){
  set({createInvoiceLoading:false});
  SuccessToast(res?.data?.message)
  window.location.href=res?.data?.data?.GatewayPageURL;
  return true;
 }else{
 set({createInvoiceLoading:false});
 ErrorToast(res?.data?.message);
 return false;
 }
    }catch(err){
        console.log(err)
        ErrorToast("Something went wrong")
        return false;
    }
},
updateInvoiceLoading:false,
updateInvoiceRequest:async(data)=>{
    try{
set({updateInvoiceLoading:true})
let res=await axios.put(baseURL+`/update-invoice`,data,{
    withCredentials:true,
    credentials:"include"
});
if(res?.data?.success === true){
 set({updateInvoiceLoading:false})
 SuccessToast(res?.data?.message)
 return true;
}else{
 set({updateInvoiceLoading:false})
 ErrorToast(res?.data?.message)
 return false;
}
    }catch(err){
    console.log(err)
    set({createInvoiceLoading:false})
    return false;
    }
},

//all-order-list
totalAllOrderList:null,
allOrderList:null,
allOrderListRequest:async(per_page,page_no)=>{
    try{
 let res=await axios.get(baseURL+`/all-order-list/${per_page}/${page_no}`,{
    withCredentials:true,
    credentials:"include"
 });
if(res?.data?.success === true){
    set({allOrderList:res?.data?.data?.products})
    set({totalAllOrderList:res?.data?.data?.totalCount?.[0].count})
    return res?.data?.data?.products;
}

}catch(err){
        console.log(err)
        ErrorToast("Something went wrong")
        return false;
    }
},


//read-all-invoice-single-use
totalInvoiceSingleUser:null,
readAllInvoiceSingleUser:null,
allInvoiceSingleUserRequest:async(per_page,page_no)=>{

    try{
  let res=await axios.get(baseURL+`/read-all-invoice-single-user`,{
    withCredentials:true,
    credentials:"include",
  })

  if(res?.data?.success===true){
    set({readAllInvoiceSingleUser:res?.data?.data?.data})
    set({totalInvoiceSingleUser:res?.data?.data?.totalCount?.[0]?.count});
  }
    }catch(err){
        console.log(err)
        return false;
    }
},
//read-single-invoice-single-user
readSingleInvoiceSingleUser:null,
singleInvoiceSingleUserRequest:async(id)=>{
    try{
 let res=await axios.get(baseURL+`/read-single-invoice-single-user/${id}`,{
    withCredentials:true,
    credentials:"include"
 });
 if(res?.data?.success === true){
    set({readSingleInvoiceSingleUser:res?.data?.data})
 }
    }catch(err){
        console.log(err)
        return false;
    }
},
//read-invoice-product-list-single-user
totalInvoiceProduct:null,
readInvoiceProductListSingleUser:null,
readInvoiceProductListSingleUserRequest:async(per_page,page_no)=>{
    try{
  let res=await axios.get(baseURL+`/read-invoice-product-list-single-user/${per_page}/${page_no}`,{
    withCredentials:true,
    credentials:"include"
  });
  if(res?.data?.success === true){
    set({readInvoiceProductListSingleUser:res?.data?.data?.product})
    set({totalInvoiceProduct:res?.data?.data?.totalCount?.[0]?.count})
  }
    }catch(err){
        console.log(err)
        return false;
    }
}

}))

export default invoiceStore