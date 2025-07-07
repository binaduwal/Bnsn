"use client";

import React from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-5 box-border overflow-hidden">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-[url('/future.jpg')] bg-center bg-cover bg-no-repeat blur-lg brightness-[0.85] -z-10"
        aria-hidden="true"
      />
      <div className="grid grid-cols-6 gap-16 max-w-5xl bg-white rounded-2xl overflow-hidden mx-auto text-gray-800 p-10 ">
        {/* Left Container - Login Form */}
        <div className="lg:col-span-3 col-span-6 rounded-l-2xl justify-center items-center  backdrop-blur-sm">
          <div className="w-full space-y-5">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold text-gray-700">
                Welcome Back Admin
              </h1>
              <p className="text-base tracking-wide font-normal text-gray-500">
                {"Let's get started by filling out the form below."}
              </p>
            </div>

            <LoginForm role="admin" onResetPasswordClick={() => {}} />

            <div className=" text-gray-600 leading-relaxed text-xs">
              <div className="text-center flex flex-col gap-2">
                <p className="">
                  We have sent your login details to the email you registered to
                  the program with — we recommend checking your spam folder if
                  you have not seen it yet.
                </p>
                <p>
                  Alternatively, you can use the{" "}
                  <span className="text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer">
                    {" "}
                    Reset Password
                  </span>{" "}
                  option with the same email you registered with.
                </p>
                <p>
                  If it still does not work, then reach out to our support
                  service at{" "}
                  <a
                    href="mailto:support@industryrockstar.ai"
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    support@industryrockstar.ai
                  </a>
                  , and we will generate a new email for you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Container - Image Section */}
        <div className="lg:col-span-3 col-span-0 lg:block hidden bg-white/20 rounded-xl p-0 overflow-hidden backdrop-blur-sm">
          <div className="relative w-full h-full flex group">
            <Image
              src="/IR-Copilot-Creator.jpg"
              alt="Admin portal illustration"
              width={1000}
              height={800}
              className="w-full h-full object-cover object-center min-h-full transition-transform duration-500 ease-out"
              priority
              quality={90}
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
