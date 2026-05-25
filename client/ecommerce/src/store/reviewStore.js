import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config";
import { ErrorToast,SuccessToast } from "../helper/helper";


const reviewStore=create((set)=>({
    //create reviewStore
    createReviewLoading:null,
    createReviewRequest:async(data)=>{
    try{
    set({createReviewLoading:true})
    let res=await axios.post(baseURL+`/create-review`,data,{
        withCredentials:true,
        credentials:"include"
    })
    if(res?.data?.success === true){
        set({createReviewLoading:false})
      SuccessToast(res?.data?.message)
      return true
    }else{
        set({createReviewLoading:false});
        ErrorToast(res?.data?.message);
        return false;
    }
    }catch(err){
     console.log(err);
     set({createReviewLoading:false})
     return false;
    }
    },

   //Show all review
totalReview:null,
allReview:null,
allReviewRequest:async(per_page,page_no)=>{
    try{
 let res=await axios.get(baseURL+`/all-review/${per_page}/${page_no}`,{
    withCredentials:true,
    credentials:"include"
 });

 if(res?.data?.success === true){
    set({allReview:res?.data?.data})
    set({totalReview:res?.data?.data?.totalCount?.[0]?.count})
 }
    }catch(err){
        console.log(err)
        return false;
    }
},

//single review
singleReview:null,
singleReviewRequest:async(data)=>{
    try{
 let res=await axios.post(baseURL+`/single-review`,data,{
    withCredentials:true,
    credentials:'include'
 });
 if(res?.data?.success === true){
    set({singleReview:res?.data?.data?.[0]})
 }
    }catch(err){
        console.log(err)
        return false
    }
},

//all Review-by-Product
allReviewByProduct:[],
allReviewByProductRequest:async(id)=>{
    try{
let res=await axios.get(baseURL+`/all-review-by-product/${id}`,{
    withCredentials:true,
    credentials:"include"
});
if(res?.data?.success===true){
    set({allReviewByProduct:res?.data?.data})
}
    }catch(err){
        console.log(err)
        return false;
    }
}

}))

export default reviewStore;