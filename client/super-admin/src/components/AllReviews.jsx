import { FaRegStar, FaStar } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Paginate from "../helper/Paginate";
import reviewStore from "../store/reviewStore";
import { useEffect } from "react";
import { baseURL, hostURL } from "../helper/config";
import { formatDate } from "../helper/helper";

const AllReviews = () => {
const {totalReview,allReview,allReviewRequest}=reviewStore();
const [searchParams]=useSearchParams();
const per_page=6;
const page_no=searchParams.get("page-no") || 1;
const navigate=useNavigate();
useEffect(()=>{
  (async()=>{
    await allReviewRequest(per_page,page_no)
  })()
},[allReviewRequest,per_page,page_no])

  const StarRating = ({ star }) => {
    star = parseInt(star);
    const totalStars = 5;
    const filledStars = Array(star).fill(<FaStar />);
    const emptyStars = Array(totalStars - star).fill(<FaRegStar />);

    return (
      <div className="star">
        {filledStars.concat(emptyStars).map((star, index) => (
          <span key={index}>{star}</span>
        ))}
      </div>
    );
  };

  //Pagination function
const handelPageClick=async(event)=>{
  let page_no=event.selected;
  await allReviewRequest(per_page,page_no+ 1)
  navigate(`/all-reviews?page_no=${page_no+1}`)
}

  return (
    <div className="dashboard-body__content">
      {/* ===================== Review Section Start ========================== */}
      <div className="card common-card border border-gray-five">
        <div className="card-body">
          <div className="table-responsive">
            {allReview?.length<1 && <p>No data found!</p>}
            {
              allReview?.map((item,index)=>(
              <div key={index} className="product-review-wrapper">
              <div className="product-review">
                <div className="product-review__top flx-between">
                  <div className="review_img">
                    <img src={`${baseURL}/${item?.product?.images?.[0]}`} />
                    <div>
                      <Link
                        target="_blank"
                        to={`/product-details?product_id=${item?.product_id}`}
                      >
                        <h5>{item?.product?.title}</h5>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-1">
                      <div className="star">
                        <p className="font-20 fw-bold">{item?.user?.cus_name}</p>
                        <strong>Email:</strong> {item?.user?.email}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <div className="star d-flex align-items-center gap-1">
                        <StarRating star={item?.rating} />
                        <span className="star-rating__text text-body mt-1">
                          {item?.ratings} ({formatDate(item?.updatedAt)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product-review__body">
                  <p className="product-review__desc">
                    {item?.des}
                  </p>
                </div>
              </div>
            </div>
              ))
            }
         
            <div className="flx-between justify-content-end gap-2">
              <nav aria-label="Page navigation example">
                <div>
                  <Paginate 
                  handelPageClick={handelPageClick}
                  
                  page_no={page_no} per_page={per_page} totalCount={totalReview} />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* ===================== Review Section End ========================== */}
    </div>
  );
};

export default AllReviews;
