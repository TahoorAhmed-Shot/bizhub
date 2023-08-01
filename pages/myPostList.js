import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  BsCloudCheckFill,
  BsThreeDots,
} from "react-icons/bs";
import { MdManageAccounts, MdThumbUp } from "react-icons/md";

import { FaEdit } from "react-icons/fa";
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "@/components/Spinner";
import Image from "next/image";

function myPost({
  myJob,
  myAllJob,
  myServices,
  myAllServices,
  tostError,
  tostSuccess,
  loading,
  state,
  setState,
}) {
  const router = useRouter();
  const ref = useRef();
  const [colorState1, setColorState1] = useState("border-2 border-gray-200");
  const [colorState2, setColorState2] = useState("border-2 border-gray-200");
  const [editToggel, setEditToggel] = useState(false);
  const [deleteToggel, setDeleteToggel] = useState(false);
  const [completeToggel, setCompleteToggel] = useState(false);
  const [bumpUpToggel, setBumpUpToggel] = useState(false);
  const [imageSrcs, setImageSrcs] = useState([]);
  const [isServer, setisServer] = useState(true);
  const [buttonLoading, setbuttonLoading] = useState(false);

  let HOST = process.env.NEXT_PUBLIC_HOST;
  const [formValue, setFormValue] = useState({
    id: "",
    category_id: "",
    type: "",
    title: "",
    is_negotiable: "",
    amount: "",
    latitude: "",
    longitude: "",
    description: "",
    address: "",
    images: "",
  });
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const togeldrop = (index) => {
    setSelectedOptionIndex(index === selectedOptionIndex ? null : index);
  };

  useEffect(() => {
    if (state) {
      myJob();
      setColorState1("border-2 border-green-600");
    } else {
      myServices();
    }
  }, [router.query]);
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.push("/login");
    }
  }, [router.query]);

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  let deleteMyPost = (currentUser) => {
    ref.current.classList.add("blur-sm");
    setDeleteToggel(true);
    setSelectedOptionIndex(null);
    setFormValue({ id: currentUser.id });
  };

  let complete = (currentUser) => {
    ref.current.classList.add("blur-sm");
    setCompleteToggel(true);
    setSelectedOptionIndex(null);
    setFormValue({ id: currentUser.id });
  };

  let BumpUp = (currentUser) => {
    ref.current.classList.add("blur-sm");
    setBumpUpToggel(true);
    setSelectedOptionIndex(null);
    setFormValue({ id: currentUser.id });
  };

  const handelBumpUp = async (userId) => {
    try {
      let url = `${HOST}/api/thumbs-up-service/${userId}`;
      let res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let value = await res.data;

      if (res.status) {
        tostSuccess(value.message);
        if (state) {
          myJob();
        } else {
          myServices();
        }
        setDeleteToggel(false);
      }
    } catch (error) {
      tostError(error.response.data.message);
    }
  };
  const handelDelete = async (userId) => {
    try {
      let url = `${HOST}/api/delete-service/${userId}`;
      let res = await axios.delete(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let value = await res.data;

      if (res.status) {
        tostSuccess(value.message);
        if (state) {
          myJob();
        } else {
          myServices();
        }
        setDeleteToggel(false);
      }
    } catch (error) {
      tostError(error.response.data.message);
    }
  };

  let updateMyPost = (currentUser) => {
    ref.current.classList.add("blur-sm");

    setEditToggel(true);
    setSelectedOptionIndex(null);
    setFormValue({
      id: currentUser.id,
      category_id: currentUser.category.id,
      type: currentUser.type,
      is_negotiable: currentUser.is_negotiable,
      amount: currentUser.amount,
      title: currentUser.title,
      description: currentUser.description,
      longitude: currentUser.longitude,
      latitude: currentUser.latitude,
      address: currentUser.address,
      images: currentUser.images,
    });
  };

  const handelUpdate = async () => {
    setbuttonLoading(true);
    try {
      let url = `${HOST}/api/service-update`;
      let params = {
        id: formValue.id,
        category_id: formValue.category_id,
        type: formValue.type,
        is_negotiable: formValue.is_negotiable,
        amount: formValue.amount,
        title: formValue.title,
        description: formValue.description,
        longitude: formValue.longitude,
        latitude: formValue.latitude,
        address: formValue.address,
        images: JSON.stringify(imageSrcs),
      };
      let res = await axios.post(url, params, {
        headers: {
          "Content-Type": " application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let data = await res.data;

      if (data.status) {
        tostSuccess(data.message);
        ref.current.classList.remove("blur-sm");

        setDeleteToggel(false);
        if (state) {
          myJob();
        } else {
          myServices();
        }
        setbuttonLoading(false);
        setEditToggel(false);
      }
      setbuttonLoading(false);
      setEditToggel(false);
    } catch (error) {
      setbuttonLoading(false);
      tostError(error.response.data.message);
      ref.current.classList.remove("blur-sm");
    }
  };
  function handleFileChange(event) {
    const files = event.target.files;
    const newImageSrcs = [...imageSrcs];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", function () {
        setisServer(false);

        const base64 = reader.result.split(",").pop();
        newImageSrcs.push({
          image: base64,
          localImage: reader.result,
          imagePath: file.name,
          extension: JSON.parse(JSON.stringify(file.name.split(".").pop())),
        });
        setImageSrcs(newImageSrcs);
      });
    }
  }
  return (
    <>
      <section className="min-h-screen  ">
        <div className="py-2 px-3">
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
        </div>
        <div ref={ref}>
          <div className=" mt-4 border-gray-200">
            <ul className="flex   -mb-px text-base font-medium text-center  cursor-pointer justify-center mx-auto text-gray-800 ">
              <li className="">
                <a
                  onClick={() => {
                    setState(true);
                    setColorState1("border-2 border-green-600");
                    setColorState2("border-2 border-gray-200");
                    setSelectedOptionIndex(null);
                    router.query = true;
                  }}
                  className={`inline-flex px-2 w-24 text-center  ${
                    state
                      ? "border-2 border-green-600"
                      : "border-2 border-gray-200"
                  }  justify-center py-2  active  group`}
                >
                  Job
                </a>
              </li>
              <li className="mx-3">
                <a
                  onClick={() => {
                    setState(false);
                    setColorState2("border-2 border-green-600");
                    setColorState1("border-2 border-gray-200");
                    setSelectedOptionIndex(null);

                    router.query = false;
                  }}
                  className={`inline-flex px-2 w-24  justify-center py-2  ${
                    !state
                      ? "border-2 border-green-600"
                      : "border-2 border-gray-200"
                  }  hover:text-gray-600  group`}
                >
                  Services
                </a>
              </li>
            </ul>
          </div>

          <div className="container  px-1 md:py-12 py-7 mx-auto">
            <div className="flex  justify-center mx-auto">
              {loading == false &&
                state &&
                myAllJob.length == 0 &&
                "No Posts Available"}
              {loading == false &&
                !state &&
                myAllServices.length == 0 &&
                "No Posts Available"}
            </div>
            {loading ? (
              <div className="flex justify-center  ">
                <span className="flex justify-center  absolute  top-64">
                  <Spinner></Spinner>
                </span>
              </div>
            ) : (
              state && (
                <div className="flex flex-wrap sm:justify-start justify-center mx-auto ">
                  {myAllJob &&
                    myAllJob.map((key, index) => {
                      return (
                        <div key={index} className="w-[50%] md:w-[15rem]  ">
                          <div className=" relative rounded-lg shadow-lg hover:shadow-xl cursor-pointer overflow-hidden my-2 md:mx-2 mx-1">
                            <div className="max-w-sm bg-white mx-auto  rounded-xl shadow-xl  ">
                              <div className="relative">
                                <div className="relative">
                                  {!key.images[0] ? (
                                    <Image
                                      height={2}
                                      width={2}
                                      className="rounded-t-lg object-contain   h-48 p-4 -z-10  w-full bg-black  "
                                      src={`${"/images/bizhub_logo.png"}`}
                                      alt=""
                                    />
                                  ) : (
                                    <Image
                                      height={2}
                                      width={2}
                                      className="rounded-t-lg object-cover  h-48  w-full bg-slate-100  "
                                      src={`${
                                        !key.images[0]
                                          ? "https://images.olx.com.pk/thumbnails/347296539-240x180.webp"
                                          : HOST + key.images[0].image
                                      }`}
                                      alt=""
                                    />
                                  )}
                                </div>
                                <div className="absolute top-2 right-3 z-10">
                                  <span
                                    onClick={() => {
                                      togeldrop(index);
                                    }}
                                    className=" text-white text-xl hover:text-gray-300"
                                  >
                                    <i className="">
                                      <BsThreeDots></BsThreeDots>
                                    </i>
                                  </span>
                                </div>
                                {selectedOptionIndex == index && (
                                  <div className="top-7 right-2.5 absolute  bg-white divide-y divide-gray-100 rounded-sm shadow w-36">
                                    <ul
                                      className="py-2 text-sm text-gray-700 cursor-pointer"
                                      aria-labelledby="dropdownSmallButton"
                                    >
                                      <li>
                                        {key.status == 0 && (
                                          <a
                                            onClick={() => {
                                              updateMyPost(key);
                                              
                                            }}
                                            className="block px-4 py-1.5 hover:bg-gray-100 "
                                          >
                                            <FaEdit className="text-sm mr-2 inline-block align-middle text-blue-600" />
                                            Edit
                                          </a>
                                        )}
                                      </li>
                                      <li>
                                        {key.status == 0 && (
                                          <a
                                            onClick={() => BumpUp(key)}
                                            className="block px-4 py-1.5 hover:bg-gray-100"
                                          >
                                            <MdThumbUp className="text-base mr-2 inline-block align-middle text-green-600" />
                                            Bump up
                                          </a>
                                        )}
                                      </li>
                                      <li>
                                        {key.status == 0 && (
                                          <a
                                            onClick={() => complete(key)}
                                            className="block px-4 py-1.5 hover:bg-gray-100"
                                          >
                                            <BsCloudCheckFill className="text-base mr-2 inline-block align-middle text-green-600" />
                                            Complete
                                          </a>
                                        )}
                                      </li>
                                      <li>
                                        <a
                                          onClick={() => {
                                            deleteMyPost(key);
                                          }}
                                          className="block px-4 py-1.5 hover:bg-gray-100 "
                                        >
                                          <AiFillDelete className="text-sm mr-2 inline-block align-middle text-red-600" />
                                          Delete
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>

                              <div className="py-2  sm:px-3 px-1.5 border-green-600 border-l-8 rounded-b-lg">
                                <Link href={`/myPostDetail/${key.id}`}>
                                  <h5 className="my-1 md:text-xl md:font-semibold text-lg font-medium  tracking-tight h-14 text-black ">
                                    {key.title.slice(0, 18)}
                                    {key.title.length > 18 && "..."}
                                  </h5>

                                  <div className="flex   my-2 align-middle items-center">
                                    <sapn className="tracking-tight text-slate-900 text-center md:text-xl  align-middle text-lg md:font-bold font-medium title-font">
                                      ${key.amount}
                                    </sapn>
                                    <div className="ml-auto">
                                      {key.status == 0 && (
                                        <span className=" bg-blue-600   md:w-20 w-16 mr-auto md:py-1 py-0.5 flex justify-center text-green-100  font-medium text-center text-sm  align-middle  rounded-md ">
                                          Active
                                        </span>
                                      )}
                                      {key.status == 1 && (
                                        <button className=" bg-green-600 md:w-20 w-[4.5rem] mr-auto md:py-1 py-0.5 flex justify-center text-green-100  font-medium text-center text-sm  align-middle  rounded-md">
                                          Complete
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )
            )}

            {loading ? (
              <div className="flex justify-center  ">
                <span className="flex justify-center  absolute  top-64">
                  <Spinner></Spinner>
                </span>
              </div>
            ) : (
              !state && (
                <div className="flex flex-wrap sm:justify-start justify-center mx-auto   ">
                  {myAllServices &&
                    myAllServices.map((key, index) => {
                      return (
                        <div key={index} className="w-[50%] md:w-[15rem]  ">
                          <div className=" relative rounded-lg shadow-lg hover:shadow-xl cursor-pointer overflow-hidden my-2 md:mx-2 mx-1">
                            <div className="max-w-sm bg-white mx-auto  rounded-xl shadow-xl ">
                              <div className="relative">
                                {!key.images[0] ? (
                                  <Image
                                    height={2}
                                    width={2}
                                    className="rounded-t-lg object-contain   h-48 p-4 -z-10  w-full bg-black  "
                                    src={`${"/images/bizhub_logo.png"}`}
                                    alt=""
                                  />
                                ) : (
                                  <Image
                                    height={2}
                                    width={2}
                                    className="rounded-t-lg object-cover  h-48  w-full bg-slate-100  "
                                    src={`${
                                      !key.images[0]
                                        ? "https://images.olx.com.pk/thumbnails/347296539-240x180.webp"
                                        : HOST + key.images[0].image
                                    }`}
                                    alt=""
                                  />
                                )}
                                <div className="absolute top-2 right-3 z-10">
                                  <span
                                    onClick={() => {
                                      togeldrop(index);
                                    }}
                                    className=" text-white text-xl hover:text-gray-300"
                                  >
                                    <i className="">
                                      <BsThreeDots></BsThreeDots>
                                    </i>
                                  </span>
                                </div>
                                {selectedOptionIndex == index && (
                                  <div className="top-7 right-2.5 absolute  bg-white divide-y divide-gray-100 rounded-sm shadow w-36 ">
                                    <ul className="py-2 text-sm text-gray-700">
                                      <li>
                                        {key.status == 0 && (
                                          <a
                                            onClick={() => {
                                              updateMyPost(key);
                                            }}
                                            className="block px-4 py-1.5 hover:bg-gray-100"
                                          >
                                            <FaEdit className="text-sm mr-2 inline-block align-middle text-blue-600" />
                                            Edit
                                          </a>
                                        )}
                                      </li>
                                      <li>
                                        {key.status == 0 && (
                                          <a
                                            onClick={() => BumpUp(key)}
                                            className="block px-4 py-1.5 hover:bg-gray-100"
                                          >
                                            <MdThumbUp className="text-base mr-2 inline-block align-middle text-green-600" />
                                            Bump up
                                          </a>
                                        )}
                                      </li>

                                      <li>
                                        {key.status == 0 && (
                                          <a
                                            onClick={() => {
                                              complete(key);
                                            }}
                                            className="block px-4 py-1.5 hover:bg-gray-100"
                                          >
                                            <BsCloudCheckFill className="text-sm mr-2 inline-block align-middle text-green-600" />
                                            Complete
                                          </a>
                                        )}
                                      </li>
                                      <li>
                                        <a
                                          onClick={() => {
                                            deleteMyPost(key);
                                          }}
                                          className="block px-4 py-1.5 hover:bg-gray-100"
                                        >
                                          <AiFillDelete className="text-sm mr-2 inline-block align-middle text-red-600" />
                                          Delete
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>

                              <div className="py-2 sm:px-3 px-1.5  border-green-600 border-l-8 rounded-b-lg">
                                <Link href={`/myPostDetail/${key.id}`}>
                                  <h5 className="my-1 md:text-xl md:font-semibold text-lg font-medium   tracking-tight h-14 text-black">
                                    {key.title.slice(0, 18)}
                                    {key.title.length > 18 && "..."}
                                  </h5>

                                  <div className="flex   my-2 align-middle items-center  ">
                                    <sapn className="tracking-tight text-slate-900 text-center md:text-xl  align-middle text-lg md:font-bold font-medium title-font">
                                      ${key.amount}
                                    </sapn>
                                    <div className="ml-auto">
                                      {key.status == 0 && (
                                        <span className=" bg-blue-600 md:w-20 w-16 mr-auto md:py-1 py-0.5 flex justify-center text-green-100  font-medium text-center text-sm  align-middle  rounded-md ">
                                          Active
                                        </span>
                                      )}
                                      {key.status == 1 && (
                                        <span className=" bg-green-600  md:w-20 w-[4.5rem]  md:py-1 py-0.5 mr-auto  flex justify-center text-green-100  font-medium text-center text-sm  align-middle  rounded-md ">
                                          Complete
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )
            )}
          </div>
        </div>

        {deleteToggel && (
          <span className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative bg-white rounded-lg w-96 h-auto shadow-2xl shadow-slate-600">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-hide="popup-modal"
                  onClick={() => {
                    ref.current.classList.remove("blur-sm");

                    setDeleteToggel(false);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-8 my-4 text-center">
                  <svg
                    aria-hidden="true"
                    className="mx-auto mb-4 text-red-400 w-14 h-14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                    Are you sure you want to delete
                    <span className="text-red-600 font-normal mx-1">
                      {formValue.id}
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");
                      handelDelete(formValue.id);
                      setDeleteToggel(false);
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Yes, sure
                  </button>
                  <button
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");
                      setDeleteToggel(false);
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 "
                  >
                    No cancel
                  </button>
                </div>
              </div>
            </div>
          </span>
        )}

        {bumpUpToggel && (
          <span className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative bg-white rounded-lg w-96 h-auto shadow-2xl shadow-slate-600 ">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-hide="popup-modal"
                  onClick={() => {
                    ref.current.classList.remove("blur-sm");

                    setBumpUpToggel(false);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-6 my-4 text-center">
                  <h3 className="mb-5 mt-1 text-xl font-normal text-gray-500">
                    Are you want to Bump up <i></i>
                    <span className="text-red-600 font-normal mx-1">
                      {formValue.name}
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");
                      handelBumpUp(formValue.id);
                      setBumpUpToggel(false);
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Yes, sure
                  </button>
                  <button
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");
                      bumpUpToggel(false);
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                  >
                    No cancel
                  </button>
                </div>
              </div>
            </div>
          </span>
        )}

        {completeToggel && (
          <span className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative bg-white rounded-lg w-96 h-auto shadow-2xl shadow-slate-600">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-hide="popup-modal"
                  onClick={() => {
                    ref.current.classList.remove("blur-sm");

                    setCompleteToggel(false);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-8 my-4 text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500">
                    Are you sure to Complete
                  </h3>
                  <Link
                    href={`/serviceCompelete/${formValue.id}`}
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");

                      setCompleteToggel(false);
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Yes, sure
                  </Link>
                  <button
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");
                      setCompleteToggel(false);
                    }}
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                  >
                    No cancel
                  </button>
                </div>
              </div>
            </div>
          </span>
        )}

        {/* Edit Form */}
        {editToggel && (
          <span className="fixed inset-0 z-10 overflow-y-auto  ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left  shadow-2xl shadow-slate-600 transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form className="w-full max-w-lg p-8 md:p-6">
                  <div className="flex items-center justify-center w-full mb-3">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 "
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        name="image"
                        multiple
                        id="dropzone-file"
                        type="file"
                        onChange={handleFileChange}
                        className="relative mx-auto"
                        hidden
                      />
                      <div className="flex overflow-x-hidden ">
                        {isServer == true &&
                          formValue.images.map((src, index) => (
                            <Image
                              height={2}
                              width={2}
                              key={index}
                              src={
                                src
                                  ? HOST + src.image
                                  : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                              }
                              alt={`Selected file preview ${index}`}
                              className="w-full h-full"
                            />
                          ))}
                        {isServer == false &&
                          imageSrcs.map((src, index) => (
                            <Image
                              height={2}
                              width={2}
                              key={index}
                              src={src.localImage}
                              alt={`Selected file preview ${index}`}
                              className="w-full h-full"
                            />
                          ))}
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlhtmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        type="text"
                        name="title"
                        onChange={onChange}
                        value={formValue.title}
                        placeholder="Title"
                      />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlhtmlFor="company"
                      >
                        Description
                      </label>
                      <input
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="text"
                        onChange={onChange}
                        value={formValue.description}
                        name="description"
                        placeholder="Description"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlhtmlFor="ddress"
                      >
                        Amount
                      </label>
                      <input
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="address"
                        name="amount"
                        value={formValue.amount}
                        onChange={onChange}
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                </form>

                <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    disabled={buttonLoading}
                    onClick={() => {
                      handelUpdate();
                    }}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-2 py-1 text-base font-normalont-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {buttonLoading ? "Loading..." : "update"}
                  </button>
                  <button
                    onClick={() => {
                      ref.current.classList.remove("blur-sm");
                      setEditToggel(false);
                    }}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-base font-normalont-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
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

export default myPost;
