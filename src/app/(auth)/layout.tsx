"use client";

import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {

  return <LayoutContent>{children}</LayoutContent>;
};

export default RootLayout;
