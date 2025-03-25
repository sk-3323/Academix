import { Progress } from "@/components/ui/progress";
import { APIClient } from "@/helpers/apiHelper";
import React, { useEffect, useState } from "react";

const GetProgress = ({
  enrollment,
  totalProgress,
  onProgressUpdate,
}: {
  enrollment: any;
  totalProgress: number;
  onProgressUpdate: (progress: any) => void; // Callback function to update the total progress state in the parent component.
}) => {
  const [progress, setProgress] = useState(0);
  const { courseId, userId } = enrollment;
  const api = new APIClient();
  const getProgressUser = async () => {
    try {
      const res: any = await api.get(
        `/course/with-progress?userId=${userId}&courseId=${courseId}`
      );
      setProgress(res.progress);
      onProgressUpdate((prev: any) => prev + res.progress);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProgressUser();
  }, []);
  console.log(totalProgress);

  return (
    <div className="w-full">
      <Progress value={progress} className="w-full mr-2" />
      <span>{progress}%</span>
    </div>
  );
};

export default GetProgress;
