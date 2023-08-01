import React, { useEffect } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { MdAlternateEmail, MdPassword } from "react-icons/md";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { RiHashtag } from "react-icons/ri";

function resetPassword({ tostError, tostSuccess }) {
  let HOST = process.env.NEXT_PUBLIC_HOST;
  let router = useRouter();
  const [showPassword, setPassword] = useState("password");
  const [pass, setPass] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [FormValue, setFormValue] = useState({
    forget_token: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    let email = localStorage.getItem("email");
    if (email) {
      setEmail(email);
    }
  }, [router.query]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router.query]);

  const handel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = `${HOST}/api/reset-password`;
      let param = {
        email: email,
        forget_token: FormValue.forget_token,
        password: FormValue.password,
        password_confirmation: FormValue.password_confirmation,
      };
      let res = await axios.post(url, param);
      let data = await res.data;

      if (data.status) {
        tostSuccess(data.message);
        setFormValue({
          email: "",
          forget_token: "",
          password: "",
          password_confirmation: "",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);

      tostError(err.response.data.message);
    }
  };
   
  let onChange = (e) => {
    setFormValue({ ...FormValue, [e.target.name]: e.target.value });
  };
  return (
    <>
      {router.query.token ? (
        <section className=" mt-28 min-h-screen">
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

            <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
              <div className="sm:w-5/6 md:w-1/2 lg:w-1/3 m-auto p-10 rounded-md shadow-xl">
                <h1 className=" mt-2  text-2xl text-center mb-7 md:text-4xl  font-semibold   text-slate-700">
                  Reset Password
                </h1>

                <form onSubmit={handel}>
                  <div className="mb-4">
                    <div className="relative flex items-center align-middle ">
                      <div className="text-white   absolute inline-block left-2.5 bottom-3 ">
                        <i className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer">
                          <RiHashtag className="text-green-600 hover:text-green-900"></RiHashtag>
                        </i>
                      </div>
                      <input
                        type="text"
                        required
                        minLength={1}
                        className="form-control block w-full px-9 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                        placeholder="Code"
                        onChange={onChange}
                        value={FormValue.forget_token}
                        name="forget_token"
                      />
                    </div>
                  </div>
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
                        readOnly
                        value={email}
                        name="email"
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
                   {loading
                   ?"Loading...": "Reset Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div>
          <div
            className="
    flex
    items-center
    justify-center
   
    h-[94vh]
    overflow-y-hidden

    bg-gradient-to-r
    from-slate-600
    to-green-500
  "
          >
            <div className="px-40 py-20 bg-white rounded-md shadow-xl">
              <div className="flex flex-col items-center">
                <h1 className="font-bold text-green-600 text-9xl">404</h1>

                <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                  <span className="text-red-500">Oops!</span> Page not found
                </h6>

                <p className="mb-8 text-center text-gray-500 md:text-lg">
                  The page you’re looking for doesn’t exist.
                </p>

                <Link
                  href={"/"}
                  className="px-6 py-2 text-sm font-semibold text-green-800 bg-green-100"
                >
                  Go home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default resetPassword;
