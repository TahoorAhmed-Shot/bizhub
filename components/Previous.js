import { useRouter } from "next/router";
import React from "react";
import { GrLinkPrevious } from "react-icons/gr";

function Previous({ loading }) {
  const router = useRouter();
  return (
    <>
      <div className="flex sticky">
        <div
          onClick={() => {
            router.back();
          }}
          className="  px-4  py-4 md:mx-6 mx-2 hover:bg-slate-50 rounded-full cursor-pointer"
        >
          {!loading && (
            <span className="flex ">
              <i className="text-xl ">
                <GrLinkPrevious></GrLinkPrevious>
              </i>
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Previous;
