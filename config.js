const DATA_LIMIT='5mb'
 const URL_ENCODE=true;
 const RATE_LIMIT=15*60*1000
 const MAX_LIMIT=10000
 const WEB_CACHE=false
 const JWT_KEY='mysecretkey1256'
 const JWT_TIME='24h' 
 
const SSLCZ_STORE_ID="dipto69eb27322a051"
const SSLCZ_STORE_PASSWD="dipto69eb27322a051@ssl"
const SSLCZ_CURRENCY="BDT"
const SSLCZ_SUCCESS_URL="http://localhost:8080/api/v2/payment-success"
const SSLCZ_FAIL_URL="http://localhost:8080/api/v2/payment-fail"
const SSLCZ_CANCEL_URL="http://localhost:8080/api/v2/payment-cancel"
const SSLCZ_IPN_URL="http://localhost:8080/api/v2/ipn"

const SSLCZ_INIT_URL="https://sandbox.sslcommerz.com/gwprocess/v4/api.php"

 module.exports={DATA_LIMIT,URL_ENCODE,RATE_LIMIT,MAX_LIMIT,WEB_CACHE,JWT_KEY,JWT_TIME,
    SSLCZ_STORE_ID,SSLCZ_STORE_PASSWD,SSLCZ_CURRENCY,SSLCZ_SUCCESS_URL,SSLCZ_FAIL_URL,
    SSLCZ_CANCEL_URL,SSLCZ_IPN_URL,SSLCZ_INIT_URL
 }
