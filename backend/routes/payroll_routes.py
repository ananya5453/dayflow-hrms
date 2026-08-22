from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from extensions import db
from models.payroll import Payroll

payroll_bp = Blueprint("payroll", __name__)

NUMERIC_FIELDS = [
    "basic_salary", "hra", "standard_allowance", "performance_bonus",
    "leave_travel_allowance", "fixed_allowance",
    "pf_employee", "pf_employer", "professional_tax",
]


@payroll_bp.route("/api/payroll/<int:employee_id>", methods=["GET"])
@jwt_required()
def get_payroll(employee_id):
    claims = get_jwt()
    if claims.get("role") != "admin" and claims.get("employee_id") != employee_id:
        return jsonify({"error": "Forbidden"}), 403

    payroll = Payroll.query.filter_by(employee_id=employee_id).first()
    if not payroll:
        return jsonify({"error": "Payroll record not found"}), 404

    return jsonify(payroll.to_dict()), 200


@payroll_bp.route("/api/payroll/<int:employee_id>", methods=["PUT"])
@jwt_required()
def update_payroll(employee_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden: only admin/HR can update payroll"}), 403

    payroll = Payroll.query.filter_by(employee_id=employee_id).first()
    if not payroll:
        return jsonify({"error": "Payroll record not found"}), 404

    data = request.get_json(silent=True) or {}
    for field in NUMERIC_FIELDS:
        if field not in data:
            continue
        try:
            value = float(data[field])
        except (TypeError, ValueError):
            return jsonify({"error": f"{field} must be a number"}), 400
        if value < 0:
            return jsonify({"error": f"{field} cannot be negative"}), 400
        setattr(payroll, field, value)

    payroll.updated_by = int(get_jwt_identity())
    payroll.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(payroll.to_dict()), 200
