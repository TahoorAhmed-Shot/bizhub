import React, { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Spinner from "@/components/Spinner";
function slug({ tostSuccess, tostError, loading, setLoading, myUser }) {
  let HOST = process.env.NEXT_PUBLIC_HOST;

  const router = useRouter();
  const { slug } = router.query;
  const [Image, setImage] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [toogelOffer, setToogelOffer] = useState(false);
  const [toogelMessage, settoogelMessage] = useState(false);
  const [buttonLoading1, setButtonLoading1] = useState(false);
  const [buttonLoading2, setButtonLoading2] = useState(false);
  const [formValue, setFormValue] = useState({
    offer: "",
    message: "",
  });
  const ref = useRef();
  useEffect(() => {
    if (!slug) {
      setLoading(true);
    } else {
      serviceDetail();
    }
  }, [router.query]);
  let handelOffer = async (e) => {
    e.preventDefault();

    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => { });
    setButtonLoading1(true);
    try {
      let url = `${HOST}/api/send-offer`;
      let params = {
        receiver_id: detailData.user && detailData.user.id,
        service_id: detailData && detailData.id,
        offer: formValue.offer,
      };

      let res = await axios.post(url, params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let data = await res.data;
      if (data.status) {
        setToogelOffer(false);
        tostSuccess(data.message);
        setFormValue({
          offer: "",
        });
        ref.current.classList.remove("blur-sm");
        setButtonLoading1(false);
      }
      ref.current.classList.remove("blur-sm");
      setButtonLoading1(false);
    } catch (error) {
      tostError(error.response.data.message);

      setButtonLoading1(false);
      ref.current.classList.remove("blur-sm");
      setToogelOffer(false);
    }
  };
  let handelMessage = async (e) => {
    e.preventDefault();
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });
    try {
      setButtonLoading2(true);
      let url = `${HOST}/api/send-offer`;
      let params = {
        receiver_id: detailData.user && detailData.user.id,
        service_id: detailData && detailData.id,
        message: formValue.message,
      };

      let res = await axios.post(url, params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let data = await res.data;
      if (data.status) {
        setToogelOffer(false);
        tostSuccess(data.message);
        settoogelMessage(false);
        setFormValue({
          message: "",
        });
        ref.current.classList.remove("blur-sm");
        setButtonLoading2(false);
      }
    } catch (error) {
      tostError(error.response.data.message);
      setButtonLoading2(false);
      ref.current.classList.remove("blur-sm");
      settoogelMessage(false);
    }
  };

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

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
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
  return (
    <>
      <section className=" overflow-x-hidden min-h-screen ">
        <div ref={ref} className="max-w-[110rem] mx-auto p-4 ">
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
                            Image && Image[curr]
                              ? HOST + Image[curr].image
                              : "Loding..."
                          }`}
                          className="absolute block  -translate-x-1/2  -translate-y-1/2 top-1/2 left-1/2  bg-center bg-contain  h-full bg-no-repeat"
                          alt="..."
                        />
                      )}
                    </div>
                  </div>
                  {Image && Image[1] && (
                    <div className="">
                      <button
                        onClick={prev}
                        type="button"
                        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4  group focus:outline-none"
                        data-carousel-prev
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-pointer sm:w-10 sm:h-10 bg-white/30  group-hover:bg-white/50  group-focus:ring-4 group-focus:ring-white  group-focus:outline-none">
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
                        onClick={next}
                        type="button"
                        className="absolute top-0 right-0 z-20 flex items-center justify-center h-full px-4 group focus:outline-none"
                        data-carousel-next
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 cursor-pointer  bg-white/30  group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white  group-focus:outline-none">
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
                <div className="xl:w-1/2 w-full xl:pl-10 pl-0  lg:mt-0 2xl:pt-0 pt-6  ">
                  <h1 className="text-gray-900 md:text-3xl text-2xl title-font font-medium mb-1">
                    {detailData && detailData.title}
                  </h1>

                  <div className="flex mt-2 items-center pb-4 border-b-2 border-gray-100 mb-2">
                    <div className="flex">
                      <span className="title-font font-medium md:text-2xl text-xl text-gray-900">
                        $
                        {detailData.amount &&
                          parseFloat(detailData.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex border-b-2 border-gray-100  pb-5">
                    <div className=" flex  ">
                      <div className="  rounded-md bg-opacity-75  m-auto overflow-hidden text-start relative">
                        <h1 className="title-font sm:text-2xl text-xl font-normal text-black mb-1">
                          Description
                        </h1>

                        <p className="leading-relaxed ">
                          {detailData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex   mt-1">
                    <div className=" flex  ">
                      <div className="  rounded-md bg-opacity-75 py-2  mx-auto overflow-hidden text-start relative">
                        <div className="mt-4 flex text-center align-middle items-center  ">
                          <div className="">
                            <a className=" mr-2 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 lg:mt-0">
                              <img
                                src={
                                  detailData &&
                                  detailData.user &&
                                  detailData.user.image
                                    ? HOST + detailData.user.image
                                    : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                                }
                                className=" rounded-full h-[50px] w-[50px] sm:h-[60px] sm:w-[60px]"
                                alt=""
                              />
                            </a>
                          </div>
                          {myUser.token && (
                            <Link
                              href={`/otherProfile/${
                                detailData.user && detailData.user.id
                              }`}
                            >
                              <div className="title-font flex my-auto mx-3 sm:text-xl underline underline-offset-4   uppercase text-base font-medium  text-gray-900 ">
                                {detailData &&
                                detailData.user &&
                                detailData.user.first_name !== null
                                  ? detailData.user.first_name +
                                    " " +
                                    detailData.user.last_name
                                  : "Anonymous"}
                              </div>
                            </Link>
                          )}
                          {!myUser.token && (
                            <a
                              className="cursor-pointer "
                              onClick={() => {
                                setTimeout(() => {
                                  router.push("/login");
                                }, 1000);
                              }}
                            >
                              <div className="title-font flex my-auto mx-3 sm:text-xl underline underline-offset-4   uppercase text-sm font-medium  text-gray-900 ">
                                {detailData &&
                                detailData.user &&
                                detailData.user.first_name !== null
                                  ? detailData.user.first_name +
                                    " " +
                                    detailData.user.last_name
                                  : "Anonymous"}
                              </div>
                            </a>
                          )}
                        </div>

                        <div className=" text-slate-50 mt-6  flex justify-center text-center">
                          <div className="bg-green-600  sm:w-[9.5rem] w-32   sm:mx-2 mr-0.5  rounded ">
                            {myUser && myUser.token && (
                              <button
                                onClick={() => {
                                  setToogelOffer(true);
                                  ref.current.classList.add("blur-sm");
                                }}
                                className="py-1.5 capitalize sm:font-semibold  sm:text-lg text-base font-medium"
                              >
                                Make Offer
                              </button>
                            )}
                            {myUser && !myUser.token && (
                              <button
                                disabled={buttonLoading1}
                                onClick={() => {
                                  setButtonLoading1(true);
                                  setTimeout(() => {
                                    setButtonLoading1(false);
                                    router.push("/login");
                                  }, 1000);
                                }}
                                className="py-1.5 capitalize sm:font-semibold  sm:text-lg text-base font-medium"
                              >
                                Make Offer
                              </button>
                            )}
                          </div>
                          <div className="bg-green-600 sm:w-40 w-32 sm:mx-2 mx-1  rounded">
                            {myUser && myUser.token && (
                              <button
                                onClick={() => {
                                  settoogelMessage(true);
                                  ref.current.classList.add("blur-sm");
                                }}
                                className="py-1.5  capitalize sm:font-semibold  sm:text-lg text-base font-medium"
                              >
                                Send Message
                              </button>
                            )}
                            {myUser && !myUser.token && (
                              <button
                                disabled={buttonLoading2}
                                onClick={() => {
                                  setButtonLoading2(true);
                                  setTimeout(() => {
                                    setButtonLoading2(false);
                                    router.push("/login");
                                  }, 1000);
                                }}
                                className="py-1.5 capitalize sm:font-semibold  sm:text-lg text-base font-medium"
                              >
                                Send Message
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {toogelOffer && (
          <span className="fixed inset-0 z-10 overflow-y-auto  ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left  shadow-2xl shadow-slate-600 transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form
                  onSubmit={handelOffer}
                  className="w-full max-w-lg px-6 py-4 mt-2"
                >
                  <div className="flex flex-wrap -mx-3 mb-1">
                    <div className="w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="offer"
                      >
                        offer
                      </label>
                      <input
                        required
                        minLength={2}
                        maxLength={8}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="number"
                        name="offer"
                        value={formValue.offer}
                        onChange={onChange}
                        placeholder="offer"
                      />
                    </div>
                  </div>
                  <div className=" py-2 mb-4 sm:flex sm:flex-row-reverse ">
                    <button
                      disabled={buttonLoading1}
                      type="submite"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-700 px-2 py-1 text-base font-normalont-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {buttonLoading1 ? "Loading..." : "Send"}
                    </button>
                    <button
                      onClick={() => {
                        ref.current.classList.remove("blur-sm");
                        setToogelOffer(false);
                      }}
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-base font-normalont-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </span>
        )}
        {toogelMessage && (
          <span className="fixed inset-0 z-10 overflow-y-auto  ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left  shadow-2xl shadow-slate-600 transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={handelMessage} className="w-full max-w-lg p-6">
                  <div className="flex flex-wrap -mx-3 mb-1">
                    <div className="w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="Message"
                      >
                        Message
                      </label>
                      <textarea
                        required
                        minLength={2}
                        maxLength={500}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="text"
                        name="message"
                        value={formValue.message}
                        onChange={onChange}
                        placeholder="Message"
                      />
                    </div>
                  </div>
                  <div className=" py-2 mb-4 sm:flex sm:flex-row-reverse ">
                    <button
                      disabled={buttonLoading2}
                      type="submites"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-2 py-1 text-base font-normalont-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {buttonLoading2 ? "Loading..." : "Send"}
                    </button>
                    <button
                      onClick={() => {
                        ref.current.classList.remove("blur-sm");
                        settoogelMessage(false);
                      }}
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-base font-normalont-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </span>
        )}
      </section>
    </>
  );
}

// export async function getServerSideProps(context) {
//   let loadings = false;
//   let token = context.req.cookies.authToken;
//   const { slug } = context.query;
//   const HOST = process.env.NEXT_PUBLIC_HOST;

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
//       const data = await response.data.data;
//       loadings = false;
//       return {
//         props: {
//           detailData: data,
//           images: data.images,
//           loadings,
//         },
//       };
//     } catch (error) {
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
//       const data = await response.data.data;

//       loadings = false;
//       return {
//         props: {
//           detailData: data,
//           images: data.images,
//           loadings,
//         },
//       };
//     } catch (error) {
//       console.error(error.message);
//       return {
//         props: {
//           error: "An error occurred while fetching the data.",
//         },
//       };
//     }
//   }
// }

export default slug;
