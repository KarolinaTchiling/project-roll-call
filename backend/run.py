from dotenv import load_dotenv
load_dotenv()  # Load .env file

import os
from app import create_app
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
FRONTEND_URL = os.getenv("FRONTEND_URL")
FLASK_ENV = os.getenv("FLASK_ENV", "production")
PORT = int(os.getenv("PORT", 5000))

if not FRONTEND_URL:
    logger.warning("FRONTEND_URL is not set")

# Development-specific settings
if FLASK_ENV == "development":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Allow HTTP for local testing

os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'

# Initialize Flask app
app = create_app()

if __name__ == "__main__":
    logger.info(f"Starting the app in {FLASK_ENV} mode on port {PORT}")
    logger.info(f"Running with FRONTEND_URL set to: {FRONTEND_URL}")

    app.run(host="0.0.0.0", port=PORT, debug=(FLASK_ENV == "development"))
