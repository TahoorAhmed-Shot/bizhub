import Spinner from "@/components/Spinner";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCamera } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function myAccount({ myUser, tostError, tostSuccess, loading, setLoading }) {
  let router = useRouter();
  let HOST = process.env.NEXT_PUBLIC_HOST;
  const [userData, setuserData] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [toogelMessage, settoogelMessage] = useState(false);
  const [isServer, setisServer] = useState(true);
  const [formValue, setFormValue] = useState({
    image: "",
    extension: "",
    first_name: "",
    last_name: "",
    email: "",
    description: "",
    url: "",
    phone: "",
    device_id: "",
  });
  const ref = useRef();
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      handel();
    }
  }, [router.query]);
  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handel = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });

    setLoading(true);
    try {
      let url = `${HOST}/api/show-user`;
      let res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let result = await res.data;
      setuserData(result.data);

      setImageSrc(result.data.image);
      setFormValue({
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        email: result.data.email,
        description: result.data.description,
        url: result.data.url,
        phone: result.data.phone,
        device_id: result.data.device_id,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      tostError(error);
    }
  };
  const handelUpdateProfile = async (e) => {
    e.preventDefault();
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });

    try {
      let url = `${HOST}/api/update-user`;
      let data = {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        email: formValue.email,
        description: formValue.description,
        url: formValue.url,
        phone: formValue.phone,
        device_id: formValue.device_id,
      };
      let dataImage = {
        image: imageSrc && imageSrc.split(",").pop(),
        extension: selectedFile,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        email: formValue.email,
        description: formValue.description,
        url: formValue.url,
        phone: formValue.phone,
        device_id: formValue.device_id,
      };

      let res = await axios.post(url, isServer ? data : dataImage, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let result = await res.data;

      if (result.status) {
        setuserData(result);
        localStorage.setItem("firstName", result.data.first_name);
        localStorage.setItem("lastName", result.data.last_name);
        localStorage.setItem("email", result.data.email);
        localStorage.setItem("phone", result.data.phone);
        if (result.data.image != null) {
          localStorage.setItem("image", result.data.image);
        }
        tostSuccess(result.message);
        if (localStorage.getItem("authToken")) {
          handel();
        }
      }
    } catch (error) {
      tostError(error.message);
    }
  };

  function handleFileChange(event) {
    const files = event.target.files;
    const file = files[0];

    setSelectedFile(JSON.parse(JSON.stringify(file.name.split(".").pop())));

    const reader = new FileReader();

    reader.addEventListener("load", function () {
      setisServer(false);
      setImageSrc(reader.result);
    });
    reader.readAsDataURL(file);
    if (file) {
      settoogelMessage(false);
      ref.current.classList.remove("blur-sm");
    }
  }

  return (
    <>
      <section className="min-h-screen mt-10">
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
        {toogelMessage && (
          <span className="fixed inset-0 z-20 overflow-y-auto  ">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left  shadow-2xl shadow-slate-600 transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form className="w-full max-w-lg p-6">
                  <div className="flex items-center justify-center w-full mb-3 ">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
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
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        name="image"
                        multiple
                        id="dropzone-file"
                        type="file"
                        onChange={handleFileChange}
                        className="relative "
                      />
                    </label>
                  </div>
                </form>

                <div className="px-4 py-1 mb-4 sm:flex sm:flex-row-reverse sm:px-6">
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
              </div>
            </div>
          </span>
        )}
        <div ref={ref} className="md:px-4 px-1 md:py-5 py-2">
          <div className="flex justify-center items-center flex-wrap h-full  text-gray-800">
            {loading ? (
              <div className="flex justify-center  ">
                <span className="flex justify-center  absolute  top-64">
                  <Spinner></Spinner>
                </span>
              </div>
            ) : (
              <div className="sm:w-5/6 md:w-2/3 w-full lg:w-2/5 m-auto p-2 cursor-pointer  border">
                <form onSubmit={handelUpdateProfile}>
                  <div className="  rounded-lg  py-6 ">
                    <div
                      onClick={() => {
                        ref.current.classList.add("blur-sm");

                        settoogelMessage(true);
                      }}
                      className="  relative  "
                    >
                      <div className="rounded-full flex mx-auto z-10  justify-center relative ">
                        {isServer == true && (
                          <Image
                            height={2}
                            width={2}
                            src={
                              userData && userData.image
                                ? HOST + userData.image
                                : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                            }
                            style={{ height: "150px", width: "150px" }}
                            className=" rounded-full"
                            alt=""
                          />
                        )}
                        {isServer == false && (
                          <Image
                            height={2}
                            width={2}
                            src={imageSrc}
                            alt={`Selected file preview `}
                            style={{ height: "150px", width: "150px" }}
                            className=" rounded-full"
                          ></Image>
                        )}
                        <span className=" flex  absolute bottom-2 md:right-[17.5rem] right-28  cursor-pointer  justify-end  z-10 items-end   opacity-80 ">
                          <i className=" rounded-full text-2xl  p-3 bg-slate-100 text-green-400">
                            <AiFillCamera />
                          </i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-6">
                    <div className=" md:w-1/2 w-full md:mx-4 mx-1  ">
                      <label
                        className="block  tracking-normal  text-gray-500 text-lg  font-medium mb-1"
                        htmlhtmlFor="amount"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control block w-full py-2 md:px-3 px-2 md:text-xl text-base font-normal text-gray-800 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-500 focus:bg-white focus:border-green-600 focus:outline-none"
                        placeholder="First"
                        onChange={onChange}
                        value={formValue.first_name}
                        name="first_name"
                      />
                    </div>
                    <div className=" md:w-1/2 w-full   md:mx-4 mx-1  ">
                      <label
                        className="block  tracking-normal  text-gray-500 text-lg font-medium mb-1"
                        htmlhtmlFor="amount"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control block w-full py-2 md:px-3 px-2 md:text-xl text-base font-normal  text-gray-500 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-500 focus:bg-white focus:border-green-600 focus:outline-none"
                        placeholder="Last"
                        onChange={onChange}
                        value={formValue.last_name}
                        name="last_name"
                      />
                    </div>
                  </div>
                  <div className="flex mt-4">
                    <div className=" md:w-1/2 w-full md:mx-4 mx-1  ">
                      <label
                        className="block  tracking-normal  text-gray-500 text-lg  font-medium mb-1"
                        htmlhtmlFor="amount"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control block w-full py-2 md:px-3 px-2 md:text-xl text-base font-normal text-gray-800 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-500 focus:bg-white focus:border-green-600 focus:outline-none"
                        placeholder="email"
                        readOnly
                        value={formValue.email}
                        name="email"
                      />
                    </div>
                    <div className=" md:w-1/2 w-full   md:mx-4 mx-1  ">
                      <label
                        className="block  tracking-normal  text-gray-500 text-lg font-medium mb-1"
                        htmlhtmlFor="amount"
                      >
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control block w-full py-2 md:px-3 px-2 md:text-xl text-base font-normal  text-gray-500 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-500 focus:bg-white focus:border-green-600 focus:outline-none"
                        readOnly
                        value={formValue.phone}
                        name="phone"
                      />
                    </div>
                  </div>

                  <div className="  md:mx-4 mx-1  mt-5 ">
                    <label
                      className="block  tracking-normal  text-gray-500 text-lg  font-medium mb-1"
                      htmlhtmlFor="amount"
                    >
                      Description
                    </label>
                    <textarea
                      type="text"
                      rows={5}
                      className="form-control block w-full py-2 md:px-3 px-2 md:text-xl text-base font-normal text-gray-800 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-500 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="Description"
                      onChange={onChange}
                      value={formValue.description}
                      name="description"
                    />
                  </div>
                  <div className="  md:mx-4 mx-1  mt-4 ">
                    <label
                      className="block  tracking-normal  text-gray-500 text-lg  font-medium mb-1"
                      htmlhtmlFor="amount"
                    >
                      Url
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full py-2 md:px-3 px-2 md:text-xl text-base font-normal text-gray-800 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-500 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="url"
                      onChange={onChange}
                      value={formValue.url}
                      name="url"
                    />
                  </div>
                  <div className="flex md:mx-4 mx-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className=" px-4 my-8 sm:py-2 py-2.5 bg-green-600 text-white  font-medium text-lg leading-snug  rounded-sm shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out "
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default myAccount;
