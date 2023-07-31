import Image from "next/image";
import Link from "next/link";
import React from "react";
import job from "./jobs";

function createPost() {
  return (
    <>
      <section className="  mt-12 min-h-[80vh] ">
        <div className="text-gray-600 body-font ">
          <div className="container px-2 py-8  mx-auto ">
            <div className="flex uppercase flex-wrap justify-center items-center align-middle text-center ">
              <div className="xl:w-1/5 md:w-1/2  p-2 md:px-5 md:py-3 w-[50%]  ">
                <div className="max-w-sm bg-slate-50 shadow-sm  mb-2 hover:shadow-xl mx-auto  ">
                  <Link href={`/jobs`}>
                    <div>
                      <Image
                        height={2}
                        width={2}
                        className="object-fill  md:h-72 h-60  w-full bg-slate-300  "
                        src={"/images/job_post.png"}
                        alt=""
                      />
                    </div>

                    <div className=" rounded-b-lg h-10 mt-2">
                      <h5 className="mb-4 md:text-xl text-lg   md:font-semibold font-medium tracking-tight text-center  z-10 text-green-600">
                        Job
                      </h5>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="xl:w-1/5 md:w-1/2  p-2 md:px-5 md:py-3 w-[50%]  ">
                <div className="max-w-sm bg-slate-50 shadow-sm  mb-2 hover:shadow-xl mx-auto  ">
                  <Link href={`/services`}>
                    <div>
                      <Image
                        height={2}
                        width={2}
                        className="object-fill  md:h-72 h-60  w-full bg-slate-300  "
                        src={"/images/service_post.png"}
                        alt=""
                      />
                    </div>

                    <div className=" rounded-b-lg h-10 mt-2">
                      <h5 className="mb-4 md:text-xl text-lg   md:font-semibold font-medium tracking-tight text-center  z-10 text-green-600">
                        Service
                      </h5>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default createPost;
