import PageHeader from "@/components/LayoutContent/PageHeader";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeader
        headerTitle="Quiz Managent"
        renderRight={() => {
          return <Button>Create Quiz</Button>;
        }}
      />
    </div>
  );
};

export default page;
