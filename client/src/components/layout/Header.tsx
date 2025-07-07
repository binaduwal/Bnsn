import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="fixed top-0  left-0 right-0 z-50 transition-all duration-300 bg-black/20 backdrop-blur-xs py-4">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto ">
        {/* logo  */}
        <div className="w-40 h-auto relative">
          <Link href={"/user/userDash"}>
            <Image
              src="/District_Logo.png"
              alt="District Logo"
              width={250}
              height={70}
              className="w-full h-auto"
            />
          </Link>
        </div>

        {/* right part  */}
        <div className="flex items-center gap-4">
          <div className=" bg-gray-800 rounded-full flex items-center gap-2 px-3 py-2 w-[250px]">
            <Search className="size-6 text-gray-400" />
            <input
              placeholder="Search tools..."
              className="bg-transparent outline-none text-white "
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-700/60 px-3 py-2 rounded-full gap-2">
              <div className="bg-gradient-to-br from-purple-700 via-purple-500 size-10 rounded-full flex justify-center items-center to-pink-500">
                <span className="font-medium text-white text-xl">M</span>
              </div>
              <p className="text-white text-base font-medium">
                Mukesh Bhattarai
              </p>
              <ChevronDown className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
