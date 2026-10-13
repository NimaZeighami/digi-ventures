export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_SERVER_ERROR",
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "ورودی‌های ارسالی معتبر نیستند.", details?: Record<string, string[]>) {
    super(message, 422, "VALIDATION_FAILED", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "لطفاً ابتدا وارد حساب کاربری خود شوید.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "شما مجوز لازم برای انجام این عملیات را ندارید.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "مورد درخواستی یافت نشد.") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "تداخل در وضعیت اطلاعات رخ داده است.") {
    super(message, 409, "CONFLICT");
  }
}

export class InvalidTransitionError extends AppError {
  constructor(message: string = "امکان تغییر وضعیت درخواستی وجود ندارد.") {
    super(message, 409, "INVALID_TRANSITION");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً کمی صبر کنید.") {
    super(message, 429, "RATE_LIMITED");
  }
}

export const TooManyRequestsError = RateLimitError;
export type TooManyRequestsError = RateLimitError;

export class FileUploadError extends AppError {
  constructor(message: string = "فایل بارگذاری شده نامعتبر است.", statusCode: number = 415) {
    super(message, statusCode, "UPLOAD_REJECTED");
  }
}

export class InternalError extends AppError {
  constructor(message: string = "خطای غیرمنتظره در سمت سرور رخ داد.") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}
