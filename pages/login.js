import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { MdAlternateEmail, MdPassword } from "react-icons/md";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { setCookie } from "cookies-next";

function login({ tostError, tostSuccess, allservices }) {
  let router = useRouter();
  const [showPassword, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(false);
  const [formValue, setFormValue] = useState({
    device_id: "1234",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      router.push("/");
    }
  }, []);

  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };
  const handel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_HOST}/sanctum/csrf-cookie`)
        .then((response) => {});
      let url = `${process.env.NEXT_PUBLIC_HOST}/api/login`;
      let param = {
        email: formValue.email,
        password: formValue.password,
        device_id: "5415",
      };

      let res = await axios.post(url, param);
      let result = await res.data;

      if (result.status) {
        localStorage.setItem("authToken", result.data.token);
        setCookie("authToken", result.data.token);
        if (
          result.data.user.first_name != null ||
          result.data.user.lastname != null
        ) {
          localStorage.setItem("firstName", result.data.user.first_name);
          localStorage.setItem("lastName", result.data.user.last_name);
        }
        localStorage.setItem("email", result.data.user.email);
        localStorage.setItem("phone", result.data.user.phone);
        if (result.data.user.image != null) {
          localStorage.setItem("image", result.data.user.image);
        }
        tostSuccess(result.message);

        setTimeout(() => {
          router.push("/");
          setFormValue({ password: "", email: "" });
        }, 1000);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      tostError(error.response.data.message);
    }
  };
  return (
    <>
      <section className="mt-16 min-h-screen">
        <div className="px-4 py-5">
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
          <div className="flex justify-center items-center flex-wrap h-full  text-gray-800">
            <div className="sm:w-5/6 w-full md:w-1/2 lg:w-1/3 m-auto p-3  md:p-6 rounded-md shadow-xl">
              <h1 className="mb-7 mt-4 text-center text-2xl uppercase sm:text-3xl  font-semibold   text-slate-700">
                {" "}
                Welcome to Bizhub
                <span>
                  {" "}
                  <a className="text-slate-700 mt-0.5 lowercase sm:text-lg justify-center font-normal flex flex-col text-base ">
                    Sign in to continue
                  </a>
                </span>
              </h1>

              <form onSubmit={handel}>
                <div className="mb-3">
                  <div className="relative  ">
                    <div className="text-white   absolute inline-block left-2.5 bottom-3 ">
                      <i className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer">
                        <MdAlternateEmail className="text-green-600 "></MdAlternateEmail>
                      </i>
                    </div>
                    <input
                      required
                      minLength={4}
                      maxLength={50}
                      type="email"
                      className="form-control block w-full px-9 py-2 md:text-lg text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="Email Address"
                      onChange={onChange}
                      value={formValue.email}
                      name="email"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="relative flex align-middle items-center ">
                    <div className="text-white  absolute inline-block left-2.5 bottom-3 ">
                      <i className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1  cursor-pointer">
                        <MdPassword className="text-green-600 hover:text-green-900"></MdPassword>
                      </i>
                    </div>
                    <input
                      required
                      minLength={6}
                      maxLength={50}
                      type={showPassword}
                      className="form-control block w-full py-2 md:text-lg  px-9 text-base  font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="Password"
                      onChange={onChange}
                      value={formValue.password}
                      name="password"
                    />
                    <div className="text-white  absolute inline-block right-2.5 bottom-3 ">
                      {pass ? (
                        <div className="">
                          <i
                            onClick={() => {
                              setPassword("password");
                              setPass(false);
                            }}
                            className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer"
                          >
                            <ImEye className=" text-green-600 "></ImEye>
                          </i>
                        </div>
                      ) : (
                        <div className="">
                          <i
                            onClick={() => {
                              setPassword("text");
                              setPass(true);
                            }}
                            className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer"
                          >
                            <ImEyeBlocked className="text-green-600"></ImEyeBlocked>
                          </i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center mb-1 mt-1">
                  <Link href={"/forgotPassword"}>
                    <div className="text-green-500 font-normal hover:text-green-600 focus:text-green-600 active:text-green-800 duration-200 transition ease-in-out">
                      Forgot password ?
                    </div>
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-block px-7 sm:py-2.5 py-2 bg-green-600 text-white my-2  font-medium text-lg leading-snug  rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                >
                  {loading ? "Loading... " : "Sign in"}
                </button>
                <h1 className="mt-4 mb-2 text-center text-sm  sm:text-lg  font-normal   text-slate-700">
                  Don't have an account?
                  <Link
                    href={"/signup"}
                    className="text-green-500 mx-1.5 font-normal "
                  >
                    Sign up!
                  </Link>
                </h1>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default login;
