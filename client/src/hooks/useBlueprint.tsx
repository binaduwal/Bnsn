import { BlueprintProps, getAllBlueprintApi } from "@/services/blueprintApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function useBlueprint() {
  const [blueprints, setBlueprints] = useState<BlueprintProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlueprint();
  }, []);

  const fetchBlueprint = async () => {
    try {
      setIsLoading(true);
      const res = await getAllBlueprintApi();
      setBlueprints(res.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, blueprints, fetchBlueprint,setBlueprints };
}

export default useBlueprint;
