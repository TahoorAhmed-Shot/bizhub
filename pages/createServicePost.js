import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { GrLocation } from "react-icons/gr";

function createServerPost({
  tostError,
  tostSuccess,
  gooogle,
  location,
  myUser,
  setState,
}) {
  let router = useRouter();
  const [imageSrcs, setImageSrcs] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = router.query;
  const [LocationValue, setLocationValue] = useState({
    myLongitude: "",
    myLatitude: "",
    locationArea: "",
    id: "",
  });

  const [serviceLocation, setServiceLocation] = useState([]);

  const [queryLocation, setQueryLocation] = useState("");
  const ref = useRef();
  const [locationToggel, setLocationToggel] = useState(false);
  let HOST = process.env.NEXT_PUBLIC_HOST;

  useEffect(() => {
    if (navigator.geolocation) {
      gooogle();
    } else {
      setLoading(false);
    }
  }, [router.query]);
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      return;
    } else {
      router.push("/login");
    }
  }, [router.query]);

  useEffect(() => {
    serviceLocationHandel();
    if (queryLocation.length > 0) {
      ref.current.classList.add("blur-md");
    } else {
      ref.current.classList.remove("blur-md");
    }
  }, [queryLocation]);

  const [formValue, setFormValue] = useState({
    image: "",
    title: "",
    description: "",
    is_negotiable: "",
    amount: "",
  });
  const onSearchLocation = (e) => {
    let getSearchData = e.target.value;
    setQueryLocation(getSearchData);
  };
  const googleApiKey = "AIzaSyCgYbHR3oi_8pgbqxkexNvGnvD-FCIFMr8";
  let serviceLocationHandel = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});
    try {
      if (queryLocation.length > 1) {
        let url = `${HOST}/api/search-name-on-map/${queryLocation}`;
        const response = await axios.get(url);
        const data = await response.data.predictions;

        setServiceLocation(data);
      } else {
        setServiceLocation([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  let serviceLocationPlaceInfo = async (id) => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});
    try {
      let url = `${HOST}/api/get-info-by-id/${id}`;
      const response = await axios.get(url);
      const data = await response.data.result;
      setLocationValue({
        myLatitude: JSON.stringify(data.geometry.location.lat),
        myLongitude: JSON.stringify(data.geometry.location.lng),
        locationArea: data.formatted_address,
      });
      setLocationToggel(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handel = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = `${process.env.NEXT_PUBLIC_HOST}/api/add-service`;
      let param = {
        images: JSON.stringify(imageSrcs),
        category_id: id,
        type: "1",
        title: formValue.title,
        description: formValue.description,
        is_negotiable: "0",
        amount: formValue.amount,
        address: LocationValue.locationArea,
        latitude: LocationValue.myLatitude,
        longitude: LocationValue.myLongitude,
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
          router.push("/myPostList");
          setState(false);
          setFormValue({
            image: "",
            title: "",
            description: "",
            amount: "",
          });
        }, 1000);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      tostError(error.response.data.message);
    }
  };
  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  function handleFileChange(event) {
    const files = event.target.files;
    const newImageSrcs = [...imageSrcs];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", function () {
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
      <section className="my-3 min-h-screen">
        <div className="px-8 py-5">
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
            className="flex justify-center items-center flex-wrap h-full  text-gray-800"
          >
            <div className="sm:w-5/6 md:w-1/2 lg:w-2/5 mx-auto md:p-10 p-6 rounded-md shadow-xl">
              <form onSubmit={handel}>
                <div className="flex items-center justify-center w-full mb-3">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
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
                    <div className="flex justify-center mx-auto w-80">
                      <input
                        name="image"
                        multiple
                        id="dropzone-file"
                        type="file"
                        onChange={handleFileChange}
                        className="relative mx-auto"
                      />
                    </div>
                    <div className="flex overflow-x-hidden   ">
                      {imageSrcs.map((src, index) => (
                        <Image
                          height={2}
                          width={2}
                          key={index}
                          src={src.localImage}
                          alt={`Selected file preview ${index}`}
                          className="w-full h-full mx-2"
                        />
                      ))}
                    </div>
                  </label>
                </div>

                <div className="mb-3">
                  <label
                    className="block  tracking-wide text-gray-700 text-xl font-normal mb-2"
                    htmlhtmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    type="title"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                    placeholder="Title"
                    onChange={onChange}
                    required
                    minLength={3}
                    maxLength={20}
                    value={formValue.title}
                    name="title"
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="block  tracking-wide text-gray-700 text-xl font-normal mb-2"
                    htmlhtmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    type="text"
                    rows={3}
                    className="form-control block w-full px-4 py-2  text-xl font-normal  text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                    onChange={onChange}
                    required
                    minLength={3}
                    value={formValue.description}
                    name="description"
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="block  tracking-wide text-gray-700 text-xl font-normal mb-2"
                    htmlhtmlFor="amount"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                    placeholder="amount"
                    onChange={onChange}
                    required
                    minLength={1}
                    maxLength={8}
                    value={formValue.amount}
                    name="amount"
                  />
                </div>
                <div
                  className="mb-3"
                  onClick={() => {
                    ref.current.classList.add("blur-md");

                    if (locationToggel) {
                      setLocationToggel(false);
                    } else {
                      setLocationToggel(true);
                    }
                  }}
                >
                  <label
                    className="block  tracking-wide text-gray-700 text-xl font-normal mb-2"
                    htmlhtmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    required
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                    placeholder="Location"
                    readOnly
                    value={LocationValue.locationArea}
                    name="location"
                  />
                </div>

                <button
                  disabled={loading}
                  className="inline-block px-7 sm:py-3 py-2 bg-green-600 text-white my-2  font-medium text-lg leading-snug  rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                >
                  {loading ? "Loading... " : "Post"}
                </button>
              </form>
            </div>
          </div>
        </div>
        {locationToggel && (
          <div className="fixed inset-0 my-9 z-50 overflow-y-auto bg-blend-color-burn">
            <div className="flex min-h-full xl:w-3/6 w-[90%] mx-auto items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="flex  justify-center z-10 m-auto ">
                <div className=" relative md:py-10 lg:px-16 px-6 py-9    bg-white shadow-2xl shadow-current w-full">
                  <div
                    onClick={() => {
                      setLocationToggel(false);
                      ref.current.classList.remove("blur-md");
                    }}
                    className="cursor-pointer text-gray-900 absolute right-0 top-0 px-3 py-2.5"
                  >
                    <svg
                      className="lg:w-4 lg:h-4 w-3 h-3"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25 1L1 25"
                        stroke="currentColor"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M1 1L25 25"
                        stroke="currentColor"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="relative   flex    lg:w-72 xl:w-[40rem] w-[15rem]  justify-center">
                    <div className="flex  absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-8 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="search"
                      name="search"
                      id="topbar-search"
                      className="bg-white border-2 border-slate-800 text-gray-900 sm:text-sm rounded focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 px-3 py-2.5"
                      placeholder="Search area, city or country..."
                      value={queryLocation}
                      onChange={onSearchLocation}
                    />
                  </div>
                  {queryLocation.length == 0 && (
                    <div className="mt-4">
                      <h1 className="text-left mx-1">Location: </h1>
                      <h1 className="text-left text-slate-800 mt-1.5 flex items-center align-middle">
                        <GrLocation className="mx-2 text-lg" />{" "}
                        {LocationValue.locationArea != ""
                          ? LocationValue.locationArea
                          : "No Location"}
                      </h1>
                    </div>
                  )}
                  {queryLocation.length > 2 && (
                    <div className="  top-[3.5rem] z-10 divide-y     rounded-sm overflow-y-auto scroll-smooth max-h-80    lg:w-72 xl:w-[40rem] w-[15rem] duration-500 transition-opacity   delay-150">
                      <div className=" text-base font-semibold text-gray-900 ">
                        {serviceLocation &&
                          serviceLocation.map((key) => {
                            return (
                              <div
                                key={key.id}
                                onClick={() => {
                                  serviceLocationPlaceInfo(key.place_id);
                                  setQueryLocation("");
                                }}
                                className="flex   cursor-pointer hover:bg-slate-100    p-2 text-neutral-900"
                              >
                                <div className="   flex text-center align-middle items-center my-2 px-2 ">
                                  <a className="  flex mr-1 text-green-600 justify-center items-center  focus:text-neutral-900 lg:mt-0">
                                    <i className="text-lg ">
                                      <GrLocation className="text-green-600"></GrLocation>
                                    </i>
                                  </a>
                                </div>
                                <div className="flex flex-col  my-2  ">
                                  <div className="title-font  text-left flex  sm:text-base  text-base font-normal  ">
                                    {key.description}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default createServerPost;
