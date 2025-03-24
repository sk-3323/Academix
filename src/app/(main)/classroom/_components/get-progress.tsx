import { Progress } from "@/components/ui/progress";
import { APIClient } from "@/helpers/apiHelper";
import React, { useEffect, useState } from "react";

const GetProgress = ({ enrollment }: { enrollment: any }) => {
  const [progress, setProgress] = useState(0);
  console.log(enrollment);
  const { courseId, userId } = enrollment;

  const api = new APIClient();
  const getProgressUser = async () => {
    try {
      const res: any = await api.get(
        `/course/with-progress?userId=${userId}&courseId=${courseId}`
      );
      console.log(res.progress);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProgressUser();
  }, []);
  return (
    <div>
      <Progress value={progress} className="w-full mr-2" />
      <span>{progress}%</span>
    </div>
  );
};

export default GetProgress;
