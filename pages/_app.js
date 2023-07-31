import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { Suspense, useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { deleteCookie, setCookie } from "cookies-next";
import LoadingBar from "react-top-loading-bar";
import Previous from "@/components/Previous";
import { Elsie } from "next/font/google";
import LazyLoad from "react-lazyload";
import React from "react";
("use strict");
export default function App({ Component, pageProps }) {
  const [progress, setProgress] = useState(0);
  const [nav, setNav] = useState(true);
  const [footer, setFoot] = useState(true);
  const [top, setTop] = useState(false);
  const [pre, setPre] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let page = ["/"];
    if (page.includes(router.pathname)) {
      setNav(true);
      setTop(false);
      setPre(false);
    } else {
      setPre(true);
      setNav(false);
      setTop(true);
    }
    router.events.on("routeChangeStart", () => {
      setProgress(60);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
  });
  useEffect(() => {
    let page = ["/", "/message"];
    if (page.includes(router.pathname)) {
      setPre(false);
    } else {
      setPre(true);
    }
  });
  useEffect(() => {
    let page = ["/message"];
    if (page.includes(router.pathname)) {
      setFoot(false);
    } else {
      setFoot(true);
    }
  });

  let HOST = process.env.NEXT_PUBLIC_HOST;

  const [key, setKey] = useState();
  const [myUser, setMyUser] = useState({
    token: "",
    image: "",
    firstName: "",
    lastName: "",
  });
  const [userData, setuserData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [servicesDataNoAuth, setServicesDataNoAuth] = useState([]);
  const [servicesFilterData, setServicesFilterData] = useState([]);
  const [avalibalServicesCategories, setAvalibalServicesCategories] =
    useState();
  const [initailState, setInitialState] = useState(0);
  const [myAllServices, setMyAllServices] = useState([]);
  const [myAllJob, setMyAllJob] = useState([]);
  const [location, setLocation] = useState({
    myAddress: "",
    myLatitude: "",
    myLongitude: "",
  });
  const [myLatitude, setmyLatitude] = useState("");
  const [myLongitude, setmyLongitude] = useState("");
  const [myLocationArea, setMyLocationArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setResults] = useState(null);
  const [cat, setCat] = useState("");
  const [selectedRadioItems, setSelectedRadioItems] = useState("1000");
  const [state, setState] = useState(true);
  const load = React.lazy(() => import("@/pages/index"));
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const image = localStorage.getItem("image");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const lat = localStorage.getItem("lat");
    const lng = localStorage.getItem("lng");
    const locationArea = localStorage.getItem("locationArea");
    if (lat != null) {
      setmyLatitude(lat);
      setKey(Math.random());
    }

    if (lng != null) {
      setmyLongitude(lng);
      setKey(Math.random());
    }
    if (locationArea != null) {
      setMyLocationArea(locationArea);
      setKey(Math.random());
    }
    if (token) {
      setMyUser({ token: token });
      setCookie("authToken", token);
      setKey(Math.random());
    }
    if (image) {
      setMyUser({ image: image, token: token });
    }
    if (firstName) {
      setMyUser({ image: image, token: token, firstName: firstName });
    }
    if (lastName) {
      setMyUser({
        image: image,
        token: token,
        firstName: firstName,
        lastName: lastName,
      });
      setKey(Math.random());
    }
  }, [router.query]);

  // Without Token
  let allservicesNoToken = async () => {
    let myLatitude = localStorage.getItem("lat");
    let myLongitude = localStorage.getItem("lng");
    setServicesDataNoAuth([]);
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});
    setLoading(true);
    if (myLatitude && myLongitude) {
      let url = `${HOST}/api/all-services?page=${1}&type=${initailState}${cat}&latitude=${myLatitude}&longitude=${myLongitude}&distance=1000`;

      let params = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let res = await axios(url, params);
      let data = await res.data;

      setResults(data.next_page_url);
      setServicesDataNoAuth(data.data);
      setServicesFilterData(data.data);

      setLoading(false);
    } else {
      let url = `${HOST}/api/all-services?page=${1}&type=${initailState}${cat}`;

      let params = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let res = await axios(url, params);
      let data = await res.data;

      setResults(data.next_page_url);
      setServicesDataNoAuth(data.data);
      setServicesFilterData(data.data);

      setLoading(false);
    }
  };

  // Without Token More
  const fetchMoreServicesNoToken = async () => {
    let myLatitude = localStorage.getItem("lat");
    let myLongitude = localStorage.getItem("lng");
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });
    if (myLatitude && myLongitude) {
      let url = `${HOST}/api/all-services?page=${
        page + 1
      }&type=${initailState}${cat}&latitude=${myLatitude}&longitude=${myLongitude}&distance=1000`;
      setPage(page + 1);

      let params = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let res = await axios(url, params);
      let data = await res.data;

      setResults(data.next_page_url);

      setServicesDataNoAuth(servicesDataNoAuth.concat(data.data));
    } else {
      let url = `${HOST}/api/all-services?page=${
        page + 1
      }&type=${initailState}${cat} `;
      setPage(page + 1);

      let params = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let res = await axios(url, params);
      let data = await res.data;

      setResults(data.next_page_url);

      setServicesDataNoAuth(servicesDataNoAuth.concat(data.data));
    }
  };

  // With Token
  let allservices = async () => {
    let myLatitude = localStorage.getItem("lat");
    let myLongitude = localStorage.getItem("lng");

    setServicesData([]);

    setLoading(true);
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });
    if (myLatitude && myLongitude) {
      let url = `${HOST}/api/service?page=${1}&type=${initailState}${cat}&latitude=${myLatitude}&longitude=${myLongitude}&distance=1000`;

      let params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      };
      let res = await axios(url, params);
      let data = await res.data;

      setResults(data.next_page_url);
      setServicesData(data.data);
      setServicesFilterData(data.data);
      setLoading(false);
    } else {
      let url = `${HOST}/api/service?page=${1}&type=${initailState}${cat}`;

      let params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      };
      let res = await axios(url, params);
      let data = await res.data;

      setResults(data.next_page_url);
      setServicesData(data.data);
      setServicesFilterData(data.data);
      setLoading(false);
    }
  };

  // With Token more
  const fetchMoreServices = async () => {
    let myLatitude = localStorage.getItem("lat");
    let myLongitude = localStorage.getItem("lng");
    if (myLatitude && myLongitude) {
      if (myUser.token) {
        axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});

        let url = `${HOST}/api/service?page=${
          page + 1
        }&type=${initailState}${cat}&latitude=${myLatitude}&longitude=${myLongitude}&distance=1000`;
        setPage(page + 1);

        let params = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        };
        let res = await axios(url, params);
        let data = await res.data;
        setResults(data.next_page_url);
        let merge = [...servicesData, ...data.data];
        setServicesData(merge);
        setServicesFilterData(merge);
      }
    } else {
      if (myUser.token) {
        axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {});

        let url = `${HOST}/api/service?page=${
          page + 1
        }&type=${initailState}${cat}`;
        setPage(page + 1);

        let params = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        };
        let res = await axios(url, params);
        let data = await res.data;
        setResults(data.next_page_url);
        let merge = [...servicesData, ...data.data];
        setServicesData(merge);
        setServicesFilterData(merge);
      }
    }
  };
  //  &latitude=${latitude}&longitude=${longitude}&distance=${selectedRadioItems}
  let servicesCategories = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });

    let url = `${HOST}/api/categories-show`;
    setLoading(true);
    let params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    };

    let res = await axios(url, params);
    let data = await res.data;

    setAvalibalServicesCategories(data.data);
    setLoading(false);
  };
  let myJob = async () => {
    setLoading(true);
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });

    let url = `${HOST}/api/my-services`;
    let params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    };

    let res = await axios(url, params);
    let data = await res.data;

    setMyAllJob(data.data);
    setLoading(false);
  };
  let myServices = async () => {
    setLoading(true);
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });

    let url = `${HOST}/api/my-worker-services`;
    let params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    };

    let res = await axios(url, params);
    let data = await res.data;

    setMyAllServices(data.data);
    setLoading(false);
  };

  const apiKey = "AIzaSyB7Ng7-HV7vIkFSF9XEThw_O2PSo_196zw";

  let gooogle = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`
      );
      const data = await response.json();

      setLocation({
        myAddress: data.results[0] && data.results[0].formatted_address,
        myLatitude: "27.717459",
        myLongitude: "-81.611209",
        // myLatitude: position.coords && position.coords.latitude,
        // myLongitude: position.coords && position.coords.longitude,
      });
    });
  };

  const handelGetUser = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
      // console.log(response);
    });

    try {
      setLoading(true);
      let url = `${HOST}/api/show-user`;
      let res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let result = await res.data;
      setuserData(result.data);
      setLoading(false);
    } catch (error) {
      tostError(error);
      setLoading(false);
    }
  };

  const logout = (e) => {
    deleteCookie("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("image");
    localStorage.removeItem("authToken");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("phone");
    setMyUser({ token: "" });
    setKey(Math.random());
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  let tostSuccess = (value) => {
    toast.success(value, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  let tostError = (value) => {
    toast.error(value, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      <LoadingBar
        color="green"
        height={3}
        progress={progress}
        waitingTime={100}
        onLoaderFinished={() => setProgress(0)}
      />
      {top && <Topbar></Topbar>}
      {pre && <Previous loading={loading} setLoading={setLoading}></Previous>}
   
        {nav && <Navbar myUser={myUser} key={key} logout={logout}></Navbar>}


      <Component
        loading={loading}
        setLoading={setLoading}
        setState={setState}
        state={state}
        myUser={myUser}
        setCat={setCat}
        cat={cat}
        setSelectedRadioItems={setSelectedRadioItems}
        selectedRadioItems={selectedRadioItems}
        handelGetUser={handelGetUser}
        userData={userData}
        setKey={setKey}
        setMyLocationArea={setMyLocationArea}
        myLatitude={myLatitude}
        myLongitude={myLongitude}
        servicesData={servicesData}
        servicesDataNoAuth={servicesDataNoAuth}
        servicesFilterData={servicesFilterData}
        setServicesData={setServicesData}
        setServicesFilterData={servicesFilterData}
        fetchMoreServices={fetchMoreServices}
        fetchMoreServicesNoToken={fetchMoreServicesNoToken}
        setPage={setPage}
        servicesCategories={servicesCategories}
        avalibalServicesCategories={avalibalServicesCategories}
        totalResults={totalResults}
        location={location}
        myLocationArea={myLocationArea}
        myAllJob={myAllJob}
        myAllServices={myAllServices}
        allservices={allservices}
        allservicesNoToken={allservicesNoToken}
        myJob={myJob}
        myServices={myServices}
        gooogle={gooogle}
        tostSuccess={tostSuccess}
        initailState={initailState}
        setInitialState={setInitialState}
        tostError={tostError}
        {...pageProps}
      />
      {footer && <Footer></Footer>}
    </>
  );
}
