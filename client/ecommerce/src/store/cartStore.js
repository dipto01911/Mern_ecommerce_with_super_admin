

import  axios  from 'axios';
import {create} from 'zustand';
import { baseURL } from '../helper/config';
import { SuccessToast,ErrorToast } from '../helper/helper';
import Cart from './../components/Cart';

const cartStore=create((set)=>({

//create Cart

createCartLoading:false,
createCartRequest:async(data)=>{
    try{
 set({createCartLoading:true})
 let res=await axios.post(baseURL+`/create-cart`,data,{
         withCredentials:true,
         credentials:"include"
 })

 if(res?.data?.success === true){
    set({createCartLoading:false})
    SuccessToast(res?.data?.message)
    return true;
 }else{
    set({createCartLoading:false})
    ErrorToast(res?.data?.message)
    return false;
 }

    }catch(err){
        console.log(err)
        if(err.status === 401){
            return 401;
        }
        set({createCartLoading:false})
        return false;
    }
},

updateCartLoading:false,
updateCartRequest:async(cart_id,data)=>{
    try{
set({updateCartLoading:true})
let res=await axios.post(baseURL+`/update-cart/${cart_id}`,data,{
    withCredentials:true,
    credentials:"include"
});

if(res?.data?.success === true){
    set({updateCartLoading:false})
   SuccessToast(res?.data?.message)
    return true;
}else{
    set({updateCartLoading:false})
    ErrorToast(res?.data?.message)
    return false;
}

    }catch(err){
        console.log(err);
        if(err.status === 401){
            return 401;
        }
        set({updateCartLoading:false})
        return false
    }
},

//read all Cart

allCart:[],
allCartRequest:async()=>{
    try{
  let res=await axios.get(baseURL+`/read-cart`,{
    withCredentials:true,
    credentials:"include"
  })
if(res?.data?.success === true){
    set({allCart:res?.data?.data})
}

    }catch(err){
   console.log(err)
   return false;
 }
},

deleteCartLoading:false,
deleteCartRequest:async(id)=>{
 try{
 set({deleteCartLoading:true})
 let res = await axios.get(baseURL+`/delete-cart/${id}`,{
    withCredentials:true,
    credentials:"include",
 });
 if(res?.data?.success === true){
    set({deleteCartLoading:false})
    SuccessToast(res?.data?.message)
    return true;
 }else{
    set({deleteCartLoading:false})
    ErrorToast(res?.data?.message)
    return false;
 }
 }catch(err){
    console.log(err)
    set({deleteCartLoading:false})
    return false;
 }
}



}))

export default cartStore;