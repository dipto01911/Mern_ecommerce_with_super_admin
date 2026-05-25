import Slider from "react-slick";
import brandStore from "../store/brandStore";
import { useEffect } from "react";
import { baseURLFile } from './../helper/config';
import { Link } from "react-router-dom";


const BrandSectionOne = () => {
 
  const{allBrand,allBrandRequest}=brandStore();

useEffect(()=>{
  (async()=>{
    await allBrandRequest(100,1)
  })()
},[allBrandRequest])

//console.log(allBrand)

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          initialSlide: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="brand">
      <div className="container container">
        <div className="brand-slider">
          <Slider {...settings}>
            {allBrand?.map((item, index) => (
              <div key={index}
                className="brand-item inner d-grid gap-2 text-center align-items-center justify-content-center"
              >
                <Link
                to={`all-products?category_id=0&brand_id=${item?._id}&remark=0&keyword=0&per_page=12&page_no=1`}
                className="popular-item w-100"
              >
                <img src={`${baseURLFile}/${item?.brand_img}`} alt="" />
                <p>{item?.brand_name}</p>
                </Link>
              </div>
            ))}
         

          </Slider>
          <div className="d-flex justify-content-center p-5 text-decoration-none">
          <div className="btn btn-danger  text-center">
          <Link
            to="/all-products?category_id=0&brand_id=0&remark=0&keyword=0&per_page=12&page_no=1"
            className="font-18 fw-600 text-heading hover-text-main text-decoration-underline font-heading"
          >
            Explore More
          </Link>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSectionOne;
