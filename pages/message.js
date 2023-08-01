import Spinner from "@/components/Spinner";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { GrLinkPrevious } from "react-icons/gr";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
function message({ loading, setLoading, tostSuccess, tostError }) {
  let HOST = process.env.NEXT_PUBLIC_HOST;
  const isSmallDevice = useMediaQuery({ maxWidth: 639 });
  const router = useRouter();
  const ref = useRef(null);
  const [user, setUser] = useState([]);
  const [meessageLoader, setMessageLoader] = useState(false);
  const [userList, setUserList] = useState("w-full");
  const [messageList, setMessageList] = useState("w-0");
  const [messages, setMessages] = useState([]);
  const [prev, setprev] = useState(false);
  const [formValue, setFormValue] = useState({
    service_id: "",
    message: "",
    receiver_id: "",
    chat_id: "",
  });
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);
  useEffect(() => {
    allUsers();
  }, []);
  let allUsers = async () => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
   
    });

    let url = `${HOST}/api/all-chats-list`;

    let res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    });
    let data = await res.data;
    setUser(data.data);
  };
  let allMessage = async (id) => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
  
    });
    setLoading(true);
    let url = `${HOST}/api/fetch-chat/${id}`;

    let res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    });
    let data = await res.data;
    setMessages(data.data.messages);
    setLoading(false);
  };
  let allMessageAgain = async (id) => {
    axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
   
    });

    let url = `${HOST}/api/fetch-chat/${id}`;

    let res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    });
    let data = await res.data;
    setMessages(data.data.messages);
  };
  let handelMessage = async () => {
    if (formValue) {
      axios.get(`${HOST}/sanctum/csrf-cookie`).then((response) => {
  
      });
      setMessageLoader(true);
      setTimeout(async () => {
        setMessageLoader(true);
        try {
          let url = `${HOST}/api/send-offer`;
          let params = {
            receiver_id: formValue.receiver_id,
            service_id: formValue.service_id,
            message: formValue.message,
          };

          let res = await axios.post(url, params, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
          });
          let data = await res.data;

          if (data.status) {
            tostSuccess("message sended");
            await allMessageAgain(formValue.chat_id);
            await allUsers();
            setFormValue({
              service_id: formValue.service_id,
              message: "",
              receiver_id: formValue.receiver_id,
              chat_id: formValue.chat_id,
            });
            setMessageLoader(false);
          }
        } catch (error) {
          tostError(error.response.data.message);
          ref.current.classList.remove("blur-sm");
          setMessageLoader(false);
        }
      }, 500);
      setMessageLoader(false);
    }
  };
  let onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  return (
    <>
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
      <div className="mx-auto shadow-lg   rounded-lg min-h-screen w-full  fixed ">
        {isSmallDevice && messages.length !== 0 && (
          <div
            onClick={() => {
              setUserList("w-full");
              setMessageList("w-0");
              setFormValue({
                message: "",
              });
              setMessages([]);
            }}
            className="  md:px-6 px-3 py-2 md:mx-6 mx-2 cursor-pointer"
          >
            {!loading && (
              <span className="flex ">
                <i className="text-xl ">
                  <GrLinkPrevious></GrLinkPrevious>
                </i>
              </span>
            )}
          </div>
        )}

        <div className="  flex flex-row min-h-screen overflow-y-hidden  justify-center form-slate-800 bg-gradient-to-r  mx-auto">
          <div
            className={`flex flex-col md:w-[38%] sm:w-[42%] ${userList} bg-white  border-x-2  `}
          >
            
            <div
              ref={ref}
              onClick={() => {
                setMessageList("w-full");
                setUserList("w-0");
              }}
              className="relative  overflow-y-scroll scrollbar-hide h-[100vh] pb-[9.3rem]"
            >
              {user.length !== 0 ? (
                user &&
                user.map((key) => {
                  return (
                    <div
                      onClick={() => {
                        setFormValue({
                          service_id: key.service_id,
                          message: "",
                          receiver_id: key.sender_details.id,
                          chat_id: key.id,
                        });
                        if (key) {
                          allMessage(key.id);
                        }
                      }}
                      className=" sm:flex block md:mx-0 mx-auto  flex-row py-4  cursor-pointer justify-center text-gray-900 hover:text-black hover:bg-slate-100 items-center border-b-2"
                    >
                      <div className="sm:mx-4 mx-auto flex justify-center ">
                        <Image
                          height={2}
                          width={2}
                          src={
                            key.sender_details && key.sender_details.image
                              ? HOST + key.sender_details.image
                              : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                          }
                          className="  h-12  md:w-14 w-12   object-cover flex rounded-full"
                          alt=""
                        />
                      </div>
                      <div className="w-full text-center mt-2 mx-auto text-center md:text-left flex flex-col ">
                        <sapn className="md:text-lg text-sm font-semibold ">
                          {key.service.title}
                        </sapn>
                        <span className="text-slate-400  ">
                          {key.message && key.message.message == null
                            ? key.message.offer
                            : key.message.message}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>
                  <div className=" sm:flex block md:mx-0 mx-auto  flex-row py-4  cursor-pointer justify-center text-gray-200 hover:text-black hover:bg-slate-100 items-center border-b-2">
                    <div className="sm:mx-8 mx-auto flex justify-center ">
                      <span
                        className="object-cover animate-pulse h-12 w-12 rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r "
                        alt=""
                      />
                    </div>
                    <div className="w-full text-center mt-4">
                      <div
                        className={`text-lg font-semibold w-40 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        }  rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r animate-pulse text-gray-300`}
                      >
                        -
                      </div>
                      <div
                        className={`w-24 mt-2 rounded-full   bg-slate-500 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } from-slate-300 bg-gradient-to-r animate-pulse text-gray-300 `}
                      >
                        -
                      </div>
                    </div>
                  </div>
                  <div className=" sm:flex block sm:mx-0 mx-auto  flex-row py-4  cursor-pointer justify-center text-gray-200 hover:text-black hover:bg-slate-100 items-center border-b-2">
                    <div className="sm:mx-8 mx-auto flex justify-center ">
                      <span
                        className="object-cover animate-pulse h-12 w-12 rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r "
                        alt=""
                      />
                    </div>
                    <div className="w-full text-center mt-2 mx-auto ">
                      <div
                        className={`text-lg font-semibold w-40 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r animate-pulse text-gray-300`}
                      >
                        -
                      </div>
                      <div
                        className={`w-24 mt-2 rounded-full bg-slate-500 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } from-slate-300 bg-gradient-to-r animate-pulse text-gray-300 `}
                      >
                        -
                      </div>
                    </div>
                  </div>
                  <div className=" sm:flex block sm:mx-0 mx-auto  flex-row py-4  cursor-pointer justify-center text-gray-200 hover:text-black hover:bg-slate-100 items-center border-b-2">
                    <div className="sm:mx-8 mx-auto flex justify-center ">
                      <span
                        className="object-cover animate-pulse h-12 w-12 rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r "
                        alt=""
                      />
                    </div>
                    <div className="w-full text-center mt-2 mx-auto ">
                      <div
                        className={`text-lg font-semibold w-40 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r animate-pulse text-gray-300`}
                      >
                        -
                      </div>
                      <div
                        className={`w-24 mt-2 rounded-full bg-slate-500 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } from-slate-300 bg-gradient-to-r animate-pulse text-gray-300 `}
                      >
                        -
                      </div>
                    </div>
                  </div>
                  <div className=" sm:flex block sm:mx-0 mx-auto  flex-row py-4  cursor-pointer justify-center text-gray-200 hover:text-black hover:bg-slate-100 items-center border-b-2">
                    <div className="sm:mx-8 mx-auto flex justify-center ">
                      <span
                        className="object-cover animate-pulse h-12 w-12 rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r "
                        alt=""
                      />
                    </div>
                    <div className="w-full text-center mt-2 mx-auto ">
                      <div
                        className={`text-lg font-semibold w-40 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r animate-pulse text-gray-300`}
                      >
                        -
                      </div>
                      <div
                        className={`w-24 mt-2 rounded-full bg-slate-500 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } from-slate-300 bg-gradient-to-r animate-pulse text-gray-300 `}
                      >
                        -
                      </div>
                    </div>
                  </div>
                  <div className=" sm:flex block sm:mx-0 mx-auto  flex-row py-4  cursor-pointer justify-center text-gray-200 hover:text-black hover:bg-slate-100 items-center border-b-2">
                    <div className="sm:mx-8 mx-auto flex justify-center ">
                      <span
                        className="object-cover animate-pulse h-12 w-12 rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r "
                        alt=""
                      />
                    </div>
                    <div className="w-full text-center mt-2 mx-auto ">
                      <div
                        className={`text-lg font-semibold w-40 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r animate-pulse text-gray-300`}
                      >
                        -
                      </div>
                      <div
                        className={`w-24 mt-2 rounded-full bg-slate-500 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } from-slate-300 bg-gradient-to-r animate-pulse text-gray-300 `}
                      >
                        -
                      </div>
                    </div>
                  </div>
                  <div className=" sm:flex block sm:mx-0 mx-auto  flex-row py-4  cursor-pointer justify-center text-gray-200 hover:text-black hover:bg-slate-100 items-center border-b-2">
                    <div className="sm:mx-8 mx-auto flex justify-center ">
                      <span
                        className="object-cover animate-pulse h-12 w-12 rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r "
                        alt=""
                      />
                    </div>
                    <div className="w-full text-center mt-2 mx-auto ">
                      <div
                        className={`text-lg font-semibold w-40 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } rounded-full bg-slate-500 from-slate-300 bg-gradient-to-r animate-pulse text-gray-300`}
                      >
                        -
                      </div>
                      <div
                        className={`w-24 mt-2 rounded-full bg-slate-500 ${
                          isSmallDevice ? "mx-auto" : "mx-0"
                        } from-slate-300 bg-gradient-to-r animate-pulse text-gray-300 `}
                      >
                        -
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className={` sm:w-1/2   bg-white flex flex-col ${messageList} h-[100vh] border-r-2 `}
          >
            <div className="  h-[100vh]   overflow-y-auto  w-full  overflow-x-hidden    scrollbar-hide   ">
              <div className=" my-8  ">
                {meessageLoader && (
                  <div className="flex justify-center    mx-auto ">
                    <span className="flex justify-center bg-green-600 p-4 absolute text-white  top-64">
                      Loading...
                    </span>
                  </div>
                )}
                {messages.length == 0 && (
                  <div className="flex justify-center fixed   mx-auto ">
                    <Image
                      height={2}
                      width={2}
                      className="h-full w-full "
                      src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?w=826&t=st=1683248527~exp=1683249127~hmac=d0bcfa80072c07b6e07892e8f77531f603b94213c06d10e425435b7dfb5ca466"
                    ></Image>
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center  ">
                    <span className="flex justify-center  absolute  top-64">
                      <Spinner></Spinner>
                    </span>
                  </div>
                ) : (
                  messages &&
                  messages
                    .slice("0")
                    .reverse()
                    .map((key) => {
                    
                      if (key.is_me) {
                        return (
                          <div
                            ref={ref}
                            className="flex justify-end align-middle my-3 md:px-6 px-4 items-center"
                          >
                            <div className="mr-2 py-3 px-5 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                              {key.message == null ? key.offer : key.message}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            ref={ref}
                            className="flex justify-start items-end md:px-6 px-4  my-3 mb-4"
                          >
                            <div className="ml-2 py-3 px-5 bg-green-400  rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                              {key.message == null ? key.offer : key.message}
                            </div>
                          </div>
                        );
                      }
                    })
                )}
              </div>
            </div>
            {messages.length !== 0 && (
              <div className=" px-3 sm:pb-16 pb-16 sm:pt-10 pt-8 cursor-pointer md:mb-[5rem] mb-[6rem] bg-slate-100 relative border-t-2  ">
                <input
                  className="w-full  relative bg-gray-50 py-5 px-3 rounded-xl"
                  type="text"
                  name="message"
                  value={formValue.message}
                  onChange={onChange}
                  disabled={meessageLoader == true ? true : false}
                  placeholder="type your message here..."
                />
                <div
                  onClick={handelMessage}
                  className="absolute disabled:text-slate-100 md:right-10 right-6   text-xl md:top-[4rem] top-[3.3rem]"
                >
                  {formValue.message && <BsSend></BsSend>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default message;
