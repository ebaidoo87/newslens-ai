from typing import Any


class AppException(Exception):

    def __init__(
        self,
        *,
        status_code: int,
        code: str,
        message: str,
        details: Any | None = None,
    ):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details

        super().__init__(message)


class NotFoundException(AppException):

    def __init__(
        self,
        message: str = "Resource not found",
        code: str = "NOT_FOUND",
    ):
        super().__init__(
            status_code=404,
            code=code,
            message=message,
        )


class BadRequestException(AppException):

    def __init__(
        self,
        message: str = "Bad request",
        code: str = "BAD_REQUEST",
    ):
        super().__init__(
            status_code=400,
            code=code,
            message=message,
        )


class UnauthorizedException(AppException):

    def __init__(
        self,
        message: str = "Authentication required",
        code: str = "UNAUTHORIZED",
    ):
        super().__init__(
            status_code=401,
            code=code,
            message=message,
        )


class ForbiddenException(AppException):

    def __init__(
        self,
        message: str = "Permission denied",
        code: str = "FORBIDDEN",
    ):
        super().__init__(
            status_code=403,
            code=code,
            message=message,
        )


class ConflictException(AppException):

    def __init__(
        self,
        message: str = "Resource conflict",
        code: str = "CONFLICT",
    ):
        super().__init__(
            status_code=409,
            code=code,
            message=message,
        )