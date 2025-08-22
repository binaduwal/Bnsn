"use client";
import { CategorizedForm } from "@/components/CategorizedForm";
import { CategoryValue, getSingleBlueprintApi } from "@/services/blueprintApi";
import { Category } from "@/services/categoryApi";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

function page({ params }: { params: Promise<{ id: string }> }) {
  const id = use(params).id;

  const [blueprintForms, setBlueprintForms] = useState<Category[]>([]);
  const [categoryValues, setCategoryValues] = useState<CategoryValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlueprintData();
  }, []);

  const fetchBlueprintData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getSingleBlueprintApi(id);
      setBlueprintForms(res.data.categories);
      setCategoryValues(res.categoryValues);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" border border-gray-300 p-4 rounded-lg mx-2 shadow-md">
      <CategorizedForm
        loading={loading}
        categoryValues={categoryValues}
        categories={blueprintForms}
      />
    </div>
  );
}

export default page;
