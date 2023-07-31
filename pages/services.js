import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import Image from "next/image";
function services({ servicesCategories, avalibalServicesCategories, loading }) {
  let HOST = process.env.NEXT_PUBLIC_HOST;
  const router = useRouter();

  useEffect(() => {
    servicesCategories();
  }, [router.query]);
  return (
    <>
      <section className="min-h-screen">
        <div className=" max-w-7xl mx-auto   px-3 py-8">
          <h1 className=" text-center text-3xl italic font-medium mb-8 text-slate-800">
            Select Category
          </h1>
          {loading ? (
            <div className="flex justify-center  ">
              <span className="flex justify-center  absolute  top-64">
                <Spinner></Spinner>
              </span>
            </div>
          ) : (
            <div className="flex justify-start">
              <div className="flex flex-wrap justify-center">
                {avalibalServicesCategories &&
                  avalibalServicesCategories.map((key, index) => {
                    return (
                      <div
                        key={index}
                        className="xl:w-1/5 md:w-1/2  p-3 w-[50%]   "
                      >
                        <div className="max-w-sm bg-slate-50 shadow-sm  mb-2 hover:shadow-xl mx-auto ">
                          <Link href={`/createServicePost?id=${key.id}`}>
                            <div>
                              {key.images ? (
                                <p>no image</p>
                              ) : (
                                <Image
                                  height={2}
                                  width={2}
                                  className="object-cover  md:h-52 h-40  w-full bg-slate-300  "
                                  src={`${
                                    !key.image
                                      ? "https://images.olx.com.pk/thumbnails/347296539-240x180.webp"
                                      : HOST + key.image
                                  }`}
                                  alt=""
                                />
                              )}
                            </div>

                            <div className=" rounded-b-lg h-10 mt-2">
                              <h5 className="mb-4 md:text-xl text-lg   md:font-semibold font-medium tracking-tight text-center  z-10 text-gray-800 ">
                                {key.title}
                              </h5>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default services;
