import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiMail } from "react-icons/hi";
import axios from "axios";

function login({ tostError, tostSuccess }) {
  let router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    email: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_HOST}/api/forget-password`;
      let param = {
        email: formValue.email,
      };
      let res = await axios.post(url, param);
      let data = await res.data;

      if (data.status) {
        tostSuccess(data.message);
        localStorage.setItem("email", formValue.email);
        setTimeout(async () => {
          router.push("/resetPassword?token=f-11223344");
          setFormValue({ email: "" });
        }, 2000);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      tostError(error.response.data.message);
    }
  };
  return (
    <>
      <section className="sm:mt-20 mt-16 min-h-screen">
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
            <div className="sm:w-5/6 md:w-1/2 lg:w-1/3 m-auto py-12 px-7 rounded-md shadow-xl">
              <h1 className="mb-3 mt-2   text-2xl  sm:text-3xl  font-semibold   text-slate-700">
                Fogot Password
              </h1>
              <h1 className="text-base text-slate-400 mb-2">
                Enter an Email for verification
              </h1>

              <form className="my-4" onSubmit={handel}>
                <div className="mb-2">
                  <div className="relative  ">
                    <div className="text-white   absolute inline-block left-2.5 bottom-[0.78rem] ">
                      <i className="  text-xl  block align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer">
                        <HiMail className="text-green-600 "></HiMail>
                      </i>
                    </div>
                    <input
                      required
                      minLength={5}
                      type="email"
                      className="form-control block w-full px-10 py-2.5 md:text-base text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                      placeholder="Email Address"
                      onChange={onChange}
                      value={formValue.email}
                      name="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-block px-2 sm:py-1.5 py-1.5 bg-green-600 text-white my-2  font-normal tracking-wide md:text-base text-base leading-snug  rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                >
                  {loading ? "Loading..." : "Send Verification"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default login;
