"use server";

import { prisma } from "@/lib/prisma";

export const getCertificate = async () => {
  const result = await prisma.certificate.findMany({
    // where: {
    //   courseId: courseId,
    // },
    include: {
      user: true,
      course: {
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
          instructor: true,
        },
      },
    },
  });
  return result;
};
