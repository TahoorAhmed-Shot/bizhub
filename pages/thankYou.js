import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { GrFormNextLink, GrLinkNext } from "react-icons/gr";

function thankYou() {
  let router = useRouter();
  let token = router.query.token;

  return (
    <>
    
      {router.query.token ? (
        <div className="min-h-screen">
          <div className="flex items-center min-h-[80vh] overflow-y-hidden justify-center">
            <div>
              <div className="flex flex-col items-center space-y-2 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-600 w-28 h-28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h1 className="text-4xl font-bold">Thank You !</h1>
                <p className="mb-3 text-center">
                  Thank you for connecting with Bizhub! Follow this link to
                  continue.
                </p>
                <div className="my-4">
                  <a
                    onClick={() => {
                      router.push("/login");
                    }}
                    className="inline-flex items-center px-4 py-2 my-2 text-white bg-green-600 border border-green-600  rounded-full hover:bg-green-700 focus:outline-none focus:ring"
                  >
                    <button className="text-sm font-medium">Login</button>
                    <GrLinkNext className="text-white text-sm ml-2"></GrLinkNext>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default thankYou;
