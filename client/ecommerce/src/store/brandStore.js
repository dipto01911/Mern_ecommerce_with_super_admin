import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config";

const brandStore=create((set)=>({

    allBrand:null,
    allBrandRequest:async(per_page,page_no)=>{
        try{
    let res = await axios.get(baseURL+`/all-brand/${per_page}/${page_no}`,{
        withCredentials:true,
        credentials:"include",
    })
    if(res?.data?.success === true){
        set({allBrand:res?.data?.data.brands})
    }
        }catch(err){
            console.log(err)
            return false;
        }
    }
}))

export default brandStore;