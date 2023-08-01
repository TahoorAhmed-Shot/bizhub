import React, { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";


function slug({ tostSuccess, tostError, loading, setLoading, setState }) {
  let HOST = process.env.NEXT_PUBLIC_HOST;

  const router = useRouter();
  const { slug } = router.query;
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [Image, setImage] = useState([]);
  const [detailData, setDetailData] = useState([]);

  const [toogelOffer, setToogelOffer] = useState(false);
  const [completeDefaultToggel, setCompleteDefaultToggel] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState();
  const [defaultRadio, setDefault] = useState({ value: false });
  const [selectedUser, setSelectedUser] = useState({
    name: "",
    image: "",
    last_name: "",
  });
  const [completeToggel, setCompleteToggel] = useState(false);
  const [starsValue, setStarsValue] = useState(0);
  const [starsHover, setStarsHover] = useState(undefined);
  let stars = Array(5).fill(0);

  const [formValue, setFormValue] = useState({
    review: "",
  });
  let onChangeReview = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };
  const [rateValue, setRateValue] = useState();
  const ref = useRef();
  const handelClick = (value) => {
    setStarsValue(value);
  };
  const onMouseHover = (value) => {
    setStarsHover(value);
  };
  const onMouseLeave = () => {
    setStarsHover(undefined);
  };
  
  useEffect(() => {
    if (detailData && detailData.status == "1") {
      router.push("/myPostList");
      if (detailData.type == "1") {
        setState(true);
        router.push("/myPostList");
      } else if ((detailData.type = "0")) {
        setState(false);
        router.push("/myPostList");
      }
    }
  });

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.push("/login");
    } else {
      serviceComplete();
    }
  }, [router.query]);

  let serviceComplete = async () => {
    if (localStorage.getItem("authToken")) {
      try {
        const url = `${HOST}/api/service-complete/${slug}`;
        setLoading(true);
        const params = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        };

        const res = await axios.get(url, params);
        const data = await res.data.data;

        setImage(data.images && data.images);
        setDetailData(data);

        await setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  let handelComplete = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});
    try {
      let url = `${HOST}/api/complete-job`;
      let params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      };
      let data = {
        service_id: detailData && detailData.id,
        complete_by: selectedCheckboxes,
        rate: starsValue,
        review: formValue.review,
      };
      let res = await axios.post(url, data, params);
      let value = await res.data;

      if (value.status) {
        tostSuccess(value.message);

        setTimeout(() => {
          if (detailData.type == "1") {
            setState(true);
            router.push("/myPostList");
          } else if ((detailData.type = "0")) {
            setState(false);
            router.push("/myPostList");
          }
        }, 2000);
      }
      ref.current.classList.remove("blur-sm");
      setCompleteToggel(false);
    } catch (error) {
      tostError(error.response.data.message);
    }
  };
  let handelDeafultComplete = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});
    try {
      let url = `${HOST}/api/complete-job`;
      let params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      };
      let data = {
        service_id: detailData && detailData.id,
      };
      let res = await axios.post(url, data, params);
      let value = await res.data;

      if (value.status) {
        tostSuccess(value.message);
        router.push("/myPostList");
      }
      ref.current.classList.remove("blur-sm");
      setCompleteToggel(false);
    } catch (error) {
      tostError(error.response.data.message);
    }
  };
  const [curr, setCurr] = useState(0);
  const prev = () => {
    const first = curr === 0;
    const newIndex = first ? Image.length - 1 : curr - 1;
    setCurr(newIndex);
  };
  const next = () => {
    const last = curr === Image.length - 1;
    const newIndex = last ? 0 : curr + 1;
    setCurr(newIndex);
  };

  function handleChange(checkboxValue) {
    setSelectedCheckboxes(checkboxValue.id);
    setSelectedUser({
      first_name: checkboxValue.first_name,
      last_name: checkboxValue.last_name,
      image: checkboxValue.image,
    });
  }
  function handleDefaultChange(checkboxValue) {
    setSelectedCheckboxes(checkboxValue);
  }

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden ">
        <div ref={ref} className="px-4 md:px-6  py-16 mx-auto min-h-screen">
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {loading ? (
            <div className="flex justify-center  ">
              <span className="flex justify-center  absolute  top-64">
                <Spinner></Spinner>
              </span>
            </div>
          ) : (
            <div className="lg:w-4/5  mx-auto flex flex-wrap justify-center ">
              <div className="relative w-full  2xl:w-[50%] xl:w-1/2   ">
                <div className="relative h-96 bg-black  rounded-sm   overflow-hidden md:h-[50vh]">
                  <div className=" duration-500 ease-in-out ">
                    {Image && !Image[curr] ? (
                      <img
                        src={`/images/bizhub_logo.png`}
                        className="absolute block  -translate-x-1/2 p-20  -translate-y-1/2 top-1/2 left-1/2  bg-center bg-contain h-auto bg-no-repeat"
                        alt="..."
                      />
                    ) : (
                      <img
                        src={`${
                          Image && Image[curr] && HOST + Image[curr].image
                        }`}
                        className="absolute block w-full -translate-x-1/2  -translate-y-1/2 top-1/2 left-1/2  bg-center bg-cover h-full bg-no-repeat"
                        alt="..."
                      />
                    )}
                  </div>
                </div>
                {Image && Image[1] && (
                  <div>
                    <button
                      type="button"
                      className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4  group focus:outline-none"
                      data-carousel-prev
                    >
                      <span
                        onClick={prev}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-pointer sm:w-10 sm:h-10 bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-white sm:w-6 sm:h-6 "
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                          ></path>
                        </svg>
                        <span className="sr-only">Previous</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
                      data-carousel-next
                    >
                      <span
                        onClick={next}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 cursor-pointer  bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-white sm:w-6 sm:h-6 "
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                        <span className="sr-only">Next</span>
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <div className="xl:w-1/2 w-full xl:pl-10 pl-0  lg:mt-0 2xl:pt-0 pt-8  ">
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {detailData && detailData.title}
                </h1>
                <div className="flex justify-between mt-4 items-center pb-4 border-b border-gray-200 mb-2">
                  <span className="title-font flex tracking-tight font-medium text-2xl text-gray-900">
                    $
                    {detailData.amount &&
                      parseFloat(detailData.amount).toFixed(2)}
                  </span>

                  <div className=" flex   justify-center text-center">
                    {selectedCheckboxes && (
                      <div className=" border border-green-600  w-28 mx-1 rounded-md">
                        <button
                          onClick={() => {
                            if (selectedCheckboxes == "someone") {
                              setCompleteDefaultToggel(true);
                              ref.current.classList.add("blur-sm");
                            } else {
                              setCompleteToggel(true);
                              setStarsValue(0);
                              setFormValue({ review: "" });
                              ref.current.classList.add("blur-sm");
                            }
                          }}
                          className="  text-green-600 py-1   uppercase font-medium  text-lg"
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex   ">
                  <div className="  rounded-md bg-opacity-75 pb-2 mt-1  overflow-hidden text-start relative">
                    <div className="flex flex-wrap justify-start ">
                      {detailData &&
                        detailData.chats &&
                        detailData.chats.map((key) => {
                          return (
                            <div className="mt-4  align-middle items-center border  p-2 mx-1 flex text-center w-56  ">
                              <div className="flex justify-center mx-auto">
                                <a className="  flex items-center text-neutral-900  hover:text-neutral-900 focus:text-neutral-900  lg:mt-0">
                                  <img
                                    src={
                                      key.sender_details &&
                                      key.sender_details.image
                                        ? HOST + key.sender_details.image
                                        : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                                    }
                                    style={{ height: "40px", width: "40px" }}
                                    className=" rounded-full"
                                    alt=""
                                  />
                                </a>
                              </div>
                              <button>
                                <div className="title-font align-middle mx-1 items-center flex   sm:text-sm   uppercase text-sm font-medium  text-gray-900 ">
                                  {key.sender_details &&
                                    key.sender_details.first_name +
                                      " " +
                                      key.sender_details.last_name}

                                  <input
                                    className="w-7 px-3 mx-1 flex border-black "
                                    type="radio"
                                    name="radio"
                                    value={key.sender_details.id}
                                    onChange={() =>
                                      handleChange(key.sender_details)
                                    }
                                  ></input>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      <div className="mt-4  align-middle items-center border  p-2 mx-1 flex text-center w-56  ">
                        <div className="flex justify-center mx-auto">
                          <a className="  flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900  lg:mt-0">
                            <img
                              src={
                                "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                              }
                              style={{ height: "40px", width: "40px" }}
                              className=" rounded-full"
                              alt=""
                            />
                          </a>
                        </div>
                        <button>
                          <div className="title-font align-middle mx-1 items-center flex   sm:text-sm   uppercase text-sm font-medium  text-gray-900 ">
                            Someone else
                            <input
                              className="w-7 px-3 mx-1 flex border-black "
                              type="radio"
                              name="radio"
                              value={defaultRadio.value}
                              onChange={() => handleDefaultChange("someone")}
                            ></input>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {completeToggel && (
          <span className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative bg-white rounded-lg w-[26rem] h-auto shadow-xl shadow-slate-600">
                <form className="w-full max-w-lg px-5 py-2">
                  <div className="mt-4  align-middle items-center  justify-center  flex text-center   ">
                    <div className="flex justify-center  ">
                      <div className="  flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900  lg:mt-0">
                        <img
                          src={
                            selectedUser.image
                              ? HOST + selectedUser.image
                              : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                          }
                          style={{ height: "55px", width: "55px" }}
                          className=" rounded-full"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>

                  <div className="title-font align-middle mt-2 items-center    sm:text-base   uppercase text-base font-medium  text-gray-900 ">
                    {selectedUser.first_name + " " + selectedUser.last_name}
                  </div>

                  <div className=" px-3 my-2  ">
                    <label
                      className="  flex tracking-wide text-gray-700 mb-2 font-medium text-lg"
                      htmlFor="Review"
                    >
                      Review
                    </label>
                    <textarea
                      required
                      rows={6}
                      className=" p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      type="text"
                      name="review"
                      placeholder="review"
                      value={formValue.review}
                      onChange={onChangeReview}
                    />
                  </div>

                  <div className="px-3 mt-5 mb-3">
                    <h1 className="flex  tracking-wide text-gray-700 mb-1 font-medium text-lg">
                      Rate
                    </h1>
                    <div className="flex items-center">
                      {stars.map((_, index) => {
                        return (
                          <svg
                            aria-hidden="true"
                            className={`${
                              (starsHover || starsValue) > index
                                ? "text-yellow-400"
                                : "text-gray-300"
                            } w-7 h-7`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            onClick={() => handelClick(index + 1)}
                            onMouseOver={() => onMouseHover(index + 1)}
                            onMouseLeave={onMouseLeave}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        );
                      })}
                    </div>
                  </div>
                </form>

                <div className="px-6 py-5 mb-2  text-center flex justify-between">
                  <button
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");
                      setCompleteToggel(false);
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-gray-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-md border border-gray-200 text-sm font-medium px-4 py-1.5 hover:text-gray-900 focus:z-10 "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handelComplete();
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-white bg-yellow-500 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300  font-medium rounded-md text-sm inline-flex items-center px-4 py-1.5 text-center mr-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </span>
        )}
        {completeDefaultToggel && (
          <span className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative bg-white rounded-lg w-[26rem] h-auto shadow-xl shadow-slate-600">
                <form className="w-full max-w-lg px-5 py-2">
                  <div className="mt-4  align-middle items-center  justify-center  flex text-center   ">
                    <div className="flex justify-center  ">
                      <div className="  flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900  lg:mt-0">
                        <img
                          src={
                            "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                          }
                          style={{ height: "55px", width: "55px" }}
                          className=" rounded-full"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>

                  <div className="title-font align-middle mt-2 items-center    sm:text-base   uppercase text-base font-medium  text-gray-900 ">
                    Someone Else
                  </div>
                </form>

                <div className="px-6 py-5 mb-2  text-center flex justify-between">
                  <button
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");
                      setCompleteDefaultToggel(false);
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-gray-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-md border border-gray-200 text-sm font-medium px-4 py-1.5 hover:text-gray-900 focus:z-10 "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handelDeafultComplete();
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-white bg-yellow-500 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300  font-medium rounded-md text-sm inline-flex items-center px-4 py-1.5 text-center mr-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </span>
        )}
      </section>
    </>
  );
}

export default slug;
