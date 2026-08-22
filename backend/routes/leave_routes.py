from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from extensions import db
from models.leave import Leave
from models.attendance import Attendance

leave_bp = Blueprint("leaves", __name__)

VALID_LEAVE_TYPES = {"paid", "sick", "unpaid"}


@leave_bp.route("/api/leaves", methods=["GET"])
@jwt_required()
def list_leaves():
    claims = get_jwt()
    if claims.get("role") == "admin":
        leaves = Leave.query.order_by(Leave.applied_on.desc()).all()
    else:
        leaves = (
            Leave.query.filter_by(employee_id=claims.get("employee_id"))
            .order_by(Leave.applied_on.desc())
            .all()
        )
    return jsonify([l.to_dict() for l in leaves]), 200


@leave_bp.route("/api/leaves", methods=["POST"])
@jwt_required()
def apply_leave():
    claims = get_jwt()
    employee_id = claims.get("employee_id")
    if not employee_id:
        return jsonify({"error": "No employee profile linked to this account"}), 400

    data = request.get_json(silent=True) or {}
    leave_type = data.get("leave_type")
    remarks = data.get("remarks", "")

    if leave_type not in VALID_LEAVE_TYPES:
        return jsonify({"error": f"leave_type must be one of {sorted(VALID_LEAVE_TYPES)}"}), 400

    try:
        start = datetime.strptime(data.get("start_date", ""), "%Y-%m-%d").date()
        end = datetime.strptime(data.get("end_date", ""), "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "start_date and end_date must be in YYYY-MM-DD format"}), 400

    if end < start:
        return jsonify({"error": "end_date cannot be before start_date"}), 400

    leave = Leave(
        employee_id=employee_id,
        leave_type=leave_type,
        start_date=start,
        end_date=end,
        remarks=remarks,
        status="pending",
    )
    db.session.add(leave)
    db.session.commit()
    return jsonify(leave.to_dict()), 201


def _mark_attendance_as_leave(employee_id, start_date, end_date):
    """
    When a leave is approved, stamp each day in the range as 'leave' in the
    attendance table -- unless the employee already has a check-in that day
    (e.g. they worked a half day before the leave was approved).
    """
    current = start_date
    while current <= end_date:
        record = Attendance.query.filter_by(employee_id=employee_id, date=current).first()
        if record:
            if not record.check_in:
                record.status = "leave"
        else:
            db.session.add(Attendance(employee_id=employee_id, date=current, status="leave"))
        current += timedelta(days=1)


def _review_leave(leave_id, new_status):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden: only admin/HR can review leave requests"}), 403

    leave = Leave.query.get(leave_id)
    if not leave:
        return jsonify({"error": "Leave request not found"}), 404
    if leave.status != "pending":
        return jsonify({"error": f"Leave request has already been {leave.status}"}), 400

    data = request.get_json(silent=True) or {}

    leave.status = new_status
    leave.reviewed_by = int(get_jwt_identity())
    leave.reviewed_on = datetime.utcnow()
    leave.review_comment = data.get("comment")

    if new_status == "approved":
        _mark_attendance_as_leave(leave.employee_id, leave.start_date, leave.end_date)

    db.session.commit()
    return jsonify(leave.to_dict()), 200


@leave_bp.route("/api/leaves/<int:leave_id>/approve", methods=["PUT"])
@jwt_required()
def approve_leave(leave_id):
    return _review_leave(leave_id, "approved")


@leave_bp.route("/api/leaves/<int:leave_id>/reject", methods=["PUT"])
@jwt_required()
def reject_leave(leave_id):
    return _review_leave(leave_id, "rejected")
