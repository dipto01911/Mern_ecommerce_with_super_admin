
import axios from 'axios';
import {create} from 'zustand';
import { baseURL } from './../helper/config';

const invoiceStore=create((set)=>({
 
//create invoiceStore
createInvoiceLoading:false,
createInvoiceRequest:async()=>{
    try{
 set({createInvoiceLoading:true})
 let res=await axios.get(baseURL+`/create-invoice`,{
    withCredentials:true,
    credentials:"include"
 });
if(res?.data?.success === true){
 set({createInvoiceLoading:false})
//SuccessToast(res?.data?.message)
 window.location.href=res?.data?.data?.GatewayPageURL;
 return true;
}else{
 set({createInvoiceLoading:false})
// ErrorToast(res?.data?.message)
 return false;
}

}catch(err){
console.log(err)
set({createInvoiceLoading:false})
return false;
    }
},

//read-all-invoice-single-user

totalInvoiceSingleUser:null,
readAllInvoiceSingleUser:null,
allInvoiceSingleUserRequest:async(per_page,page_no)=>{
    try{
  let res=await axios.get(baseURL+`/read-all-invoice-single-user/${per_page}/${page_no}`,{
    withCredentials:true,
    credentials:"include"
  });
  if(res?.data?.success === true){
    set({readAllInvoiceSingleUser:res?.data?.data?.data})
    set({totalInvoiceSingleUser:res?.data?.data?.totalCount?.[0]?.count})
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
let res= await axios.get(baseURL+`/read-single-invoice-single-user/${id}`,{
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
})

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


export default invoiceStore;