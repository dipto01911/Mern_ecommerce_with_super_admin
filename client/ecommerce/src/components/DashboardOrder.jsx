import { useCallback, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ToWords } from "to-words";
import Paginate from "../helper/Paginate";
import { useNavigate, useSearchParams } from "react-router-dom";
import invoiceStore from "../store/invoiceStore";
import { formatDate } from "../helper/helper";

const DashboardOrder = () => {




const [searchParams]=useSearchParams();
const navigate=useNavigate();
const page_no=searchParams.get("page_no") || 1;
const per_page=6

const {readAllInvoiceSingleUser,allInvoiceSingleUserRequest,
  readSingleInvoiceSingleUser,singleInvoiceSingleUserRequest,
  totalInvoiceSingleUser
}=invoiceStore();


useEffect(()=>{
  (async()=>{
    await allInvoiceSingleUserRequest(per_page,page_no)
  })()
},[allInvoiceSingleUserRequest,page_no])

//console.log("invoice",readAllInvoiceSingleUser)
console.log("Single ",readSingleInvoiceSingleUser)

const viewOrder=(id)=>{
  singleInvoiceSingleUserRequest(id)
}

const handelPageClick=async(event)=>{
  let page_no=event.selected;
await allInvoiceSingleUserRequest(per_page,page_no+1)
navigate(`/dashboard-all-orders?page_no=${page_no+1}`)
}

  return (
    <div className="dashboard-body__content">
      {/* ========================= Statement section start =========================== */}
      <div className="row gy-4">
        <div className="col-12">
          <div className="card common-card border border-gray-five">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table text-body mt--24">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transaction ID</th>
                      <th>Order ID</th>
                      <th>Deliver status</th>
                      <th>Payment status</th>
                      <th>Total Payable</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
 
                   {
                    readAllInvoiceSingleUser?.map((item,index)=>(
                     <tr key={index}>
                      <td>{formatDate(item?.createdAt)}</td>
                      <td>{item?.tran_id}</td>
                      <td>
                        <span>{item?._id}</span>
                      </td>
                      <td>
                        <span className={`badge rounded-pill bg-success ${
                          item?.delivery_status === "delivered"
                          ?"bg-success"
                          :item?.delivery_status === "pending"
                          ?"bg-warning"
                          :"bg-danger"
                          }`}>
                        {item?.delivery_status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge rounded-pill bg-success ${
                       item?.payment_status ==="success"
                       ? "bg-success"
                       : item?.payment_status === "cancel"
                       ? "bg-warning"
                       :"bg-danger"
                       
                       }`}>
                       {item?.payment_status}
                        </span>{" "}
                      </td>
                      <td>
                        <p> {item?.payable.toFixed(0)}</p>
                      </td>
                      <td>
                        <button onClick={()=>viewOrder(item?._id)}
                          className="btn btn-success"
                          data-bs-toggle="modal"
                          data-bs-target={`#exampleModal_1`}
                        >
                          View order
                        </button>
                      </td>
                    </tr>
                    ))
                   }

                    
                  </tbody>
                </table>
              </div>
              <div className="flx-between justify-content-end gap-2">
                <nav aria-label="Page navigation example">
                  <Paginate handelPageClick={handelPageClick}
                   page_no={page_no} per_page={per_page} 
                   totalCount={totalInvoiceSingleUser} />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ========================= Statement section End =========================== */}

      {/*  */}




      <>
        <div
          className="modal fade order_item"
          id={`exampleModal_1`}
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title fs-5" id="exampleModalLabel">
                  Update Product
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="profile">
                  <div className="row gy-4">
                    <div className="col-12">
                      <div className="container my-5">
                        {/* Invoice Content */}
                        <div className="p-5 bg-white">
                          {/* Header */}
                          <div className="row mb-4 border-bottom pb-3">
                            <div className="col-sm-6">
                              <h2 className="fw-bold">INVOICE</h2>
                              <p className="mb-0">#{readSingleInvoiceSingleUser?._id}</p>
                              <p className="mb-0">
                               {readAllInvoiceSingleUser?.tran_id}
                              </p>
                              <small>{formatDate(readSingleInvoiceSingleUser?.createdAt)}</small>
                            </div>
                            <div className="col-sm-6 text-end">
                              <h5 className="fw-bold">Ecommerce </h5>
                              <p className="mb-0">New market,jessore</p>
                              <p className="mb-0">support@ecommerce.com</p>
                              <p className="mb-0">+880 1234 567 890</p>
                            </div>
                          </div>

                          {/* Billing Details */}
                          <div className="row mb-4">
                            <div className="col-sm-6">
                              <h6 className="fw-bold">Bill To:</h6>
                              <p className="mb-0">{readSingleInvoiceSingleUser?.cus_details?.[0]?.Name}</p>

                              <p className="mb-0">{readSingleInvoiceSingleUser?.cus_details?.[0]?.Email}</p>
                              <p className="mb-0">{readSingleInvoiceSingleUser?.cus_details?.[0]?.Phone}</p>
                              <p className="mb-0">{readSingleInvoiceSingleUser?.cus_details?.[0]?.Address}</p>
                            </div>
                            <div className="col-sm-6 text-end">
                              <h6 className="fw-bold">Payment information: </h6>
                              <p className="mb-1">
                                Payment Status:{" "}
                                <span
                                  className={`fw-bold text-uppercase text-success`}
                                >
                                  {readSingleInvoiceSingleUser?.payment_status}
                                </span>
                              </p>
                              <p className="mb-1">
                                Deliver Status:{" "}
                                <span
                                  className={`fw-bold text-uppercase text-warning`}
                                >
                                  {readSingleInvoiceSingleUser?.delivery_status}
                                </span>
                              </p>
                              <p className="mb-0">
                                Total payable:{" "}
                                <span className="fw-bold text-uppercase">
                                 {readSingleInvoiceSingleUser?.payable.toFixed(0)}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Table */}
                          <div className="table-responsive invoice mb-4">
                            <table className="table  align-middle">
                              <thead className="table-light">
                                <tr>
                                  <th>Product</th>
                                  <th className="text-center">Color</th>
                                  <th className="text-center">Size</th>
                                  <th className="text-center">Quantity</th>
                                  <th className="text-center">Price</th>
                                  <th className="text-end">Total</th>
                                </tr>
                              </thead>
                              <tbody className="text-dark">
             {
              readSingleInvoiceSingleUser?.invoiceProducts?.map((item,index)=>(
               <tr key={index}>
                                  <td className="text-start">{item?.product_name}</td>

                                  <td>{item?.color}</td>
                                  <td>{item?.size}</td>
                                  <td>{item?.qty}</td>
                                  <td>{item?.price}</td>
                                  <td className="text-end">{Number(item?.qty)*Number(item?.price)}</td>
                                </tr>
              ))
             }
                                

                              </tbody>
                            </table>
                          </div>

                          {/* Summary */}
                          <div className="row justify-content-end">
                            <div className="col-8">
                              {/* <p className="text-danger small fst-italic">
                                {toWords.convert(Number(1000))}
                              </p> */}
                            </div>
                            <div className="col-4">
                              <ul className="list-unstyled">
                                <li className="d-flex justify-content-between mb-2">
                                  <span>Subtotal:</span> <span>{readSingleInvoiceSingleUser?.total}</span>
                                </li>
                                <li className="d-flex justify-content-between mb-2">
                                  <span>Vat (15%):</span> <span>{readSingleInvoiceSingleUser?.vat.toFixed(1)}</span>
                                </li>
                                <li className="d-flex justify-content-between mb-2">
                                  <span>Shipping cost:</span>{" "}
                                  <span>75 Tk.</span>
                                </li>
                                <li className="d-flex justify-content-between border-top pt-2 fw-bold">
                                  <span>Total:</span> <span>{readSingleInvoiceSingleUser?.payable.toFixed(0)}</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="text-center mt-5 text-muted small">
                            <p className="mb-1">Thank you for your purchase!</p>
                          
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  onClick={printFn}
                  type="button"
                  className="btn btn-primary"
                >
                  Print
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default DashboardOrder;
