from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, jwt

# Import every model so SQLAlchemy registers all tables
import models  # noqa: F401

# API routes
from routes.auth_routes import auth_bp
from routes.employee_routes import employee_bp
from routes.attendance_routes import attendance_bp
from routes.leave_routes import leave_bp
from routes.payroll_routes import payroll_bp
from routes.performance_routes import performance_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # --------------------------------------------------
    # Extensions
    # --------------------------------------------------

    db.init_app(app)
    jwt.init_app(app)

    # Allow React/Vite frontend to communicate with Flask
    CORS(app)

    # --------------------------------------------------
    # Register API routes
    # --------------------------------------------------

    app.register_blueprint(auth_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(leave_bp)
    app.register_blueprint(payroll_bp)
    app.register_blueprint(performance_bp)

    # --------------------------------------------------
    # Error handlers
    # --------------------------------------------------

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({
            "error": "Resource not found"
        }), 404

    @app.errorhandler(500)
    def server_error(_error):
        return jsonify({
            "error": "Internal server error"
        }), 500

    # --------------------------------------------------
    # JWT error handlers
    # --------------------------------------------------

    @jwt.unauthorized_loader
    def missing_token(_reason):
        return jsonify({
            "error": "Missing authentication token"
        }), 401

    @jwt.invalid_token_loader
    def invalid_token(_reason):
        return jsonify({
            "error": "Invalid or malformed token"
        }), 401

    @jwt.expired_token_loader
    def expired_token(_header, _payload):
        return jsonify({
            "error": "Session expired, please log in again"
        }), 401

    # --------------------------------------------------
    # Create database tables
    # --------------------------------------------------

    with app.app_context():
        db.create_all()

    return app


# ------------------------------------------------------
# Development server
# ------------------------------------------------------

if __name__ == "__main__":
    app = create_app()

    app.run(
        debug=True,
        port=5000
    )