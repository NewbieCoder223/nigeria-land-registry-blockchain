import logging
import os
from logging.handlers import RotatingFileHandler

class SovereignLogger:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SovereignLogger, cls).__new__(cls)
            cls._setup_logging()
        return cls._instance

    @staticmethod
    def _setup_logging():
        # Create logs directory if it doesn't exist
        log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)

        log_file = os.path.join(log_dir, 'sovereign.log')
        
        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] — %(name)s — %(message)s',
            handlers=[
                RotatingFileHandler(log_file, maxBytes=10**6, backupCount=5),
                logging.StreamHandler()
            ]
        )

    def get_logger(self, name):
        return logging.getLogger(name)

# Usage singleton
logger_service = SovereignLogger()
def get_logger(name):
    return logger_service.get_logger(name)
