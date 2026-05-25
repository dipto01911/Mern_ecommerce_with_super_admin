import axios from "axios";
import { create } from "zustand";
 import { baseURL } from "../helper/config";



 const productStore=create((set)=>({
    //all productStore

    totalProducts:null,
    allProducts:[],
    allProductRequest:async(
        category_id,
        brand_id,
        remark,
        keyword,
        per_page,
        page_no)=>{
         try{
let res=await axios.get(baseURL+`/all-product/${category_id}/${brand_id}/${remark}/${keyword}/${per_page}/${page_no}`,{
   withCredentials:"true",
   credentials:"include"
  
})

if(res?.data?.success === true){
   set({allProducts:res?.data?.data?.products});
   set({totalProducts:res?.data?.data?.totalCount?.[0]?.count})
}
         }catch(err){
     console.log(err)
     return false;
         }
        
    },

   //all New Arrival productStore
allNewArrivalProducts:null,
newArrivalProductRequest:async(item)=>{
   try{
 let res=await axios.get(baseURL+`/all-product/0/0/0/0/${item}/1`,{
    withCredentials:"true",
    credentials:"include",

 });

if(res?.data?.success === true){
   set({allNewArrivalProducts:res?.data?.data?.products });
}

   }catch(err){
      console.log(err)
      return false;
   }
},

//Single Product

singleProduct:null,
singleProductsRequest:async(id)=>{
   try{
let res=await axios.get(baseURL+`/single-product/${id}`,{
   withCredentials:"true",
   credentials:"include"
});

if(res?.data?.success === true){
   set({singleProduct:res?.data?.data?.[0]});
   return res?.data?.data?.[0];
}
   }catch(err){
   console.log(err)
   return false;
   }
},


 }))


 export default productStore;