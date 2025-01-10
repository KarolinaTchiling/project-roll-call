from flask import Flask, session
from datetime import timedelta
from flask_cors import CORS
from dotenv import load_dotenv
import os
from mongoengine import connect


def create_app():
    """
    App factory function to create and configure the Flask application.
    """
    # Load environment variables from `.env` file
    load_dotenv()

    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})
    app.secret_key = os.getenv("SECRET_KEY")

    app.config['SESSION_TYPE'] = 'filesystem'  # Use filesystem for local dev, or Redis for production
    app.config['SESSION_PERMANENT'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)  # Customize as needed
    app.config['SESSION_COOKIE_NAME'] = 'my_session'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

    
    # app.config['SESSION_PERMANENT'] = True
    # app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=31)
    # app.config['SECRET_KEY'] =  os.getenv("SECRET_KEY")

    # print(f"App initialized with secret key: {app.secret_key}") 

    # Initialize MongoEngine
    init_db()

    # Register Blueprints
    from app.routes.auth import auth
    app.register_blueprint(auth, url_prefix="/auth")

    from app.routes.calendar import cal
    app.register_blueprint(cal, url_prefix="/cal")

    from app.routes.gemini import gem
    app.register_blueprint(gem, url_prefix="/gem")

    from app.routes.reports import report
    app.register_blueprint(report, url_prefix="/report")

    from app.routes.settings import setting
    app.register_blueprint(setting, url_prefix="/setting")

    from app.routes.user import user
    app.register_blueprint(user, url_prefix="/user")

    return app


def init_db():
    """
    Initializes the MongoDB connection using MongoEngine.
    """
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DATABASE_NAME")

    if not mongo_uri:
        raise ValueError("MONGO_URI is not defined in the environment.")

    # Connect to the MongoDB using MongoEngine
    connect(
        db=db_name,
        host=mongo_uri,
    )