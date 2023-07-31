import React, { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/router";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";

function slug({ tostSuccess, tostError, loading, setLoading }) {
  let HOST = process.env.NEXT_PUBLIC_HOST;

  const router = useRouter();
  const { slug } = router.query;
  const [Image, setImage] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [toogelOffer, setToogelOffer] = useState(false);
  const [toogelMessage, settoogelMessage] = useState(false);

  useEffect(() => {
    if (slug) {
      serviceDetail();
    } else {
      setLoading(true);
    }
  }, [router.query]);

  const serviceDetail = async () => {
    setLoading(true);
    await axios.get(`${HOST}/sanctum/csrf-cookie`);

    if (!localStorage.getItem("authToken")) {
      try {
        setLoading(true);
        const url = `${HOST}/api/service-detail-without-auth/${slug}`;

        const params = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.get(url, params);
        const data = await response.data.data;
        setDetailData(data);
        setImage(data.images);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      try {
        setLoading(true);
        const url = `${HOST}/api/service-detail/${slug}`;
        const params = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        };

        const response = await axios.get(url, params);
        const data = await response.data.data;

        setDetailData(data);
        setImage(data.images);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    }
  };

  const ref = useRef();

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

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden min-h-screen">
        <div ref={ref} className="px-8  py-16 mx-auto">

            
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
            <div>
              <div className="lg:w-4/5  mx-auto flex flex-wrap ">
                <div className="relative w-full  2xl:w-[50%] xl:w-1/2   ">
                  {Image ? (
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
                            className="absolute block  -translate-x-1/2  -translate-y-1/2 top-1/2 left-1/2  bg-center bg-cover h-full bg-no-repeat"
                            alt="..."
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-96 bg-slate-600 animate-pulse from-slate-300   rounded-sm   overflow-hidden md:h-[50vh]">
                      <div className=" duration-500 ease-in-out ">
                        <div
                          className="absolute   -translate-x-1/2  -translate-y-1/2 top-1/2 left-1/2  bg-center bg-contain h-full bg-no-repeat"
                          alt="..."
                        />
                      </div>
                    </div>
                  )}
                  {Image && Image[1] && (
                    <div>
                      <button
                        type="button"
                        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4  group focus:outline-none"
                        data-carousel-prev
                      >
                        <span
                          onClick={prev}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-pointer sm:w-10 sm:h-10 bg-white/30 group-hover:bg-white/50  group-focus:ring-4 group-focus:ring-white  group-focus:outline-none"
                        >
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-white sm:w-6 sm:h-6"
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
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 cursor-pointer  bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white  group-focus:outline-none"
                        >
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-white sm:w-6 sm:h-6"
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
                <div className="xl:w-1/2 w-full xl:pl-10 pl-0  lg:mt-0 2xl:pt-0 pt-6  ">
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    {detailData && detailData.title}
                  </h1>

                  <div className="flex mt-2 items-center pb-4 border-b-2 border-gray-100 mb-2">
                    <div className="flex">
                      <span className="title-font tracking-tight font-medium text-2xl text-gray-900">
                        $
                        {detailData.amount &&
                          parseFloat(detailData.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex border-b-2 border-gray-100  pb-5">
                    <div className=" flex  ">
                      <div className="  rounded-md bg-opacity-75 py-1  m-auto overflow-hidden text-start relative">
                        <h1 className="title-font sm:text-2xl text-xl font-normal text-black mb-1">
                          Description
                        </h1>

                        <p className="leading-relaxed ">
                          {detailData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// export async function getServerSideProps(context) {
//   let loadings = false;
//   let token = context.req.cookies.authToken;
//   const { slug } = context.query;
//   const HOST = process.env.NEXT_PUBLIC_HOST; // Replace with your API host

//   await axios.get(`${HOST}/sanctum/csrf-cookie`);

//   if (!token) {
//     try {
//       const url = `${HOST}/api/service-detail-without-auth/${slug}`;
//       loadings = true;
//       const params = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };

//       const response = await axios.get(url, params);
//       const data = response.data.data;
//       loadings = false;
//       return {
//         props: {
//           detailData: data,
//           Image: data.images,
//           loadings,
//         },
//       };
//     } catch (error) {
//       console.error(error);
//       return {
//         props: {
//           error: "An error occurred while fetching the data.",
//         },
//       };
//     }
//   } else {
//     try {

//       const url = `${HOST}/api/service-detail/${slug}`;
//       loadings = true;
//       const params = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + `${token}`,
//         },
//       };

//       const response = await axios.get(url, params);
//       const data = response.data.data;
//       loadings = false;
//       return {
//         props: {
//           detailData: data,
//           Image: data.images,
//           loadings,
//         },
//       };
//     } catch (error) {
//       console.error(error);
//       return {
//         props: {
//           error: "An error occurred while fetching the data.",
//         },
//       };
//     }
//   }
// }
export default slug;
