import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # SQLite file lives in instance/dayflow.db — created automatically on first run
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'instance', 'dayflow.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # turns off a feature we don't need, saves memory

    # In a real app this would come from an environment variable / .env file.
    # For a hackathon, a hardcoded fallback is fine — just don't ship this to prod.
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dayflow-hackathon-dev-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
