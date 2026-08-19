import logging
import sys


LOG_FORMAT = (
    "%(asctime)s | "
    "%(levelname)s | "
    "%(name)s | "
    "%(message)s"
)


def configure_logging(
    level: str = "INFO",
) -> None:
    root_logger = (
        logging.getLogger()
    )

    root_logger.setLevel(
        level.upper()
    )

    if root_logger.handlers:
        root_logger.handlers.clear()

    handler = logging.StreamHandler(
        sys.stdout
    )

    formatter = logging.Formatter(
        LOG_FORMAT
    )

    handler.setFormatter(
        formatter
    )

    root_logger.addHandler(
        handler
    )


logger = logging.getLogger(
    "newslens"
)