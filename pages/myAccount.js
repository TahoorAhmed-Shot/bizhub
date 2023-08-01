import Spinner from "@/components/Spinner";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function myAccount({
  myUser,
  tostError,
  loading,
  handelGetUser,
  userData,
  tostSuccess,
}) {
  let router = useRouter();
  let HOST = process.env.NEXT_PUBLIC_HOST;
  const [selectedItems, setSelectedItems] = useState("");
  const [reportToggel, setReportToggel] = useState(false);
  const [formValue, setFormValue] = useState({
    password: "",
  });
  const ref = useRef();
  
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      handelGetUser();
    } else {
      router.push("/login");
    }
  }, [router.query]);
  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedItems(value);
    }
  };

  const handel = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_HOST}/api/delete-user`;
      let param = {
        password: formValue.password,
        email: localStorage.getItem("email"),
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
          setFormValue({});
          localStorage.clear();
          router.push("/login");
        }, 1000);
      }
    } catch (error) {
      
      tostError(error);
    }
  };

  return (
    <>
      <section className="mt-8 min-h-screen ">
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
          className=" sm:mx-auto px-2 w-full md:w-2/5     "
        >
          {loading ? (
            <div className="flex justify-center  ">
              <span className="flex justify-center  absolute  top-64">
                <Spinner></Spinner>
              </span>
            </div>
          ) : (
            <div className="p-5 drop-shadow-lg border">
              <div className=" flex justify-between ">
                <div className=" flex rounded-lg  mb-4 justify-end ">
                  <div className="   ">
                    <div
                      onClick={() => {
                        ref.current.classList.add("blur-sm");

                        setReportToggel(true);
                      }}
                      className=" cursor-pointer flex p-2 border-red-600 border font-semibold rounded-sm text-red-600 tracking-wider mx-auto z-10"
                    >
                      Delete Profile
                    </div>
                  </div>
                </div>
                <div className=" flex rounded-lg  mb-4 justify-start ">
                  <div className="   ">
                    <Link
                      href={"/updateProfile"}
                      className=" flex p-2 border-green-600 border font-semibold rounded-sm text-green-600 tracking-wider mx-auto z-10"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
              <div className=" bg-green-500">
                <div className="  rounded-lg m-auto py-8 ">
                  <div className="  bottom-0  ">
                    <button className="rounded-full flex mx-auto z-10">
                      <Image
                        height={2}
                        width={2}
                        src={
                          userData && userData.image
                            ? HOST + userData.image
                            : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                        }
                        style={{ height: "130px", width: "130px" }}
                        className="rounded-full"
                        alt=""
                      />
                    </button>
                  </div>
                  <div className="title-font flex   my-4  justify-center text-center sm:text-2xl  uppercase text-sm font-medium  text-gray-100 ">
                    {userData && userData.first_name !== null
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
                            <Image
                              height={2}
                              width={2}
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
                          {key.rate_by.first_name + " " + key.rate_by.last_name}

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
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>
      {reportToggel && (
        <span className="fixed inset-0 z-10 overflow-y-auto  ">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left  shadow-2xl shadow-slate-600 transition-all sm:my-6 sm:w-full sm:max-w-lg">
              <div className=" mt-8   items-start gap-y-4 px-4 flex flex-col ">
                <label
                  className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-1 px-2"
                  htmlFor="Message"
                >
                  Select Reason
                </label>
                <div className="flex md:justify-center md:items-center items-center mx-2 justify-start">
                  <input
                    className="w-5 h-5 mr-2 accent-green-600 "
                    type="radio"
                    id="black"
                    name="color"
                    checked={selectedItems.includes("Did not find services")}
                    onChange={handleCheckboxChange}
                    value={"Did not find services"}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black "
                        for="checkbox"
                      >
                        Did not find services
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
                      "Don`t have use for the app"
                    )}
                    value={"Don`t have use for the app"}
                    onChange={handleCheckboxChange}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black "
                        for="checkbox"
                      >
                        Don`t have use for the app
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
                      "I dont`t understand how to use app"
                    )}
                    onChange={handleCheckboxChange}
                    value={"I dont`t understand how to use app"}
                  />
                  <div className="inline-block">
                    <div className="flex space-x-6 justify-center items-center">
                      <label
                        className="mr-2 text-sm leading-3 font-normal text-black"
                        for="checkbox"
                      >
                        I dont`t understand how to use app
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
              <form className="w-full mt-4 max-w-lg md:py-2 px-5">
                <div className="flex flex-wrap -mx-3 mb-1">
                  <div className="w-full px-3 mb-1 ">
                    <label
                      className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                      htmlFor="Message"
                    >
                      Password
                    </label>
                    <input
                      required
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="Message"
                      type="text"
                      placeholder="Password"
                      name="password"
                      value={formValue.password}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </form>

              <div className=" px-4 mb-3  sm:flex sm:flex-row-reverse sm:px-6">
                {selectedItems ? (
                  <button
                    onClick={() => {
                      if (
                        localStorage.getItem("email") &&
                        localStorage.getItem("authToken")
                      ) {
                        handel();
                      }
                    }}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-2 mb-2 py-1 text-base font-normalont-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    confirm
                  </button>
                ) : (
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-400 px-2 mb-2 py-1 text-base font-normalont-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    confirm
                  </button>
                )}
                <button
                  onClick={() => {
                    ref.current.classList.remove("blur-sm");
                    setReportToggel(false);
                    setSelectedItems("");
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

export default myAccount;
