from dotenv import load_dotenv  # Load .env at the top
load_dotenv()

from app import create_app
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = create_app()


if __name__ == "__main__":
    
    print(f"FLASK_ENV------------------: {os.getenv('FLASK_ENV')}")

    FLASK_ENV = os.getenv("FLASK_ENV")

    if os.getenv("FLASK_ENV") == "development":
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Allow HTTP for local testing
        os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'  # Relax scope checks for testing
    
    logger.info(f"Starting the app in {FLASK_ENV} mode")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=(os.getenv("FLASK_ENV") == "development"))
    