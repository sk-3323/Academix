import { sendContactus } from "@/helpers/sendContactUs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { name, email, message } = await req.json();
    const res = await sendContactus(email, name, message);

    if (res.status) {
      return NextResponse.json(res);
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ message: "error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
