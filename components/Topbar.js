import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import {
  MdOutlineClose,
  MdAccountCircle,
  MdManageAccounts,
  MdOutlineManageAccounts,
} from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import {
  AiFillPlusCircle,
  AiFillMinusCircle,
  AiOutlineUser,
} from "react-icons/ai";
import { BsCart3, BsFilePost } from "react-icons/bs";
import { useRouter } from "next/router";
import { useState } from "react";
function Topbar() {
  return (
    <>
      <div className=" flex py-4   md:flex-row md:justify-start align-middle    items-center sticky top-0 z-10 opacity-100 bg-white">
        <div className=" flex justify-center mx-auto  items-center align-middle ">
          <Link href={"/"}>
            <div className="flex mt-1  ">
              <Image
                src={"/images/bizhub.png"}
                width={110}
                height={2}
              ></Image>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Topbar;
