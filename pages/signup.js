import React, { useEffect } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MdAlternateEmail, MdPassword } from "react-icons/md";
import { AiOutlinePhone } from "react-icons/ai";
import { ImEye, ImEyeBlocked } from "react-icons/im";

function signup({ tostError, tostSuccess }) {
  let HOST = process.env.NEXT_PUBLIC_HOST;
  const [showPassword, setPassword] = useState("password");
  const [pass, setPass] = useState(false);
  const [loading, setLoading] = useState(false);

  let router = useRouter();
  const [FormValue, setFormValue] = useState({
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router.query]);

  let onChange = (e) => {
    setFormValue({ ...FormValue, [e.target.name]: e.target.value });
  };
  const handel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = `${HOST}/api/register-from-web`;
      let param = {
        email: FormValue.email,
        phone: FormValue.phone,
        password: FormValue.password,
        password_confirmation: FormValue.password_confirmation,
      };
      let res = await axios.post(url, param);
      let data = await res.data;

      if (data.status) {
        tostSuccess(data.message);
        localStorage.setItem("uniqueId", data.data.uniqueId);
        setFormValue({
          email: "",
          phone: "",
          password: "",
          password_confirmation: "",
        });
console.log(data.data);
        if (data.data.uniqueId) {
          setTimeout(() => {
            router.push("/otp");
          }, 1000);
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      tostError(err.response.data.message);
    }
  };
  return (
    <>
      <section className=" mt-20 min-h-screen">
        <div className="px-4 py-5 items-center">
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
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800 ">
            <div className="sm:w-5/6 md:w-1/2 lg:w-1/3 m-auto p-10 rounded-md shadow-xl">
              <h1 className="mb-6 mt-4 text-center text-2xl uppercase sm:text-3xl  font-semibold   text-slate-700">
                {" "}
                welcome to Bizhub
                <span>
                  {" "}
                  <Link
                    href={"/signup"}
                    className="text-slate-700 mt-1 lowercase sm:text-lg justify-center font-normal flex flex-col text-base "
                  ></Link>
                </span>
              </h1>

              <form onSubmit={handel}>
                <div className="mb-4">
                  <div className="relative  ">
                    <div className="text-white   absolute inline-block left-2.5 bottom-3 ">
                      <i className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer">
                        <MdAlternateEmail className="text-green-600 "></MdAlternateEmail>
                      </i>
                    </div>
                    <input
                      type="email"
                      required
                      minLength={5}
                      maxLength={50}
                      className="form-control block w-full px-9 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="Email"
                      onChange={onChange}
                      value={FormValue.email}
                      name="email"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="relative flex items-center align-middle ">
                    <div className="text-white   absolute inline-block left-2.5 bottom-3 ">
                      <i className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer">
                        <AiOutlinePhone className="text-green-600 hover:text-green-900"></AiOutlinePhone>
                      </i>
                    </div>
                    <input
                      type="phone"
                      required
                      minLength={10}
                      maxLength={15}
                      className="form-control block w-full px-9 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="Phone"
                      onChange={onChange}
                      value={FormValue.phone}
                      name="phone"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="relative flex items-center align-middle  ">
                    <div className="text-white   absolute inline-block left-2.5 bottom-3 ">
                      <i className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer">
                        <MdPassword className="text-green-600 hover:text-green-900"></MdPassword>
                      </i>
                    </div>
                    <input
                      type={showPassword}
                      className="form-control block w-full px-9 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="Password"
                      onChange={onChange}
                      value={FormValue.password}
                      name="password"
                      required
                      minLength={8}
                      maxLength={20}
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
                <div className="mb-4">
                  <div className="relative  ">
                    <div className="text-white   absolute inline-block left-2.5 bottom-3 ">
                      <i className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer">
                        <MdPassword className="text-green-600 hover:text-green-900"></MdPassword>
                      </i>
                    </div>
                    <input
                      type={showPassword}
                      required
                      minLength={8}
                      maxLength={20}
                      className="form-control block w-full px-9 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="Confirm Password"
                      onChange={onChange}
                      value={FormValue.password_confirmation}
                      name="password_confirmation"
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
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-block px-7 sm:py-2.5 py-2 bg-green-600 text-white mt-3 mb-1  font-medium text-lg leading-snug  rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                >
                  {loading ? "Loading..." : "Sign up"}
                </button>
                <h1 className="mt-4 mb-2 text-center text-sm  sm:text-lg  font-normal   text-slate-700">
                  Already have an account?
                  <Link
                    href={"/login"}
                    className="text-green-500 mx-1.5 font-normal "
                  >
                    Sign In!
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

export default signup;
