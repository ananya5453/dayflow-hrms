from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    # Deliberately vague error -- don't reveal whether the email exists or not
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # These claims get embedded in the token and are readable on every future
    # request via get_jwt(), without hitting the database again.
    additional_claims = {
        "role": user.role,
        "employee_id": user.employee.id if user.employee else None,
    }
    token = create_access_token(identity=str(user.id), additional_claims=additional_claims)

    return jsonify({
        "token": token,
        "user": user.to_dict(),
        "employee": user.employee.to_dict() if user.employee else None,
    }), 200
