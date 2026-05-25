import axios from "axios";
import {create} from "zustand"
import { baseURL } from './../helper/config';
import {  SuccessToast,ErrorToast} from '../helper/helper';
import Login from './../components/Login';
const userStore=create((set)=>({
    userRegisterLoading:false,
    userRegisterRequest:async(data)=>{
        try{
 
             set({userRegisterLoading:true});
             let res=await axios.post(baseURL+`/user-register`,data,{
                withCredentials:true,
                credentials:"include",
             })

             if(res?.data?.success===true){
                set({userRegisterLoading:false});
                SuccessToast(res?.data?.message)
                return true;
             }
              
        }catch(err){
            console.log(err)
            set({userRegisterLoading:false})
            return false;
        }
    },
//user-Login

    userLoginLoading:false,
    userLoginRequest:async(data)=>{
        try{
     set({userLoginLoading:true})
     let res=await axios.post(baseURL+`/user-login`,data,{
        withCredentials:true,
        credentials:"include",
     });
     if(res?.data?.success===true){
     set({userLoginLoading:false})
     SuccessToast(res?.data?.message)
     return true;
     }else{
      set({userLoginLoading:false})
      ErrorToast(res?.data?.message)
      return false;
     }
        }catch(err){
            console.log(err)
            set({userLoginLoading:false})
            return false
        }
    },
// get user data
    user:null,
    userRequest:async()=>{
        try{
let res=await axios.get(baseURL+`/user`,{
    withCredentials:true,
    credentials:"include",
});

if(res?.data?.success === true){
    set({user:res?.data?.data});
    return true;
}
    }catch(err){
            console.log(err)
            return false
        }
    },
  
    //user verify request
  userVerifyRequest:async()=>{
    try{
 await axios.get(baseURL+`/user-verify`,{
    withCredentials:true,
    credentials:"include",
 });
  return true
    }catch(err){
 console.log(err)
 if(err?.status === 401){
    window.location.href ='/login'
 }
 ErrorToast("Something went wrong");
 return false;
    }
  },

  //User Update 
  userUpdateLoading:false,
  userUpdateRequest:async(data)=>{
    try{
  set({userRegisterLoading:true});
  let res=await axios.post(baseURL+`/user-update`,data,{
    withCredentials:true,
    credentials:"include"
  });
  if(res?.data?.success===true){
    set({userUpdateLoading:false});
    SuccessToast(res?.data?.message)
    return true;
  }else{
    set({userUpdateLoading:false})
    ErrorToast(res?.data?.message);
    return false;
  }
    }catch(err){
 console.log(err)
 set({userUpdateLoading:false})
 return false
    }
  },

  //User Logout
  userLogoutRequest:async()=>{
    try{
 let res=await axios.get(baseURL+`/user-logout`,{
    withCredentials:true,
    credentials:"include",
 })
 if(res?.data?.success === true){
    return true;
 }else{
    return false;
 }
    }catch(err){
        console.log(err)
        return false;
    }
  }, 


}))

export default userStore;