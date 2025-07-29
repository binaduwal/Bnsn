import { Activity, getActivitiesApi } from '@/services/activityApi';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function useActivities(limit: number = 10) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const res = await getActivitiesApi(limit);
      setActivities(res.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, activities, fetchActivities };
}

export default useActivities; 