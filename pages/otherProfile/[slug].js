import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import {  BsThreeDots } from "react-icons/bs";

import { MdReport } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function myAccount({

  tostSuccess,
  loading,
  setLoading,
 
  tostError,
}) {
  let router = useRouter();
  const { slug } = router.query;
  let HOST = process.env.NEXT_PUBLIC_HOST;
  const [toggel, settoggel] = useState(false);
  const [userData, setUserData] = useState([]);
  const [dropToggel, togeldrop] = useState(false);
  const [reportToggel, setReportToggel] = useState(false);
  const [selectedItems, setSelectedItems] = useState("");
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    message: "",
  });
  const ref = useRef();

  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value, tostError });
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.push("/login");
    } else {
      if (slug) {
        ProfileDeatil(slug);
      } else {
        setLoading(true);
      }
    }
  }, [router.query]);

  const ProfileDeatil = async (slug) => {
    setLoading(true);
    await axios.get(`${HOST}/sanctum/csrf-cookie`);

    if (localStorage.getItem("authToken")) {
      try {
        let url = `${HOST}/api/show-user/${slug}`;
        setLoading(true);

        const params = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        };

        const response = await axios.get(url, params);
        const data = response.data.data;
        setUserData(data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedItems(value);
    }
  };

  const reportHandel = async () => {
    setbuttonLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_HOST}/api/report-user`;
      let param = {
        report_to: userData.id,
        comment: formValue.message,
        reason: selectedItems,
      };

      let res = await axios.post(url, param, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let result = await res.data;

      if (result.status) {
        tostSuccess(result.message);
        setTimeout(() => {
          setReportToggel(false);
          ref.current.classList.remove("blur-sm");

          setFormValue({
            message: "",
          });
          setbuttonLoading(false);
        }, 1000);
        setbuttonLoading(false);
      }
    } catch (error) {
      setbuttonLoading(false);

    
      tostError(error.response.data.message);
    }
  };

  return (
    <>
      <section className="min-h-screen mt-8">
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
        <div
          ref={ref}
          className="container sm:m-auto px-2 mb-2 w-full md:w-2/5    "
        >
          {loading ? (
            <div className="flex justify-center  ">
              <span className="flex justify-center  absolute  top-64">
                <Spinner></Spinner>
              </span>
            </div>
          ) : (
            <div>
              <div className="p-5   drop-shadow-lg  border-green-300 border ">
                <div className=" bg-green-500 relative">
                  <div className="absolute top-2 right-3 z-10">
                    <span
                      onClick={() => {
                        if (dropToggel) {
                          togeldrop(false);
                        } else {
                          togeldrop(true);
                        }
                      }}
                      className=" text-white text-2xl hover:text-slate-200"
                    >
                      <i className="">
                        <BsThreeDots></BsThreeDots>
                      </i>
                    </span>
                  </div>
                  <div className="  rounded-lg m-auto py-8 ">
                    {dropToggel && (
                      <div className=" top-7 right-2.5  absolute z-10  bg-white divide-y divide-gray-100 rounded-sm shadow w-36">
                        <ul
                          className="py-1 text-sm text-gray-700  cursor-pointer"
                          aria-labelledby="dropdownSmallButton"
                        >
                          <li
                            onClick={() => {
                              togeldrop(false);
                              setReportToggel(true);
                              ref.current.classList.add("blur-sm");
                            }}
                          >
                            <a className="block px-4 py-1.5 hover:bg-gray-100 text-red-600">
                              <MdReport className="text-base mr-2 inline-block align-middle font-bold text-red-600" />
                              Report user
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                    <div className="  bottom-0  ">
                      <button className="rounded-full flex mx-auto z-10">
                        <img
                          src={
                            userData.image
                              ? HOST + userData.image
                              : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                          }
                          style={{ height: "130px", width: "130px" }}
                          className=" rounded-full"
                          alt=""
                        />
                      </button>
                    </div>
                    <div className="title-font flex   my-4  justify-center text-center sm:text-2xl  uppercase text-sm font-medium  text-gray-100 ">
                      {userData && userData.first_name
                        ? userData.first_name + " " + userData.last_name
                        : "Anonymous"}
                    </div>
                  </div>
                </div>
                <h1 className="title-font my-6  sm:text-2xl     ring-offset-2 text-2xl font-semibold text-black mb-0.5">
                  About
                </h1>
                <div className=" flex my-2 ">
                  <div className="  rounded-md bg-opacity-75    overflow-hidden text-start relative">
                    <p className="leading-relaxed  ">
                      {userData.description
                        ? userData.description
                        : "No description"}
                    </p>
                  </div>
                </div>
                <div className=" flex my-auto ">
                  <div className="  rounded-md bg-opacity-75 py-1   overflow-hidden text-start relative">
                    <div className="leading-relaxed underline underline-offset-2 ">
                      {userData.url ? (
                        <a
                          href={`http://${userData.url}`}
                          className="text-blue-600"
                        >
                          http://www.facebook.com
                        </a>
                      ) : (
                        <a
                          href={"http://www.googel.com"}
                          className="text-blue-600"
                        >
                          http://www.googel.com
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <h1 className="title-font  mb-2 my-7 sm:text-2xl     ring-offset-2 text-2xl font-semibold text-black ">
                  Rating & Review
                </h1>
                <span className="title-font  sm:text-4xl flex justify-center     ring-offset-2 text-2xl font-semibold text-black mb-4">
                  {!userData.rating_avg_rate
                    ? "0.0"
                    : parseFloat(userData.rating_avg_rate).toFixed(1)}
                  <span className="text-lg mx-1 text-slate-600">
                    {" "}
                    ( {userData.rating_count} ){" "}
                  </span>
                </span>
                {userData &&
                  userData.rating &&
                  userData.rating.map((key) => {
                    return (
                      <div className="border border-slate-300  p-4">
                        <div className="flex    ">
                          <div className="  flex text-center align-middle items-center ">
                            <a className="  flex mr-1 m-auto justify-center items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 lg:mt-0">
                              <img
                                src={
                                  key.rate_by && key.rate_by.image
                                    ? HOST + key.rate_by.image
                                    : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                                }
                                style={{ height: "50px", width: "50px" }}
                                className=" rounded-full"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="title-font    my-auto mx-3 sm:text-lg  underline-offset-4 underline   text-sm font-medium  text-gray-900 ">
                            {key.rate_by.first_name +
                              " " +
                              key.rate_by.last_name}

                            <span className=" flex  mt-1 ">
                              <svg
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                className="w-4 h-4 text-yellow-500"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                              </svg>
                              <svg
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                className="w-4 h-4 text-yellow-500"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                              </svg>
                              <svg
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                className="w-4 h-4 text-yellow-500"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                              </svg>
                              <svg
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                className="w-4 h-4 text-yellow-500"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                              </svg>
                            </span>
                          </div>
                        </div>
                        <div className="flex mt-4">
                          <div className="title-font flex  mx-2 uppercase    sm:text-base      text-sm font-medium  text-green-600 ">
                            {key.review}
                          </div>

                          <div className="title-font flex  ml-auto    sm:text-base      text-sm font-normal  text-gray-500 ">
                            {new Date(key.created_at).toLocaleDateString(
                              "PK-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </section>
      {toggel && (
        <span className="fixed inset-0 z-10 overflow-y-auto  ">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left  shadow-2xl shadow-slate-600 transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <form className="w-full max-w-lg p-8">
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3 mb-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="ddress"
                    >
                      First_Name
                    </label>
                    <input
                      required
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="name"
                      type="text"
                      name="first_name"
                      value={formValue.first_name}
                      onChange={onChange}
                      placeholder="First_Name"
                    />
                  </div>
                  <div className="w-full px-3 mb-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="ddress"
                    >
                      Last_name
                    </label>
                    <input
                      required
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="name"
                      type="text"
                      name="last_name"
                      value={formValue.last_name}
                      onChange={onChange}
                      placeholder="Lirst_Name"
                    />
                  </div>

                  <div className="w-full px-3 mb-2 ">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="phone"
                    >
                      Phone
                    </label>
                    <input
                      required
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="phone"
                      type="text"
                      placeholder="Phone"
                      name="phone"
                      value={formValue.phone}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </form>

              <div className="bg-gray-50 px-4 mb-2 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => {
                    settoggel(false);
                    handelUpdateProfile(userId);
                    ref.current.classList.remove("blur-sm");
                  }}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-2 mb-2 py-1 text-base font-normalont-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  update
                </button>
                <button
                  onClick={() => {
                    ref.current.classList.remove("blur-sm");
                    settoggel(false);
                  }}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 mb-2 py-1 text-base font-normalont-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </span>
      )}
      {reportToggel && (
        <span className="fixed inset-0 z-10 overflow-y-auto  ">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left  shadow-2xl shadow-slate-600 transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <h1 className="px-3 m-2 mt-5 text-2xl font-semibold">
                Report user
              </h1>

              <div className="md:flex  mt-3 grid grid-cols-2 gap-y-6 p-3 mb-2 flex-wrap">
                <div className="flex md:justify-center md:items-center items-center mx-2 justify-start">
                  <input
                    className="w-5 h-5 mr-2 accent-green-600 "
                    type="radio"
                    id="black"
                    name="color"
                    checked={selectedItems.includes("Inappropriate post")}
                    onChange={handleCheckboxChange}
                    value={"Inappropriate post"}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black"
                        for="checkbox"
                      >
                        Inappropriate post
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex md:justify-center md:items-center items-center mx-2 justify-start">
                  <input
                    className="w-5 h-5 mr-2 accent-green-600 "
                    type="radio"
                    id="black"
                    name="color"
                    checked={selectedItems.includes(
                      "This user is threatening me"
                    )}
                    value={"This user is threatening me"}
                    onChange={handleCheckboxChange}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black"
                        for="checkbox"
                      >
                        This user is threatening me
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex md:justify-center md:items-center items-center mx-2 justify-start">
                  <input
                    className="w-5 h-5 mr-2 accent-green-600 "
                    type="radio"
                    id="black"
                    name="color"
                    checked={selectedItems.includes("This is a fake account")}
                    onChange={handleCheckboxChange}
                    value={"This is a fake account"}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black"
                        for="checkbox"
                      >
                        This is a fake account
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex md:justify-center md:items-center items-center mx-2 justify-start">
                  <input
                    className="w-5 h-5 mr-2 accent-green-600 "
                    type="radio"
                    id="black"
                    name="color"
                    checked={selectedItems.includes("Spam")}
                    onChange={handleCheckboxChange}
                    value={"Spam"}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black"
                        for="checkbox"
                      >
                        Spam
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex md:justify-center md:items-center items-center mx-2 justify-start">
                  <input
                    className="w-5 h-5 mr-2 accent-green-600 "
                    type="radio"
                    id="black"
                    name="color"
                    checked={selectedItems.includes("Fraud")}
                    onChange={handleCheckboxChange}
                    value={"Fraud"}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black "
                        for="checkbox"
                      >
                        Fraud
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex md:justify-center md:items-center items-center mx-2 justify-start">
                  <input
                    className="w-5 h-5 mr-2 accent-green-600 "
                    type="radio"
                    id="black"
                    name="color"
                    checked={selectedItems.includes("Other")}
                    onChange={handleCheckboxChange}
                    value={"Other"}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black "
                        for="checkbox"
                      >
                        Other
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <form className="w-full max-w-lg p-4">
                <div className="flex flex-wrap -mx-3 mb-3">
                  <div className="w-full px-3 mb-2 ">
                    <label
                      className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                      htmlFor="Message"
                    >
                      Message
                    </label>
                    <textarea
                      required
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="Message"
                      type="text"
                      placeholder="Message"
                      name="message"
                      value={formValue.message}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </form>

              <div className=" px-4 mb-2 pt-2 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => {
                    if (
                      userData &&
                      localStorage.getItem("authToken") &&
                      selectedItems != ""
                    ) {
                      reportHandel();
                    }
                  }}
                  type="button"
                  disabled={buttonLoading}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-2 mb-2 py-1 text-base font-normalont-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {buttonLoading ? "Loading..." : "submite"}
                </button>
                <button
                  onClick={() => {
                    ref.current.classList.remove("blur-sm");
                    setReportToggel(false);
                  }}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 mb-2 py-1 text-base font-normalont-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </span>
      )}
    </>
  );
}

// export async function getServerSideProps(context) {
//   let loadings = false;
//   let token = context.req.cookies.authToken;
//   const { slug } = context.query;
//   const HOST = process.env.NEXT_PUBLIC_HOST; // Replace with your API host

//   await axios.get(`${HOST}/sanctum/csrf-cookie`);

//   if (token) {
//     try {
//       let url = `${HOST}/api/show-user/${slug}`;
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
//           userData: data,
//         },
//       };
//     } catch (error) {
//       console.error(error);
//       return {
//         props: {
//           error: " Unauthenticated. error occurred while fetching the data.",
//         },
//       };
//     }
//   }
//   return {
//     props: {
//       error: "Invalid token error occurred while fetching the data.",
//       userData: [],
//     },
//   };
// }

export default myAccount;
