import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex  flex-col w-full items-start   ">
      <Header />
      <div className=" flex items-start  mx-auto pt-5 w-full gap-3 mt-16 ">
        <div className="sticky left-0 top-24 bottom-0 h-[calc(100vh-130px)] w-[300px]">
          <Sidebar />
        </div>
        <div className="  min-h-[calc(100vh-120px)] w-full ">{children}</div>
      </div>
    </div>
  );
}

export default layout;
