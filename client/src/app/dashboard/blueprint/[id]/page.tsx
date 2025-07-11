'use client'
import BlueprintForm from "@/components/BlueprintForm";
import EditableInput from "@/components/ui/EditableInput";
import { Copy } from "lucide-react";
import React from "react";

function page() {
    const [title, setTitle] = React.useState("Productivity Course Demo");
  return (
    <div className=" border border-gray-300 p-4 rounded-lg mx-2 shadow-md">
      <BlueprintForm/>
    </div>
  );
}

export default page;
