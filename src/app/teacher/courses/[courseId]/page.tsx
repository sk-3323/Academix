"use client"

import { APIClient } from "@/helpers/apiHelper";
import { useEffect } from "react"
import { toast } from "sonner";

// let getCourses= async (courseId) =>{
//   try {
//     let api = new APIClient();
//       const formdata = new FormData();
      
//     let data: any = await api.get(`/api/course/${courseId}`);

//     return data;
//     if (data.status) {
//       toast.success(data.message);
//       setTimeout(() => {
//         router.push(`/teacher/courses/${data?.result?.id}`);
//       }, 100);
//     }
//   } catch (error: any) {
//     console.error(error);
//     return error;
//     toast.error(error.message);
//   }
// }

const CourseIdPage = ({params}:{params:{courseId:string}}) => {

  // useEffect(()=>{
  //  let
  // },[])

  return (
    <div>CourseIdPage :{params.courseId}</div>
  )
}

export default CourseIdPage