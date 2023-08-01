import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import { MdOutlinePostAdd } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { BsFilePost } from "react-icons/bs";
import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { HiOutlineUser } from "react-icons/hi";
function Navbar({ myUser, logout }) {
  const [togel, togeldrop] = useState(false);
  const [mobileUserToggel, setMobileUserToggel] = useState(false);
  let HOST = process.env.NEXT_PUBLIC_HOST;
  function handleNewMessage(newMessage) {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  return (
    <>
      <div className=" flex py-4 max-w-[86.5rem] px-0.5 lg:px-6 mx-auto lg:justify-start justify-center align-middle  bg-white/80  items-center sticky top-0 z-20 opacity-100  ">
        <div className=" flex    lg:flex-1  ml-1 items-center align-middle  ">
          <Link href={"/"}>
            <div className="flex   ">
              <Image src={"/images/bizhub.png"} width={120} height={2}></Image>
            </div>
          </Link>
        </div>

        <div className="cart lg:flex hidden  items-center  align-middle">
          {!myUser.token && (
            <div>
              <Link href={"/login"}>
                <span className="md:font-bold md:text-lg font-serif   underline  ">
                  Join Now
                </span>{" "}
              </Link>
            </div>
          )}
          {myUser.token && (
            <div className="sm:block hidden">
              <Link href={"/createPost"}>
                <div className="md:font-semibold md:text-base  flex  uppercase items-center  px-3.5 py-1   border-slate-900 border-2 rounded-full text-green-600 ">
                  Create Post
                  <i className="ml-1">
                    <AiOutlinePlus />
                  </i>
                </div>
              </Link>
            </div>
          )}
          <div
            onClick={() => {
              if (togel == true) {
                togeldrop(false);
              } else {
                togeldrop(true);
              }
            }}
          >
            {togel && (
              <div
                onMouseLeave={() => {
                  togeldrop(false);
                }}
                className="z-10 absolute top-12 cursor-pointer right-8 bg-white divide-y divide-gray-100 rounded-sm shadow w-48 duration-500 transition-opacity  delay-150"
              >
                <Link href={"/myAccount"}>
                  <div className="px-4 py-3 text-base font-semibold text-gray-900 ">
                    <div className="flex items-center space-x-1 capitalize">
                      <div>
                        {myUser && myUser.firstName == null
                          ? "Anonymous"
                          : myUser.firstName + " " + myUser.lastName}
                      </div>
                    </div>

                    <div className="font-normal underline underline-offset-2 text-xs mt-0.5 truncate">
                      View My Profile
                    </div>
                  </div>
                </Link>

                <ul
                  className="py-1  text-sm text-gray-700"
                  aria-labelledby="dropdownSmallButton"
                >
                  <li className="sm:hidden block py-2">
                    <Link
                      href={"/createPost"}
                      className=" px-4 py-2 hover:bg-gray-100  items-center"
                    >
                      <AiOutlinePlus className="text-base  mr-2 inline-block align-middle text-green-600 " />
                      Create posts
                    </Link>
                  </li>
                  <li className="mt-1">
                    <Link
                      href={"/myPostList"}
                      className="block px-4 py-2 hover:bg-gray-100 "
                    >
                      <BsFilePost className="text-lg mr-2 inline-block align-middle text-green-600" />
                      My posts
                    </Link>
                  </li>

                  <li className="my-1">
                    <Link
                      href={"/message"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      <TbMessageReport className="text-lg mr-2 inline-block align-middle text-blue-600" />
                      Message
                    </Link>
                  </li>
                  <li className="">
                    <Link
                      href={"/changePassword"}
                      className="block px-4 py-2 hover:bg-gray-100 "
                    >
                      <RiLockPasswordLine className="text-lg mr-2 inline-block align-middle text-red-600" />
                      Change Password
                    </Link>
                  </li>
                </ul>
                <div className="py-2">
                  <button
                    onClick={logout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-red-600 "
                  >
                    <CiLogout className="text-lg mr-2 inline-block align-middle" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
            {myUser.token && (
              <a className=" ml-2 mb-0.5  cursor-pointer flex items-center  text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 lg:mt-0">
                <Image
                  height={40}
                  width={40}
                  src={
                    myUser && myUser.image
                      ? HOST + myUser.image
                      : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                  }
                  style={{ height: "45.5px", width: "45.5px" }}
                  className=" rounded-full "
                  alt=""
                />
              </a>
            )}
          </div>
          {/* {user.value && <buttom onClick={logout} className='font-bold cursor-pointer text-lg  mx-3 bg-black from-orange-700 bg-gradient-to-tr rounded-md py-1 px-3'>Logout</buttom>} */}
        </div>
      </div>

      <div class="bottom fixed bottom-0 bg-slate-50 w-full h-12 z-20 lg:hidden flex ">
        <div class="box flex justify-center items-center w-1/4 cursor-pointer">
          <Link href="/" className="text-xl sm:text-2xl text-green-500">
            <RxDashboard />
          </Link>
        </div>
        <div class="box flex justify-center items-center w-1/4 cursor-pointer">
          {myUser.token ? (
            <Link
              href="/myPostList"
              className="text-2xl sm:text-3xl text-slate-500"
            >
              <MdOutlinePostAdd />
            </Link>
          ) : (
            <Link href="/login" className="text-2xl sm:text-3xl text-slate-500">
              <MdOutlinePostAdd />
            </Link>
          )}
        </div>
        <div class="box flex justify-center items-center w-1/4 cursor-pointer">
          <span class="relative">
            {myUser.token ? (
              <Link href={"/createPost"}>
                <span class="absolute -top-10 z-20 -right-6 h-12 w-12 text-lg rounded-full bg-green-600/90 border border-green-600 text-white flex justify-center items-center items cursor-pointer">
                  <span>
                    <AiOutlinePlus />
                  </span>
                </span>
              </Link>
            ) : (
              <Link href={"/login"}>
                <span class="absolute -top-10 -right-6 h-12 w-12 z-20 text-lg rounded-full bg-green-600/90 border border-green-600 text-white flex justify-center items-center items cursor-pointer">
                  <span>
                    <AiOutlinePlus />
                  </span>
                </span>
              </Link>
            )}
          </span>
        </div>
        <div class="box flex justify-center items-center w-1/4 cursor-pointer">
          {myUser.token ? (
            <Link
              href="/message"
              className="text-2xl sm:text-3xl text-slate-500"
            >
              <BiMessageRounded />
            </Link>
          ) : (
            <Link href="/login" className="text-2xl sm:text-3xl text-slate-500">
              <BiMessageRounded />
            </Link>
          )}
        </div>
        <div
          onClick={() => {
            if (mobileUserToggel == true) {
              setMobileUserToggel(false);
            } else {
              setMobileUserToggel(true);
            }
          }}
          class="box flex justify-center items-center w-1/4 cursor-pointer"
        >
          <button className="text-2xl sm:text-3xl text-slate-500">
            <HiOutlineUser />
          </button>
        </div>
      </div>
      {mobileUserToggel && (
        <div class="lg:hidden bottom fixed w-fit bottom-10 right-0 bg-white flex flex-col px-4 py-5 rounded-t-md shadow-md font-semibold z-20 dark:bg-gray-900 dark:text-gray-100 ">
          <ol>
            <li className="flex mb-5  ">
              {myUser.token && (
                <div className=" mr-1.5 cursor-pointer flex items-center  text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 ">
                  <Image
                    height={20}
                    width={20}
                    src={
                      myUser && myUser.image
                        ? HOST + myUser.image
                        : "https://www.olx.com.pk/assets/iconProfilePicture.7975761176487dc62e25536d9a36a61d.png"
                    }
                    style={{ height: "28px", width: "28px" }}
                    className=" rounded-full "
                    alt=""
                  />
                </div>
              )}
              {localStorage.getItem("authToken") && (
                <Link class=" flex items-center  " href="/myAccount">
                  View My Profile
                </Link>
              )}
            </li>
            {localStorage.getItem("authToken") && (
              <li className="mb-5">
                <Link class="flex items-center " href={"/changePassword"}>
                  <RiLockPasswordLine className="text-lg mr-2 inline-block align-middle text-red-600" />
                  Change Password
                </Link>
              </li>
            )}
            {localStorage.getItem("authToken") && (
              <li className="mb-5">
                <button
                  onClick={logout}
                  class="text-gray-700 hover:text-red-600  flex items-center "
                >
                  <CiLogout className="text-lg mr-2 inline-block align-middle" />
                  Sign Out
                </button>
              </li>
            )}
            {!localStorage.getItem("authToken") && (
              <li className="mb-5">
                <Link href={"/login"} class=" flex items-center my-3 ">
                  Join Now
                </Link>
              </li>
            )}
          </ol>
        </div>
      )}
    </>
  );
}

export default Navbar;
