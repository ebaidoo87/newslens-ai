from fastapi import Request
from fastapi.exceptions import (
    RequestValidationError,
)
from fastapi.responses import JSONResponse
from starlette.exceptions import (
    HTTPException as StarletteHTTPException,
)

from app.core.exceptions import (
    AppException,
)
from app.core.logging import logger


async def app_exception_handler(
    request: Request,
    exc: AppException,
):
    logger.warning(
        "Application error "
        "request_id=%s "
        "method=%s "
        "path=%s "
        "code=%s "
        "message=%s",
        get_request_id(request),
        request.method,
        request.url.path,
        exc.code,
        exc.message,
    )

    content = {
        "success": False,
        "error": {
            "code": exc.code,
            "message": exc.message,
        },
    }

    if exc.details is not None:
        content["error"][
            "details"
        ] = exc.details

    return JSONResponse(
        status_code=exc.status_code,
        content=content,
    )


async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
):
    logger.warning(
        "HTTP error "
        "request_id=%s "
        "method=%s "
        "path=%s "
        "status=%s",
        get_request_id(request),
        request.method,
        request.url.path,
        exc.status_code,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": (
                    f"HTTP_{exc.status_code}"
                ),
                "message": str(
                    exc.detail
                ),
            },
        },
        headers=exc.headers,
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    logger.warning(
        "Application error "
        "request_id=%s "
        "method=%s "
        "path=%s "
        "code=%s "
        "message=%s",
        get_request_id(request),
        request.method,
        request.url.path,
        exc.code,
        exc.message,
    )

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": (
                    "VALIDATION_ERROR"
                ),
                "message": (
                    "Request validation failed"
                ),
                "details": (
                    exc.errors()
                ),
            },
        },
    )


async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
):
    logger.exception(
        "Unhandled exception "
        "request_id=%s "
        "method=%s "
        "path=%s",
        get_request_id(request),
        request.method,
        request.url.path,
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": (
                    "INTERNAL_SERVER_ERROR"
                ),
                "message": (
                    "An unexpected error occurred"
                ),
            },
        },
    )

def get_request_id(
    request: Request,
) -> str:
    return getattr(
        request.state,
        "request_id",
        "unknown",
    )