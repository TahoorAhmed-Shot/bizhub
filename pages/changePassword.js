import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdPassword } from "react-icons/md";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function changePassword({ tostError, tostSuccess }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });
  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };
  let router = useRouter();
  const [pass, setPass] = useState(false);
  const [cpass, setCPass] = useState(false);
  const [showPassword, setPassword] = useState("password");
  const [showCPassword, setCPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.push("/");
    }
  }, [router.query]);

  const handel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_HOST}/api/change-password`;
      let param = {
        password: formValue.password,
        password_confirmation: formValue.password_confirmation,
      };
      let res = await axios.post(url, param, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      });
      let data = await res.data;

      if (data.status) {
        tostSuccess(data.message);
        setFormValue({
          password: "",
          password_confirmation: "",
        });
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      tostError(err.response.data.message);
    }
  };

  return (
    <section className="mt-20 min-h-screen">
      <div className="flex justify-center items-center flex-wrap   text-gray-800">
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
        <div className="sm:w-5/6 md:w-1/2 lg:w-1/3 m-auto py-12 px-7 rounded-md shadow-xl">
          <h1 className="mb-6 mt-2   text-2xl  sm:text-3xl  font-semibold  text-center text-slate-700">
            Change Password
          </h1>
          <form onSubmit={handel}>
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
                  placeholder="New Password"
                  onChange={onChange}
                  value={formValue.password}
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
                        className="  md:text-lg text-base block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer"
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
                        className=" md:text-lg text-base  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer"
                      >
                        <ImEyeBlocked className="text-green-600"></ImEyeBlocked>
                      </i>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <div className="relative  ">
                <div className="text-white   absolute inline-block left-2.5 bottom-3 ">
                  <i className="  text-lg  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer">
                    <MdPassword className="text-green-600 hover:text-green-900"></MdPassword>
                  </i>
                </div>
                <input
                  type={showCPassword}
                  required
                  minLength={8}
                  maxLength={20}
                  className="form-control block w-full px-9 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                  placeholder="Confirm Password"
                  onChange={onChange}
                  value={formValue.password_confirmation}
                  name="password_confirmation"
                />
                <div className="text-white  absolute inline-block right-2.5 bottom-3 ">
                  {cpass ? (
                    <div className="">
                      <i
                        onClick={() => {
                          setCPassword("password");
                          setCPass(false);
                        }}
                        className="  md:text-lg text-base  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer"
                      >
                        <ImEye className=" text-green-600 "></ImEye>
                      </i>
                    </div>
                  ) : (
                    <div className="">
                      <i
                        onClick={() => {
                          setCPassword("text");
                          setCPass(true);
                        }}
                        className="  md:text-lg text-base   block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer"
                      >
                        <ImEyeBlocked className="text-green-600"></ImEyeBlocked>
                      </i>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {formValue.password_confirmation.length > 7 &&
              formValue.password == formValue.password_confirmation && (
                <span className=" font-medium text-green-500">
                  {" "}
                  Password match successfully!{" "}
                </span>
              )}
            {formValue.password_confirmation.length > 7 &&
              formValue.password !== formValue.password_confirmation && (
                <span className=" font-medium text-red-500">
                  Password not match
                </span>
              )}
            <button
              type="submit"
              disabled={loading}
              className="inline-block px-2 sm:py-1.5 py-2  bg-green-600 text-white my-4  font-normal tracking-wide md:text-base text-base leading-snug  rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
            >
              {loading ? "Loading..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default changePassword;
