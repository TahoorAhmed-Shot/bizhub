import Link from "next/link";
import React from "react";

function err() {
  return (
    <>
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
    </>
  );
}

export default err;
