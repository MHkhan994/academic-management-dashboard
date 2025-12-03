import { NextResponse } from "next/server";

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export class ApiErrorHandler {
  static badRequest(message: string, details?: any): NextResponse {
    return NextResponse.json(
      {
        error: {
          code: "BAD_REQUEST",
          message,
          details,
        },
      },
      { status: 400 }
    );
  }

  static notFound(message = "Resource not found"): NextResponse {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message,
        },
      },
      { status: 404 }
    );
  }

  static unauthorized(message = "Unauthorized"): NextResponse {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message,
        },
      },
      { status: 401 }
    );
  }

  static forbidden(message = "Forbidden"): NextResponse {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message,
        },
      },
      { status: 403 }
    );
  }

  static internalError(message = "Internal server error"): NextResponse {
    console.error("[API Error]", message);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }

  static methodNotAllowed(): NextResponse {
    return NextResponse.json(
      {
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Method not allowed",
        },
      },
      { status: 405 }
    );
  }
}

export function validateQueryParams(
  params: Record<string, any>,
  required: string[] = []
): ApiError | null {
  for (const param of required) {
    if (!params[param]) {
      return {
        code: "MISSING_PARAM",
        message: `Missing required parameter: ${param}`,
      };
    }
  }
  return null;
}
