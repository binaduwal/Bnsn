import { allCategoryApi, Category } from "@/services/categoryApi";
import React, { useEffect } from "react";

function useCategory({ type, level }: { type: string; level: number }) {
  const [category, setCategory] = React.useState<Category[]>([]);

  useEffect(() => {
    fetchCategory();
  }, [type, level]);
  const fetchCategory = async () => {
    const res = await allCategoryApi(type, level);
    setCategory(res.data);
  };

  return { category };
}

export default useCategory;
