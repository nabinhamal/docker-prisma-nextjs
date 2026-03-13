import { Prisma } from "@/prisma/generated/prisma/client";

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = "INTERNAL_ERROR",
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export type ServerActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

export function handleError(error: unknown): ServerActionResult<never> {
  console.error("Global Error Handler:", error);

  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma Error Codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    switch (error.code) {
      case "P2002": {
        const target = (error.meta?.target as string[]) || [];
        return {
          success: false,
          error: `A record with this ${target.join(", ")} already exists.`,
          code: "DUPLICATE_ENTRY",
        };
      }
      case "P2025":
        return {
          success: false,
          error: "The requested record was not found.",
          code: "NOT_FOUND",
        };
      case "P2003":
        return {
          success: false,
          error: "Foreign key constraint failed. Related record not found.",
          code: "RELATION_ERROR",
        };
      default:
        return {
          success: false,
          error: "A database error occurred.",
          code: `PRISMA_${error.code}`,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      success: false,
      error: "Invalid data provided to the database.",
      code: "VALIDATION_ERROR",
    };
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  
  return {
    success: false,
    error: message,
    code: "INTERNAL_ERROR",
  };
}
