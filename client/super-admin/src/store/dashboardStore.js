
import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../helper/config";
import { ErrorToast,SuccessToast } from "../helper/helper";

const dashboardStore=create((set)=>({

    //dashboard-summary
    dashboard:null,
    dashboardRequest:async()=>{
        try{
 let res=await axios.get(baseURL+`/dashboard-summary`,{
    withCredentials:true,
    credentials:"include",
 });
 if(res?.data?.success === true){
    set({dashboard:res?.data?.data});
    SuccessToast(res?.data?.message)
    return true
 }
        }catch(err){
      console.log(err)
      ErrorToast('Something went wrong')
      return false;
        }
    }

}))


export default dashboardStore