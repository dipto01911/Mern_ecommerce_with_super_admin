import { useEffect, useState } from "react"
import userStore from "../store/userStore"
import { getToken } from "../helper/helper"
import { Navigate } from "react-router-dom"

const PrivateRoute=({children})=>{
    const [isLogin,setIsLogin]=useState(false)
    const[loading,setLoading]=useState(true)

    let {userRequest,userVerifyRequest}=userStore();

    useEffect(()=>{
        (async()=>{
            try{
          await userRequest();
            await userVerifyRequest();
            let result= getToken();
            console.log(result)
            if(result){
                setIsLogin(true)
            }else{
                setIsLogin(false)
            }
            }catch(err){
            console.log(err)
            setIsLogin(false)
            }finally{
           setLoading(false)
            }
        })()
    },[userRequest,userVerifyRequest])

    if(loading){
        return <></>
    }
    return isLogin ? children : <Navigate to='/login'/>
}

export default PrivateRoute;