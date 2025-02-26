import { NextRequest, NextResponse } from "next/server";


export class ErrorHandler extends Error {
  status: number;

  constructor(message: string = "Internal Server Error", status: number = 500) {
    super(message);
    this.status = status;
  }
}

type HandlerFunction = (
  req: NextRequest,
  content: any
) => Promise<NextResponse>;

export function apiHandler(handler: HandlerFunction) {
  return async (req: NextRequest, content?: any): Promise<NextResponse> => {
    try {
      return await handler(req, content);
    } catch (error: any) {
      console.error("API Error:", error);

      // IMPORTANT FOR LOGGING ERROR IN LOGS FOLDER (UNCOMMENT WHEN PUSHING TO PROD)
      // logger.error({ status: error.status, message: error?.stack || error?.message });

      if (error?.code === 11000) {
        const err = Object.keys(error?.keyPattern).join(",");
        error.message = `Duplicate field - ${err}`;
        error.status = 400;
      }

      if (error?.name === "CastError") {
        const errorPath = error?.path;
        error.message = `Invalid Format of ${errorPath}`;
        error.status = 400;
      }

      if (error?.code === "P2003") {
        const tableName = error?.meta?.modelName || "Unknown table";
        const columnName = error?.meta?.field_name || "Unknown column";
        error.message = `Foreign key constraint violation on table: ${tableName}, column: ${columnName}`;
        error.status = 400;
      }

      if (error?.code === "P2002") {
        const fields = error?.meta?.target || [];
        if (Array.isArray(fields)) {
          error.message = `Unique key constraint violation in fields: ${fields?.join(
            ", "
          )}`;
        } else {
          error.message = `Unique key constraint violation in fields: ${fields}`;
        }
        error.status = 400;
      }

      if (error?.name === "PrismaClientValidationError") {
        error.message = `Invalid fields provided: ${
          error.message.split("Unknown argument")[1]?.trim()?.split("`")[1] ||
          "Unknown field"
        }`;
      }

      return NextResponse.json(
        {
          status: false,
          message: error.message || "Internal Server Error",
        },
        { status: error.status || 500 }
      );
    }
  };
}
