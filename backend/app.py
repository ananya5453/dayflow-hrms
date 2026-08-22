from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, jwt
import models  # noqa: F401 -- importing this registers every table with SQLAlchemy

from routes.auth_routes import auth_bp
from routes.employee_routes import employee_bp
from routes.attendance_routes import attendance_bp
from routes.leave_routes import leave_bp
from routes.payroll_routes import payroll_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)  # allows the React dev server (different port) to call this API

    app.register_blueprint(auth_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(leave_bp)
    app.register_blueprint(payroll_bp)

    # Clear JSON errors instead of Flask's default HTML error pages
    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(_e):
        return jsonify({"error": "Internal server error"}), 500

    # Extra JWT error handlers -- without these, a missing/bad token returns
    # a confusing default error instead of a clean 401 JSON response.
    @jwt.unauthorized_loader
    def missing_token(_reason):
        return jsonify({"error": "Missing authentication token"}), 401

    @jwt.invalid_token_loader
    def invalid_token(_reason):
        return jsonify({"error": "Invalid or malformed token"}), 401

    @jwt.expired_token_loader
    def expired_token(_header, _payload):
        return jsonify({"error": "Session expired, please log in again"}), 401

    with app.app_context():
        db.create_all()  # creates tables if the sqlite file doesn't have them yet

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
