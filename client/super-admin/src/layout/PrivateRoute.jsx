// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { getToken } from "../helper/helper";

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../helper/helper";
import adminStore from "../store/adminStore";



const PrivateRoute = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  let { adminVerifyRequest, adminRequest} = adminStore();
  useEffect(() => {
    (async () => {
      try {
        await adminVerifyRequest();
        await adminRequest();
        let result = getToken();


        if (result) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.log(error);

        setIsLogin(false);
      } finally {
        setLoading(false); // Set loading to false after verification
      }
    })();
  }, [adminRequest,adminVerifyRequest]);

  

  if (loading) {
    return <div>checking auth ..</div>;
  }

  return isLogin ? children  : <Navigate to="/login" replace />;
};


// const PrivateRoute=({ children })=>{
// const [isLogin,setIsLogin]=useState(false);
// const [loading,setLoading]=useState(true);
// let{adminVerifyRequest,adminRequest}=adminStore();

// useEffect(()=>{
// (async()=>{
//   try{
// await adminVerifyRequest();
// await adminRequest();
// let result=getToken();
// if(result){
//   setIsLogin(true);
// }else{
//   setIsLogin(false);
// }

//   }catch(err){
//     console.log(err)
//     setIsLogin(false);
//   }finally{
//     setLoading(false);
//   }

// })()
// },[adminVerifyRequest,adminRequest]);

// if(loading){
//   return <></>
// }
// console.log(isLogin)
// return isLogin ? children  : <Navigate to='/login'/>

  
// }
export default PrivateRoute;
