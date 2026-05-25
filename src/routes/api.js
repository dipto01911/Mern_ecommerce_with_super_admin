const { register, Login, AdminRead, AdminVerify, AdminLogout, AdminUpdate } = require('../controller/adminController');
const { AuthAdmin } = require('../middleware/authVerificationAdmin');
const {userRegister, userLogin, userRead, userVerify, userLogout, userUpdate}=require('../controller/userController');
const { AuthUser } = require('../middleware/authVerificationUser');
const { createProduct, allProduct, singleProduct, updateProduct, deleteProduct } = require('../controller/productController');
const { createCategory, allCategory, singleCategory, updateCategory, deleteCategory } = require('../controller/categoryController');
const { createBrand, allBrand, singleBrand, updateBrand, deleteBrand } = require('../controller/brandController');
const { createReview, allReview, singleProductReview, SingleReview } = require('../controller/reviewController');
const { createCart, readCart, updateCart, deleteCart } = require('../controller/cartController');
const { createInvoice, readInvoiceSingleUser, readSingleInvoiceSingleUser, readInvoiceProductListSingleUser, paymentSuccess, paymentCancel, paymentFail, paymentIpn, allOrderList, exportCSV, invoiceUpdate } = require('../controller/invoiceController');
const { fileUploadMiddleware } = require('../middleware/fileUploadMiddleware');
const { fileUpload, allFile, fileRemove } = require('../controller/fileController');
const { dashedSummary } = require('../controller/dashboardController');

const router=require('express').Router();

//APi for super-admin

router.post('/admin-register',register)
router.post('/admin-login',Login)
router.get('/admin',AuthAdmin,AdminRead)
router.get('/admin-verify',AuthAdmin,AdminVerify)
router.get('/admin-logout',AuthAdmin,AdminLogout)
router.post('/admin-update',AuthAdmin,AdminUpdate)



//APi for user
router.post('/user-register',userRegister)
router.post('/user-login',userLogin)
router.get('/user',AuthUser,userRead)
router.get('/user-verify',AuthUser,userVerify)
router.get('/user-logout',AuthUser,userLogout)
router.post('/user-update',AuthUser,userUpdate)

//product APi

router.post('/create-product',AuthAdmin,createProduct)
router.get('/all-product/:category_id/:brand_id/:remark/:keyword/:per_page/:page_no',allProduct)
router.get('/single-product/:id',singleProduct)
router.post('/update-product/:id',AuthAdmin,updateProduct)
router.get('/delete-product/:id',AuthAdmin,deleteProduct)


//CategoryAPi
router.post('/create-category',AuthAdmin,createCategory)
router.get('/all-category/:per_page/:page_no',allCategory)
router.get('/single-category/:id',singleCategory)
router.post('/update-category/:id',AuthAdmin,updateCategory)
router.get('/delete-category/:id',AuthAdmin,deleteCategory)

//BrandAPi
router.post('/create-brand',AuthAdmin,createBrand)
router.get('/all-brand/:per_page/:page_no',allBrand)
router.get('/single-brand/:id',singleBrand)
router.post('/update-brand/:id',AuthAdmin,updateBrand)
router.get('/delete-brand/:id',AuthAdmin,deleteBrand)

//Review API
router.post('/create-review',AuthUser,createReview)
router.get('/all-review/:per_page/:page_no',allReview)
router.get('/all-review-by-product/:product_id',singleProductReview)
router.post('/single-review',AuthUser,SingleReview)
//Cart APi
router.post('/create-cart',AuthUser,createCart)
router.get('/read-cart',AuthUser,readCart)
router.post('/update-cart/:cart_id',AuthUser,updateCart)
router.get('/delete-cart/:cart_id',AuthUser,deleteCart)
//Invoice for user

router.get('/create-invoice',AuthUser,createInvoice)

router.get('/read-all-invoice-single-user/:per_page/:page_no',AuthUser,readInvoiceSingleUser)
router.get('/read-single-invoice-single-user/:invoice_id',readSingleInvoiceSingleUser)
router.get('/read-invoice-product-list-single-user/:per_page/:page_no',AuthUser,readInvoiceProductListSingleUser)


router.post('/payment-success/:tran_id',paymentSuccess)
router.post('/payment-cancel/:tran_id',paymentCancel)
router.post('/payment-fail/:tran_id',paymentFail)
router.post('/payment-ipn/:tran_id',paymentIpn)

//ForAdmin api
router.get('/all-order-list/:per_page/:page_no',AuthAdmin,allOrderList)
router.get('/export-csv',AuthAdmin,exportCSV)
router.put('/update-invoice',AuthAdmin,invoiceUpdate)


router.post('/file-upload',AuthAdmin,fileUploadMiddleware,fileUpload)
router.get('/all-file/:per_page/:page_no',AuthAdmin,allFile)
router.post('/file_remove',AuthAdmin,fileRemove)
router.get('/dashboard-summary',AuthAdmin,dashedSummary)

module.exports=router