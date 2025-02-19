import { redirect } from "next/navigation";

const page = () => {
  return redirect(`/teacher/dashboard`);
};

export default page;
