import React from "react";
import Image from "next/image";
import Link from "next/link";
function Footer() {
  return (
    <>
      <footer className="bg-slate-50/20 lg:block hidden  ">
        <div className="mx-auto w-full ">
          <div className="px-4 py-6  md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center">
              © 2023{" "}
              <Link href="/" className="text-green-600">
                BizHub
              </Link>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 space-x-6 sm:justify-center md:mt-0">
              <a
                href={
                  "https://play.google.com/store/apps/details?id=com.bizhub.bizhubAndroid"
                }
                className="text-gray-400 hover:text-gray-900 flex items-center align-middle  "
              >
                <Image src={"/images/bizhub.png"} width={70} height={0}></Image>
                <span className="ml-0.5  text-green-500 tracking-wide font-bold">Mobile</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
