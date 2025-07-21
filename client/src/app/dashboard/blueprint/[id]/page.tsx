"use client";
import BlueprintForm from "@/components/BlueprintForm";
import { CategorizedForm } from "@/components/CategorizedForm";
import EditableInput from "@/components/ui/EditableInput";
import {
  
  CategoryValue,
  getSingleBlueprintApi,
} from "@/services/blueprintApi";
import { Category } from "@/services/categoryApi";
import { Copy } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

function page({ params }: { params: Promise<{ id: string }> }) {
  const [title, setTitle] = React.useState("Productivity Course Demo");
  const id = use(params).id;

  const [blueprintForms, setBlueprintForms] = useState<Category[]>([]);
  const [categoryValues, setCategoryValues] = useState<CategoryValue[]>([]);

  useEffect(() => {
    fetchBlueprintData();
  }, []);

  const fetchBlueprintData = async () => {
    if (!id) return;
    try {
      const res = await getSingleBlueprintApi(id);
      setBlueprintForms(res.data.categories);
      setCategoryValues(res.categoryValues);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className=" border border-gray-300 p-4 rounded-lg mx-2 shadow-md">
      <CategorizedForm
        categoryValues={categoryValues}
        categories={blueprintForms}
      />
    </div>
  );
}

export default page;
