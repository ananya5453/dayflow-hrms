from datetime import datetime, date
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from extensions import db
from models.attendance import Attendance

attendance_bp = Blueprint("attendance", __name__)

# Below this many worked hours, a check-out is recorded as a half-day rather than present.
# Simple fixed rule for the hackathon -- a real system might read this from company settings.
HALF_DAY_THRESHOLD_HOURS = 4.0


@attendance_bp.route("/api/attendance/<int:employee_id>", methods=["GET"])
@jwt_required()
def get_attendance(employee_id):
    claims = get_jwt()
    if claims.get("role") != "admin" and claims.get("employee_id") != employee_id:
        return jsonify({"error": "Forbidden"}), 403

    records = (
        Attendance.query.filter_by(employee_id=employee_id)
        .order_by(Attendance.date.desc())
        .all()
    )
    return jsonify([r.to_dict() for r in records]), 200


@attendance_bp.route("/api/attendance/check-in", methods=["POST"])
@jwt_required()
def check_in():
    claims = get_jwt()
    employee_id = claims.get("employee_id")
    if not employee_id:
        return jsonify({"error": "No employee profile linked to this account"}), 400

    today = date.today()
    record = Attendance.query.filter_by(employee_id=employee_id, date=today).first()

    if record and record.check_in:
        return jsonify({"error": "Already checked in today"}), 400

    if not record:
        record = Attendance(employee_id=employee_id, date=today)
        db.session.add(record)

    record.check_in = datetime.utcnow()
    record.status = "present"
    db.session.commit()
    return jsonify(record.to_dict()), 200


@attendance_bp.route("/api/attendance/check-out", methods=["POST"])
@jwt_required()
def check_out():
    claims = get_jwt()
    employee_id = claims.get("employee_id")
    if not employee_id:
        return jsonify({"error": "No employee profile linked to this account"}), 400

    today = date.today()
    record = Attendance.query.filter_by(employee_id=employee_id, date=today).first()

    if not record or not record.check_in:
        return jsonify({"error": "You must check in before checking out"}), 400
    if record.check_out:
        return jsonify({"error": "Already checked out today"}), 400

    record.check_out = datetime.utcnow()
    worked_seconds = (record.check_out - record.check_in).total_seconds()
    record.work_hours = round(worked_seconds / 3600, 2)
    record.status = "present" if record.work_hours >= HALF_DAY_THRESHOLD_HOURS else "half-day"
    db.session.commit()
    return jsonify(record.to_dict()), 200
