import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });
import Spinner from "@/components/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { FaFilter } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { useMediaQuery } from "react-responsive";
import { MdOutlineMyLocation } from "react-icons/md";

export default function Home({
  servicesData,
  allservices,
  allservicesNoToken,
  imageList,
  initailState,
  setInitialState,
  setKey,
  setMyLocationArea,
  loading,
  setLoading,
  setServicesData,
  fetchMoreServices,
  setPage,
  totalResults,
  fetchMoreServicesNoToken,
  myUser,
  servicesDataNoAuth,
  setCat,
  cat,
  myLocationArea,
  selectedRadioItems,
  setSelectedRadioItems,
  location,
  tostError,
}) {
  const router = useRouter();
  const ref = useRef();
  let HOST = process.env.NEXT_PUBLIC_HOST;
  const [query, setQuery] = useState("");
  const [queryLocation, setQueryLocation] = useState("");
  const [serviceFilterData, setServiceFilterData] = useState([]);
  const [serviceLocation, setServiceLocation] = useState([]);
  const [categoryFilterData, SetcategoryFilterData] = useState([]);
  const [distanceFilterData, DistanceFilterData] = useState([
    { disatnce: 50 },
    { disatnce: 100 },
    { disatnce: 200 },
    { disatnce: 300 },
    { disatnce: 400 },
    { disatnce: 500 },
    { disatnce: 1000 },
  ]);
  const [toggels, setToggel] = useState(false);
  const [locationToggel, setLocationToggel] = useState(false);
  const [categoryToggel, setCategoryToggel] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [catLocatin, setCatLocation] = useState("");
  const [LocationValue, setLocationValue] = useState({
    myLongitude: "",
    myLatitude: "",
    locationArea: "",
    id: "",
  });
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      // if (location && location.myLatitude && location.myLongitude) {
      setPage(1);
      allservices();
      // }
    } else {
      // if (location && location.myLatitude && location.myLongitude) {
      setPage(1);
      allservicesNoToken();
      // }
    }
  }, [router.query]);
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      serviceFilter();

      if (query.length > 0) {
        ref.current.classList.add("blur-sm");
      } else {
        ref.current.classList.remove("blur-sm");
      }
    } else {
      serviceFilterWithOutAuth();
      if (query.length > 0) {
        ref.current.classList.add("blur-sm");
      } else {
        ref.current.classList.remove("blur-sm");
      }
    }
  }, [query]);
  useEffect(() => {
    serviceLocationHandel();
  }, [queryLocation]);
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      FilterServicesCategories();
    } else {
      FilterServicesCategoriesNoToken();
    }
  }, [router.query]);
  const onSearch = (e) => {
    let getSearchData = e.target.value;
    setQuery(getSearchData);
    if (query > 0) {
      if (getSearchData) {
        let SearchData = servicesData.filter((item) => {
          return JSON.stringify(item)
            .toLowerCase()
            .includes(getSearchData.toLowerCase());
        });
      }
    } else {
      ref.current.classList.remove("blur-sm");
    }
  };
  const onSearchLocation = (e) => {
    let getSearchData = e.target.value;
    setQueryLocation(getSearchData);
  };
  const filterHandel = async () => {
    setServicesData([]);
    setPage(1);
    const uniqueSelectedItems = [...new Set(selectedItems)];
    if (uniqueSelectedItems.length > 0) {
      const cat = uniqueSelectedItems
        .map((item) => `&cat_ids[]=${item}`)
        .join("");
      await setCat(cat);
      ref.current.classList.remove("blur-sm");
      if (localStorage.getItem("authToken")) {
        await allservices();
      } else {
        await allservicesNoToken();
      }
      router.query = "Filter";
    } else if (uniqueSelectedItems.length == 0) {
      ref.current.classList.remove("blur-sm");
      setSelectedItems([]);
      setSelectedRadioItems("1000");
      setCat("");
      setToggel(false);
      setCategoryToggel(false);

      if (localStorage.getItem("authToken")) {
        allservices();
      } else {
        allservicesNoToken();
      }
      router.query = "removeFilter";
    }
  };
  let serviceFilter = async () => {
    if (localStorage.getItem("authToken")) {
      axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});
      if (query.length > 0) {
        let url = `${HOST}/api/service-search?&type=${initailState}&search=${query}`;

        let params = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        };

        let res = await axios(url, params);
        let data = await res.data;

        setServiceFilterData(data);
      } else {
        setServiceFilterData([]);
      }
    }
  };
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

      localStorage.setItem("lat", data.geometry.location.lat);
      localStorage.setItem("lng", data.geometry.location.lng);
      localStorage.setItem("locationArea", data.formatted_address);

      setCatLocation(
        `&latitude=${JSON.stringify(
          data.geometry.location.lat
        )}&longitude=${JSON.stringify(data.geometry.location.lng)}`
      );
      ref.current.classList.remove("blur-sm");
      setLocationToggel(false);

      if (localStorage.getItem("authToken")) {
        setPage(1);
        await allservices();
      } else {
        setPage(1);
        await allservicesNoToken();
      }
    } catch (err) {
      console.log(err);
    }
  };
  let serviceFilterWithOutAuth = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});
    if (query.length > 0) {
      let url = `${HOST}/api/service-search-without-auth?&type=${initailState}&search=${query}`;

      let params = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let res = await axios.get(url, params);
      let data = await res.data;
      setServiceFilterData(data);
    } else {
      setServiceFilterData([]);
    }
  };
  let FilterServicesCategories = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });
    setLoading(true);

    let url = `${HOST}/api/categories-show`;
    let params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    };

    let res = await axios(url, params);
    let data = await res.data;

    SetcategoryFilterData(data.data);
    setLoading(false);
  };
  let FilterServicesCategoriesNoToken = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });
    setLoading(true);

    let url = `${HOST}/api/categories-without-auth`;
    let params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let res = await axios(url, params);
    let data = await res.data;

    SetcategoryFilterData(data.data);
    setLoading(false);
  };
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    setSelectedItems((prevSelectedItems) => {
      if (isChecked && !prevSelectedItems.includes(value)) {
        return [...prevSelectedItems, value];
      } else if (!isChecked && prevSelectedItems.includes(value)) {
        return prevSelectedItems.filter((item) => item !== value);
      } else {
        return prevSelectedItems;
      }
    });
  };
  const handleRadioChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedRadioItems(value);
    }
  };
  const isSmallDevice = useMediaQuery({ maxWidth: 639 });
  console.log(selectedItems);
  return (
    <>
      <Head>
        <title>BizHub</title>
        <meta name="description" content="Bizhub" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        onClick={() => setQuery("")}
        className="min-h-screen max-w-6xl mx-auto "
      >
        <div >
          <div className=" w-full pt-8 pb-2 md:px-3  ">
            <div className=" mx-auto">
              <div className="flex justify-between flex-wrap mx-1 sm:pb-0  pb-2 px-1  items-center align-middle cursor-pointer">
                {initailState ? (
                  <div
                    disabled={loading}
                    onClick={() => {
                      setTimeout(() => {
                        router.query = 0;
                        setInitialState(0);
                      }, 1000);
                    }}
                    className="  px-3 py-2  text-center bg-blend-saturation text-white  z-10 font-medium  lg:w-15 xl:w-[13rem] w-[11rem] border-2 rounded-md bg-green-600 uppercase border-slate-900 "
                  >
                    Job near by
                  </div>
                ) : (
                  <div
                    disabled={loading}
                    onClick={() => {
                      setTimeout(() => {
                        router.query = 1;
                        setInitialState(1);
                      }, 1000);
                    }}
                    className="  px-3 py-2  text-center bg-blend-saturation text-white  z-10  font-medium lg:w-15 xl:w-[13rem] w-[11rem] border-2 rounded-md bg-green-600 uppercase border-slate-900 "
                  >
                    Services near by
                  </div>
                )}
                <div className="text-center  sm:mt-0   flex   font-serif uppercase  text-green-600     ">
                  <button
                    className="py-3 bg-white border-green-600 border-2 font-bold px-4 rounded "
                    onClick={() => {
                      ref.current.classList.add("blur-sm");
                      setLocationToggel(true);
                    }}
                  >
                    <MdOutlineMyLocation></MdOutlineMyLocation>
                  </button>
                </div>
              </div>
              <div className=" flex justify-between flex-wrap sm:mt-5 mt-3 mx-1  sm:pb-0  pb-2 px-1  items-center align-middle">
                <div className="   lg:pb-0  relative sm:mb-0 ">
                  <div className="relative   flex    lg:w-80 xl:w-[53rem] w-[15.8rem]  justify-center">
                    <div className="flex  absolute inset-y-0 left-2 items-center pl-2 pointer-events-none">
                      <svg
                        className="w-5 h-8 text-gray-600 "
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
                      className="outline-none  border-2 border-slate-900 focus:border-none text-gray-800 sm:text-sm rounded-md focus:ring-green-500 focus:ring-2 block w-full pl-10 px-3 py-2 md:py-2.5"
                      placeholder="Search..."
                      value={query}
                      onChange={onSearch}
                    />
                  </div>
                  {query && (
                    <div className=" absolute top-[3.5rem] z-10 divide-y  shadow-2xl   rounded-sm overflow-y-auto scroll-smooth max-h-80    lg:w-80 xl:w-[53rem] w-[15.8rem]  duration-500 transition-opacity   delay-150">
                      <div className=" text-base font-semibold text-gray-900 ">
                        {serviceFilterData &&
                          serviceFilterData.map((key) => {
                            return (
                              <Link
                                href={`/postDetail/${key.id}`}
                                className="flex   bg-white cursor-pointer hover:bg-slate-100    p-2 text-neutral-900"
                              >
                                <div className="   flex text-center align-middle items-center my-2 px-2 ">
                                  <a className="  flex mr-1 m-auto justify-center items-center  focus:text-neutral-900  lg:mt-0">
                                    {!key.images[0] ? (
                                      <Image
                                        height={2}
                                        width={2}
                                        src={
                                          "https://images.olx.com.pk/thumbnails/347296539-240x180.webp"
                                        }
                                        style={{
                                          height: "45px",
                                          width: "45px",
                                        }}
                                        className=" rounded-3xl"
                                        alt="Bizhub"
                                      />
                                    ) : (
                                      <Image
                                        height={2}
                                        width={2}
                                        src={
                                          !key.images[0]
                                            ? "https://images.olx.com.pk/thumbnails/347296539-240x180.webp"
                                            : HOST + key.images[0].image
                                        }
                                        style={{
                                          height: "45px",
                                          width: "45px",
                                        }}
                                        className=" rounded-3xl"
                                        alt="Bizhub"
                                      />
                                    )}
                                  </a>
                                </div>
                                <div className="flex flex-col align-middle my-2  ">
                                  <div className="title-font  uppercase flex  sm:text-base  text-sm font-medium  ">
                                    {key.title.slice(0, 20)}
                                    {key.title.length > 20 ? "..." : ""}
                                  </div>
                                  <div className="title-font    my-[0.120rem]     flex   text-base font-medium  ">
                                    <sapn className="text-green-600 ">
                                      $ {key.amount}
                                    </sapn>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center  sm:mt-0   flex   font-serif uppercase  text-green-600     ">
                  <button
                    className="py-3 bg-white border-green-600 border-2 rounded  font-bold px-4"
                    onClick={() => {
                      ref.current.classList.add("blur-sm");
                      setCategoryToggel(true);
                    }}
                  >
                    <FaFilter></FaFilter>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="  py-2 px-1.5  ">
            <div className="md:my-12 my-8" ref={ref}>
              {loading ? (
                ""
              ) : (
                <div className="flex justify-center mx-auto ">
                  {!myUser.token &&
                    servicesDataNoAuth &&
                    servicesDataNoAuth &&
                    servicesDataNoAuth.length == 0 &&
                    "No Post Available"}
                </div>
              )}
              {loading ? (
                ""
              ) : (
                <div className="flex justify-center mx-auto text-center w-70">
                  {myUser.token &&
                    servicesData &&
                    servicesData &&
                    servicesData.length == 0 &&
                    "No Post Available"}
                </div>
              )}
              {loading ? (
                <div className="flex justify-center  ">
                  <span className="flex justify-center  absolute  top-64">
                    <Spinner></Spinner>
                  </span>
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={
                    !myUser.token
                      ? servicesDataNoAuth.length
                      : servicesData.length
                  }
                  next={
                    !myUser.token ? fetchMoreServicesNoToken : fetchMoreServices
                  }
                  hasMore={totalResults == null ? false : true}
                  loader={
                    <span className=" w-80 mx-auto flex justify-center">
                      <Spinner></Spinner>
                    </span>
                  }
                >
                  {myUser.token && (
                    <div className="flex flex-wrap  justify-center ">
                      {servicesData &&
                        servicesData.map((key, index) => {
                          return (
                            <div
                              key={index}
                              className="w-[50%] md:w-[17.5rem]  "
                            >
                              <Link href={`/postDetail/${key.id}`}>
                                <div className=" relative rounded-lg shadow-lg hover:shadow-xl cursor-pointer overflow-hidden my-2 md:mx-3 mx-1.5">
                                  <div className=" relative  ">
                                    <div className="flex justify-center relative opacity-100 object-contain bottom-0 transition-opacity duration-700 hover:opacity-100 overflow-hidden w-full ">
                                      {!key.images[0] ? (
                                        <Image
                                          width={2}
                                          height={2}
                                          className="h-36 md:h-48 max-w-none  rounded-t-lg object-contain   p-4 -z-10  w-full bg-black   "
                                          src={`${"/images/bizhub_logo.png"}`}
                                          alt="Bizhub"
                                        />
                                      ) : (
                                        <Image
                                          width={2}
                                          height={2}
                                          className="h-36 md:h-48 max-w-none object-cover w-full  "
                                          src={`${
                                            !key.images[0]
                                              ? "https://images.olx.com.pk/thumbnails/347296539-240x180.webp"
                                              : HOST + key.images[0].image
                                          }`}
                                          alt="Bizhub"
                                        />
                                      )}
                                      {key.thumbs_up == 1 && (
                                        <div className="flex justify-end    absolute bottom-3 left-2">
                                          <span className=" text-center sm:text-end block  text-xs  text-slate-100 font-normal ">
                                            <span className="font-medium  text-xs  uppercase py-1 px-2 tracking-wide rounded-sm text-center bg-green-600">
                                              featured
                                            </span>{" "}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="py-2 md:px-3 px-2 border-green-600 border-l-8 rounded-b-lg">
                                    <h5 className="mb-4 md:text-xl text-base md:font-semibold font-medium tracking-tight md:h-14 h-[2.7rem] text-gray-900">
                                      {key.title.slice(0, 20)}
                                      {key.title.length > 20 ? "..." : ""}
                                    </h5>

                                    <div className="flex md:my-2 my-1 align-middle items-center">
                                      <div className="tracking-tight text-slate-800 text-center  align-middle md:text-xl text-base  font-medium md:font-bold title-font">
                                        ${key.amount}
                                      </div>
                                      <div className="text-xs  text-gray-500 ml-auto text-center font-medium title-font ">
                                        {new Date(
                                          key.created_at
                                        ).toLocaleDateString("PK-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {!myUser.token && (
                    <div className="flex flex-wrap justify-center">
                      {servicesDataNoAuth &&
                        servicesDataNoAuth.map((key, index) => {
                          return (
                            <div
                              key={index}
                              className="w-[50%] md:w-[17.5rem]  "
                            >
                              <Link href={`/postDetail/${key.id}`}>
                                <div className=" relative rounded-lg shadow-lg hover:shadow-xl cursor-pointer overflow-hidden my-2 md:mx-3 mx-1.5">
                                  <div className=" relative  ">
                                    <div className="flex justify-center opacity-100 object-contain bottom-0 transition-opacity duration-700 hover:opacity-100 overflow-hidden w-full ">
                                      {!key.images[0] ? (
                                        <Image
                                          height={2}
                                          width={2}
                                          className="h-44 md:h-48  max-w-none  rounded-t-lg object-contain   p-4 -z-10  w-full bg-black   "
                                          src={`${"/images/bizhub_logo.png"}`}
                                          alt="Bizhub"
                                        />
                                      ) : (
                                        <Image
                                          height={2}
                                          width={2}
                                          className="h-44 md:h-48  max-w-none object-cover w-full  "
                                          src={`${
                                            !key.images[0]
                                              ? "https://images.olx.com.pk/thumbnails/347296539-240x180.webp"
                                              : HOST + key.images[0].image
                                          }`}
                                          alt="Bizhub"
                                        />
                                      )}
                                    </div>
                                    {key.thumbs_up == 1 && (
                                      <div className="flex justify-end    absolute bottom-3 left-2">
                                        <span className=" text-center sm:text-end block  text-xs  text-slate-100 font-normal ">
                                          <span className="font-medium  text-xs  uppercase py-1 px-2 tracking-wide rounded-sm text-center bg-green-600">
                                            featured
                                          </span>{" "}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="py-2 md:px-3 px-2  border-green-600 border-l-8 rounded-b-lg">
                                    <h5 className="mb-4 md:text-xl text-base md:font-semibold font-medium tracking-tight md:h-14 h-[2.7rem] text-gray-900">
                                      {key.title.slice(0, 20)}
                                      {key.title.length > 20 ? "..." : ""}
                                    </h5>
                                    <div className="flex md:my-2 my-1   align-middle items-center">
                                      <sapn className="tracking-tight text-slate-800 text-center  align-middle md:text-xl text-base  font-medium md:font-bold title-font">
                                        ${key.amount}
                                      </sapn>
                                      <sapn className="text-xs  text-gray-500 ml-auto text-center font-medium title-font ">
                                        {new Date(
                                          key.created_at
                                        ).toLocaleDateString("PK-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </sapn>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
        {categoryToggel && (
          <div class="fixed top-0 left-0 right-0 z-50    bg-white/60 filter bg-blend-color-burn w-full p-6 overflow-hidden  md:inset-0  ">
            <div class="relative w-full max-w-2xl  mx-auto   justify-center  ">
              <div className="flex  justify-center mx-auto min-h-screen  items-center  ">
                <div className=" relative md:py-10 lg:px-16 md:px-6 py-9 px-6   bg-white  rounded-xl shadow-2xl shadow-current w-full">
                  <div
                    onClick={() => {
                      setCategoryToggel(false);
                      ref.current.classList.remove("blur-sm");
                    }}
                    className="cursor-pointer text-gray-900 absolute right-0 top-0 md:py-5 lg:px-5 md:px-2 py-6 px-4"
                  >
                    <svg
                      className="lg:w-5 lg:h-5 w-4 h-4  "
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

                  <div>
                    <div className="flex space-x-2 text-2xl  font-bold text-gray-900  ">
                      <span>Category</span>
                    </div>
                    <div className="md:flex  mt-8 grid grid-cols-2 gap-y-8 flex-wrap">
                      {categoryFilterData &&
                        categoryFilterData.map((key) => {
                          return (
                            <div className="flex md:justify-center md:items-center items-center mx-1 justify-start">
                              <input
                                className="w-5 h-5 mr-2 accent-green-600 "
                                type="checkbox"
                                id="black"
                                name="color"
                                value={JSON.stringify(key.id)}
                                checked={selectedItems.includes(
                                  JSON.stringify(key.id)
                                )}
                                onChange={handleCheckboxChange}
                              />
                              <div className="inline-block">
                                <div className="flex space-x-6 justify-center items-center">
                                  <label
                                    className="mr-2 text-sm text-left leading-3 font-normal text-black"
                                    htmlFor="checkbox"
                                  >
                                    {key.title}
                                  </label>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="flex mt-10 mb-2  md:flex-row flex-col justify-between ">
                    {selectedItems.length !== 0 && (
                      <div className="block md:w-1/3  ">
                        <button
                          onClick={async () => {
                            if (selectedItems.length !== 0) {
                              await filterHandel();
                              setToggel(false);
                              setCategoryToggel(false);
                              if (localStorage.getItem("authToken")) {
                                await allservices();
                              } else {
                                await allservicesNoToken();
                              }
                            }
                            router.query = "filter";
                          }}
                          className="w-full hover:bg-green-700 rounded-md  text-base leading-4 font-medium py-3 px-5 text-white bg-green-600"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {cat && (
                      <div className="block md:w-1/3 sm:mt-0 mt-2">
                        <button
                          onClick={async () => {
                            ref.current.classList.remove("blur-sm");
                            setSelectedItems([]);

                            setCat("");
                            setToggel(false);
                            setCategoryToggel(false);
                            router.query = "removeFilter";
                          }}
                          className="w-full hover:bg-red-700 rounded-md text-base  leading-4 font-medium py-3 px-5 text-white bg-red-600"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {locationToggel && (
          <div class="fixed top-0 left-0 right-0 z-50    bg-white/60 filter bg-blend-color-burn w-full p-6  overflow-hidden  md:inset-0 ">
            <div class="relative w-full max-w-2xl  mx-auto   justify-center  ">
              <div className="flex w-full justify-center mx-auto min-h-screen    items-center  ">
                <div className=" relative md:py-10 lg:px-16 md:px-6 py-9 px-6  mx-auto bg-white  rounded-xl shadow-2xl shadow-current w-full ">
                  <div
                    onClick={() => {
                      setLocationToggel(false);
                      ref.current.classList.remove("blur-sm");
                    }}
                    className="cursor-pointer text-gray-900  absolute right-0 top-0 px-4 py-4 mb-2"
                  >
                    <svg
                      className="lg:w-5 lg:h-5 w-4 h-4"
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
                  <div className="relative   flex   mt-4  justify-center">
                    <div className="flex  absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-8 text-gray-600 "
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
                      className="bg-white border focus:right-2 focus:ring-slate-900 text-gray-900 sm:text-sm rounded block w-full pl-10 px-3 py-2.5"
                      placeholder="Search area, city or country..."
                      value={queryLocation}
                      onChange={onSearchLocation}
                    />
                  </div>
                  {queryLocation.length == 0 && (
                    <div className="mt-4">
                      <h1 className="text-left mx-1">Show Service At: </h1>
                      <h1 className="text-left text-slate-800 mt-1.5 flex items-center align-middle">
                        <GrLocation className="mx-2 text-lg" />{" "}
                        {LocationValue.locationArea != ""
                          ? LocationValue.locationArea
                          : myLocationArea == ""
                          ? "No Location"
                          : myLocationArea}
                      </h1>
                    </div>
                  )}
                  {queryLocation.length > 2 && (
                    <div className="  top-[3.5rem] z-10 divide-y     rounded-sm overflow-y-auto scroll-smooth max-h-80     duration-500 transition-opacity   delay-150">
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
                  <div className="flex md:flex-row flex-col mt-10  justify-end">
                    {localStorage.getItem("locationArea") && (
                      <div className="block md:w-1/4 md:mt-0 mt-2 mx-1">
                        <button
                          onClick={async () => {
                            localStorage.removeItem("lat");
                            localStorage.removeItem("lng");
                            localStorage.removeItem(
                              "locationArea",
                              location.locationArea
                            );
                            setMyLocationArea("");
                            setLocationValue({
                              locationArea: "",
                            });
                            ref.current.classList.remove("blur-sm");
                            setLocationToggel(false);
                            if (myUser.token) {
                              setPage(1);
                              await allservices();
                            } else {
                              setPage(1);
                              await allservicesNoToken();
                            }
                          }}
                          className="w-full hover:bg-red-600  focus:ring-2  focus:ring-red-500 text-base leading-4 font-medium py-3 px-6 rounded-md text-white bg-red-700"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      ;
    </>
  );
}
