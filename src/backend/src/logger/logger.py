import logging
import os

APP_LOGGER_NAME = "logger" # TODO: Change this to the name of the application
APP_LOG_FILE = "log.log" # TODO: Change this to the name of the application

def build_logger(logger_name = APP_LOGGER_NAME, filename = APP_LOG_FILE, debug = False):
    """Build a new logger object, set up with all the proper settings for both console and file logging"""

    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter('[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s', datefmt="%m/%d/%y %H:%M:%S")

    # Create console handler and set level to debug
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG if debug else logging.INFO)
    console_handler.setFormatter(formatter)

    # Create file handler and set level to warning
    file_handler = logging.FileHandler(filename)
    file_handler.setLevel(logging.WARNING)
    file_handler.setFormatter(formatter)

    # Add console and file handlers to logger
    logger.handlers.clear()
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger
