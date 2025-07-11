'use client'
import BlueprintForm from "@/components/BlueprintForm";
import EditableInput from "@/components/ui/EditableInput";
import { Copy } from "lucide-react";
import React from "react";

function page() {
    const [title, setTitle] = React.useState("Productivity Course Demo");
  return (
    <div className=" border border-gray-300 p-4 rounded-lg mx-2 shadow-md">
      {/* <div className=" flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">

        <EditableInput
          text={title}
          setText={setTitle}
          />
          <Copy size={18} className="text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>
      </div> */}
      <BlueprintForm/>
    </div>
  );
}

export default page;
