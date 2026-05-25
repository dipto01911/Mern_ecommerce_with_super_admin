import { FaArrowRotateRight } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Paginate from "../helper/Paginate";
import { useEffect, useState } from "react";
import brandStore from "../store/brandStore";
import categoryStore from "../store/categoryStore";
import productStore from "../store/productStore";
import { baseURLFile } from "../helper/config";

const AllProduct = () => {
  const navigate=useNavigate();
  const[searchParams]=useSearchParams();
  const [activeButton,setActiveButton]=useState("grid-view");
  const [search,setSearch]=useState("")

  const category_id=searchParams.get('category_id')  || 0;
  const brand_id=searchParams.get("brand_id") || 0;
  const remark=searchParams.get('remark') || 0;
  const keyword=searchParams.get('keyword') || 0;
  const per_page=2;
  const page_no = searchParams.get("page_no") ||1;

const {allBrand,allBrandRequest}=brandStore();
const {allCategory,allCategoryRequest}=categoryStore();
const {totalProducts,allProducts,allProductRequest}=productStore();

useEffect(()=>{
  (async()=>{
 await allProductRequest(category_id,
        brand_id,
        remark,
        keyword,
        per_page,
        page_no)
  })()

},[category_id,
        brand_id,
        remark,
        keyword,
        per_page,
        page_no])

      
useEffect(()=>{
  (async()=>{
    await allCategoryRequest(100,1);
    await allBrandRequest(100,1)
  })()
},[allCategoryRequest,allBrandRequest])

console.log('category',allCategory)
console.log('brand',allBrand)

  //console.log(allProducts)     
const handleSearchClick=async()=>{
  navigate(`/all-products?category_id=${0}&brand_id=${0}&remark=${0}&keyword=${search}&per_page=${per_page}&page_no=${1}`)
await allProductRequest(0,0,0,search,per_page,1)
}


  const handleClick=(buttonName)=>{
    setActiveButton(buttonName);
  }

const handelPageClick=async(event)=>{
let page_no=event.selected;
console.log(event)
  await allProductRequest(
    category_id,
        brand_id,
        remark,
        keyword,
        per_page,
        page_no+1
  );
navigate(`/all-products?category_id=${category_id}&brand_id=${brand_id}&remark=${remark}&keyword=${keyword}&per_page=${per_page}&page_no=${page_no+1}`)
  
}

const handelCategoryClick=async(cat_id)=>{
  navigate(`/all-products?category_id=${cat_id}&brand_id=${0}&remark=${0}&keyword=${0}&per_page=${per_page}&page_no=${1}`)
await allProductRequest(cat_id,0,0,0,per_page,1)
}

const handelBrandClick=async(brand_id)=>{
  navigate(`/all-products?category_id=${0}&brand_id=${brand_id}&remark=${0}&keyword=${0}&per_page=${per_page}&page_no=${1}`)
  await allProductRequest(0,brand_id,0,0,per_page,1)
}

const resetClick=async()=>{
  navigate(`/all-products?category_id=${0}&brand_id=${0}&remark=${0}&keyword=${0}&per_page=${per_page}&page_no=${1}`)
  await allProductRequest(0,0,0,0,per_page,1)
}

  return (
    <>
      <section className="breadcrumb breadcrumb-one padding-y-60 section-bg position-relative z-index-1 overflow-hidden">
        <img
          src="assets/images/gradients/breadcrumb-gradient-bg.png"
          alt=""
          className="bg--gradient"
        />
        <img
          src="assets/images/shapes/element-moon3.png"
          alt=""
          className="element one"
        />
        <img
          src="assets/images/shapes/element-moon1.png"
          alt=""
          className="element three"
        />
        <div className="container container-two">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="breadcrumb-one-content">
                <h3 className="breadcrumb-one-content__title text-center mb-3 text-capitalize">
                  {totalProducts} products available for purchase
                </h3>
                <p className="breadcrumb-one-content__desc text-center text-black-three">
                  Explore the best Product available for sale. Our unique
                  collection is hand-curated by experts. Find and buy the
                  perfect premium product.
                </p>
                <div className="search-box">
                  <input onChange={(e)=>setSearch(e.target.value)}
                    type="text"
                    className="common-input common-input--lg pill shadow-sm"
                    placeholder="Search product & more..."
                  />
                  <button onClick={handleSearchClick} className="btn btn-main btn-icon icon border-0">
                    <img src="assets/images/icons/search.svg" alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={`all-product padding-y-120 ${
        activeButton==="list-view"?"list-view":" "
      }`}>
        <div className="container container-two">
          <div className="row">
            <div className="col-lg-12">
              <div className="filter-tab gap-3 flx-between">
                <div className="gap-3 flx-between">
                  <button onClick={resetClick}
                    type="button"
                    className="filter-tab__button btn btn-outline-light pill d-flex align-items-center"
                  >
                    <span className="icon icon-left">
                      <FaArrowRotateRight />
                    </span>
                    <span className="font-18 fw-500">Reset</span>
                  </button>
                </div>

                <div className="list-grid d-flex align-items-center gap-2">
                  <button
                    className={`list-grid__button list-button d-sm-flex d-none text-body ${
                      activeButton ==="list-view" ? "active" : " "
                    }`} onClick={()=>handleClick("list-view")}
                  >
                    <i className="las la-list" />
                  </button>
                  <button
                  className={`list-grid__button grid-button d-sm-flex d-none  text-body ${
                    activeButton === "grid-view" ? "active" :" "
                  }`}
                   onClick={()=>handleClick("grid-view")} >
                    <i className="las la-border-all" />
                  </button>
                  <button className="list-grid__button sidebar-btn text-body d-lg-none d-flex">
                    <i className="las la-bars" />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4">
              {/* ===================== Filter Sidebar Start ============================= */}
              <div className={`filter-sidebar`}>
                <button
                  type="button"
                  className="filter-sidebar__close p-2 position-absolute end-0 top-0 z-index-1 text-body hover-text-main font-20 d-lg-none d-block"
                >
                  <i className="las la-times" />
                </button>

                {/* sidebar item */}
                <div className="filter-sidebar__item">
                  <div>
                    <button
                      type="button"
                      className="filter-sidebar__button font-16 text-capitalize fw-500"
                    >
                      Category
                    </button>
                    <div className="filter-sidebar__content">
                      <ul className="filter-sidebar-list">
                        {allCategory?.map((item,index)=>(
                              <li onClick={()=>handelCategoryClick(item?._id)} key={index} className="filter-sidebar-list__item courser">
                          <span className="filter-sidebar-list__text">
                          {item?.category_name} <span className="qty">{item?.totalProducts}</span>
                          </span>
                        </li>
                        ))}
                        
                    
                      </ul>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="filter-sidebar__button font-16 text-capitalize fw-500"
                    >
                      Brands
                    </button>
                    <div className="filter-sidebar__content">
                      <ul className="filter-sidebar-list">
                        {allBrand?.map((item,index)=>(
                           <li onClick={()=>handelBrandClick(item?._id)} key={index} className="filter-sidebar-list__item courser">
                          <span className="filter-sidebar-list__text">
                            {item?.brand_name} <span className="qty">{item?.totalProducts}</span>
                          </span>
                        </li>
                        ))}
                       
                        
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* ===================== Filter Sidebar End ============================= */}
            </div>
            <div className="col-xl-9 col-lg-8">
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="pills-product"
                  role="tabpanel"
                  aria-labelledby="pills-product-tab"
                  tabIndex={0}
                >
                  <div className="row gy-4 list-grid-wrapper">
                    {allProducts.length === 0 && (
                      <div className="flx-align gap-2 justify-content-center">
                        <h4>
                          <p className="mt-5">No Product found</p>
                        </h4>
                      </div>
                    )}
                    {allProducts?.map((item,index) => (
                      <div key={index} className="col-xl-3 col-lg-4 col-sm-6">
                        <div className="product-item">
                          <div className="product-item__thumb d-flex">
                            <Link
                              to={`/product-details?product_id=${item?._id}`}
                              className="link w-100"
                            >
                              <img
                               src={`${baseURLFile}/${item?.images?.[0]}`}
                                alt=""
                                className="cover-img"
                              />
                            </Link>
                          </div>
                          <div className="product-item__content">
                            <h6 className="product-item__title">
                              <Link
                                to={`/product-details?product_id=${item?._id}`}
                                className="link"
                              >
                                {item?.title}
                              </Link>
                            </h6>
                            <div className="product-item__info flx-between gap-2">
                              <span className="product-item__author">
                                <span className="link hover-text-decoration-underline">
                                  Admin
                                </span>
                              </span>
                            </div>
                            <div className="product-item__bottom flx-between  gap-2">
                              <div className="flx-align gap-2">
                                <h6 className="product-item__price mb-0">
                                  {item?.is_discount === false ?
                                  `${item?.price}`:`${item?.discount_price}`}
                                </h6>
                                <span className="product-item__prevPrice text-decoration-line-through">
                                {item?.is_discount === false
                                ?" ":`${item?.price}`}
                                </span>
                              </div>
                              <Link
                                to={`/product-details?product_id=${item?._id}`}
                                className="btn btn-outline-light btn-sm pill"
                              >
                                View Product
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <nav aria-label="Page navigation example">
                   {allProducts.length>0 && <Paginate
                      handelPageClick={handelPageClick}
                      page_no={page_no}
                      per_page={per_page}
                      totalCount={totalProducts}
                    />}
                    
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProduct;
