import PageHeader from "@/components/LayoutContent/PageHeader";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeader
        headerTitle="Course Managent"
        renderRight={() => {
          return <Button>Add Course</Button>;
        }}
      />
    </div>
  );
};

export default page;
