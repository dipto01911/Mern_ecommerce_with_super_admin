
import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config";
import { SuccessToast,ErrorToast } from "../helper/helper";

const productStore=create((set)=>({

    //create-product
    createProductLoading:false,
    createProductRequest:async(data)=>{
        try{
         set({createProductLoading:true})
         let res=await axios.post(baseURL+`/create-product`,data,{
            withCredentials:true,
            credentials:"include"
         });
         if(res?.data?.success===true){
            set({createProductLoading:false})
            SuccessToast(res?.data?.message)
            return true;
         }else{
             set({createProductLoading:false})
              ErrorToast(res?.data?.message)
              return false;
         }
        }catch(err){
            console.log(err)
            set({createProductLoading:false})
            return false;
        }
    },
    //all-product
    totalProducts:null,
    allProducts:[],
    allProductsRequest:async(
        category_id,
        brand_id,
        remark,
        keyword,
        per_page,
        page_no
    )=>{
        try{
 let res=await axios.get(baseURL+`/all-product/${category_id}/${brand_id}/${remark}/${keyword}/${per_page}/${page_no}`,{
    withCredentials:true,
    credentials:"include"
 });
 if(res?.data?.success===true){
 set({allProducts:res?.data?.data?.products})
 set({totalProducts:res?.data?.data?.totalCount?.[0]?.count})
 }
        }catch(err){

        }
    },
    //new Arrival product for homePage
    allNewArrivalProducts:null,
    newArrivalProductRequest:async()=>{
        try{
       let res=await axios.get(baseURL+`/all-product/0/0/0/0/8/1`,{
            withCredentials:true,
            credentials:"included"
        });
        if(res?.data?.success ===true){
            set({allNewArrivalProducts:res?.data?.data?.products})
        }
        }catch(err){
            console.log(err)

        }
      
    },
    //single-product
    singleProduct:null,
singleProductRequest:async(id)=>{
        try{
let res=await axios.get(baseURL+`/single-product/${id}`,{
    withCredentials:true,
    credentials:"include"
});
if(res?.data?.success === true){
    set({singleProduct:res?.data?.data?.[0]});
    return res?.data?.data?.[0]
}
        }catch(err){
     console.log(err)
     return false
     return false
        }
    },
//delete-product
deleteProductRequest:async(id)=>{
    try{
let res=await axios.get(baseURL+`/delete-product/${id}`,{
    withCredentials:true,
    credentials:"include"
});
if(res?.data?.success === true){
SuccessToast(res?.data?.message)
return true;
}else{
 ErrorToast(res?.data?.message)
 return false;
}
    }catch(err){
        console.log(err)
        ErrorToast("Something went wrong")
        return false;
    }
},

//update-product
updateProductRequest:async(id,data)=>{
    try{
let res=await axios.post(baseURL+`/update-product/${id}`,data,{
    withCredentials:true,
    credentials:"include"
});
if(res?.data?.success === true){
SuccessToast(res?.data?.message)
return true
}else{
 SuccessToast(res?.data?.message)
 return false
}
    }catch(err){
        console.log(err)
        ErrorToast('Something went wrong')
        return false
    }
},
//all-review



}))

export default productStore