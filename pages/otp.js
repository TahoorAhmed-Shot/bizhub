import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { ToastContainer } from "react-toastify";

function otp({ tostError, tostSuccess }) {
  let HOST = process.env.NEXT_PUBLIC_HOST;

  const [formValue, setFormValue] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
  });
  const [uniqueId, setUniqueId] = useState();
  let router = useRouter();

  useEffect(() => {
    let id = localStorage.getItem("uniqueId");
    if (id) {
      setUniqueId(id);
    }
  });

  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
    const nextSibling = e.target.nextElementSibling;
    const prevSibling = e.target.previousElementSibling;
    if (nextSibling && e.target.value !== "") {
      nextSibling ? nextSibling.focus() : e.target.blur();
    }
    if (e.target && e.target.value == "") {
      prevSibling && prevSibling.focus();
    }
  };

  const handel = async () => {
    try {
      let url = `${HOST}/api/validate-otp`;
      let data1 = "";
      let newData = data1.concat(
        formValue.otp1,
        formValue.otp2,
        formValue.otp3,
        formValue.otp4
      );
      let param = {
        otp: newData,
        unique_id: uniqueId,
      };

      let res = await axios.post(url, param);
      let data = await res.data;

      if (data.status) {
        tostSuccess(data.message);
        localStorage.removeItem("uniqueId");
        setFormValue({
          otp1: "",
          otp2: "",
          otp3: "",
          otp4: "",
        });
        setTimeout(() => {
          router.push(`/thankYou?token=R-1122334455`);
        }, 2000);
      }
    } catch (err) {
      tostError(err.response.data.message);
    }
  };
  const handelResend = async () => {
    try {
      let url = `${HOST}/api/resend-otp`;

      let param = {
        unique_id: uniqueId,
      };

      let res = await axios.post(url, param);
      let data = await res.data;
      console.log(data);
      if (data.status) {
        tostSuccess(data.message);
        localStorage.setItem("uniqueId", data.data.uniqueId);
      }
    } catch (err) {
      tostError(err.response.data.message);
    }
  };

  return (
    <>
      <section className=" mt-32 min-h-screen">
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
        {uniqueId && (
          <div className="px-4 py-5">
            <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
              <div className="w-full md:w-1/2 lg:w-1/4 mx-auto py-8 px-8 rounded-md shadow-xl">
                <h1 className="mb-3 mt-4 text-center text-3xl uppercase sm:text-3xl  font-semibold   text-slate-700">
                  OTP Verification
                </h1>
                <h1 className="mb-6  text-center text-sm uppercase sm:text-xs  font-semibold   text-slate-700">
                  Enter the OTP you received at
                </h1>

                <div
                  id="otp"
                  className="flex flex-row justify-center text-center px-2 my-2 "
                >
                  <input
                    className="m-2 border h-14 w-14 text-center form-control rounded"
                    type="text"
                    id="first"
                    minLength={1}
                    maxLength={1}
                    onChange={onChange}
                    value={formValue.otp1}
                    name="otp1"
                  />
                  <input
                    className="m-2 border h-14 w-14 text-center form-control rounded"
                    type="text"
                    id="second"
                    minLength={1}
                    maxLength={1}
                    onChange={onChange}
                    value={formValue.otp2}
                    name="otp2"
                  />
                  <input
                    className="m-2 border h-14 w-14 text-center form-control rounded"
                    type="text"
                    id="third"
                    minLength={1}
                    maxLength={1}
                    onChange={onChange}
                    value={formValue.otp3}
                    name="otp3"
                  />
                  <input
                    className="m-2 border h-14 w-14 text-center form-control rounded"
                    type="text"
                    id="fourth"
                    minLength={1}
                    maxLength={1}
                    onChange={onChange}
                    value={formValue.otp4}
                    name="otp4"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handelResend}
                    className=" w-52   text-green mt-2 mb-1  font-medium text-base leading-snug  "
                  >
                    Resend OTP
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    onClick={handel}
                    className=" w-52 px-2 py-2 bg-green-600 text-white mt-2 mb-1  font-medium text-base leading-snug  rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out "
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default otp;
