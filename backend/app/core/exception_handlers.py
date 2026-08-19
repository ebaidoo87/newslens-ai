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
        "Application error: %s %s - %s",
        request.method,
        request.url.path,
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
        "HTTP error: %s %s - %s",
        request.method,
        request.url.path,
        exc.detail,
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
        "Validation error: %s %s",
        request.method,
        request.url.path,
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
        "Unhandled exception: %s %s",
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