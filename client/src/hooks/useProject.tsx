import { getAllProjectApi, Project } from '@/services/projectApi';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

function useProject() {

     const [projects, setProjects] = useState<Project[]>([]);
      const [isLoading, setIsLoading] = useState(true);
    
    
      useEffect(() => {
        fetchAllProjects()
      }, [])
    
      const fetchAllProjects = async () =>{
        setIsLoading(true);
        try {
          const res = await getAllProjectApi()
          setProjects(res.data)
        } catch (error:any) {
          toast.error(error.message)
        } finally {
          setIsLoading(false);
        }
      }

  return {
    isLoading,
    projects,
    fetchAllProjects
  }
}

export default useProject