from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt

from extensions import db
from models.performance import Performance
from models.employee import Employee


performance_bp = Blueprint("performance", __name__)


def is_admin():
    return get_jwt().get("role") == "admin"


def get_current_employee_id():
    return get_jwt().get("employee_id")


@performance_bp.route("/api/performance", methods=["GET"])
@jwt_required()
def list_performance():
    if is_admin():
        reviews = (
            Performance.query
            .order_by(Performance.updated_at.desc())
            .all()
        )
    else:
        employee_id = get_current_employee_id()

        if not employee_id:
            return jsonify({
                "error": "No employee profile linked to this account"
            }), 400

        reviews = (
            Performance.query
            .filter_by(employee_id=employee_id)
            .order_by(Performance.updated_at.desc())
            .all()
        )

    return jsonify([
        review.to_dict()
        for review in reviews
    ]), 200


@performance_bp.route(
    "/api/performance/<int:employee_id>",
    methods=["GET"]
)
@jwt_required()
def get_employee_performance(employee_id):
    if not is_admin() and get_current_employee_id() != employee_id:
        return jsonify({
            "error": "Forbidden"
        }), 403

    employee = Employee.query.get(employee_id)

    if not employee:
        return jsonify({
            "error": "Employee not found"
        }), 404

    reviews = (
        Performance.query
        .filter_by(employee_id=employee_id)
        .order_by(Performance.updated_at.desc())
        .all()
    )

    return jsonify([
        review.to_dict()
        for review in reviews
    ]), 200


@performance_bp.route(
    "/api/performance",
    methods=["POST"]
)
@jwt_required()
def create_performance_review():
    if not is_admin():
        return jsonify({
            "error": "Forbidden: only admin/HR can create performance reviews"
        }), 403

    data = request.get_json(silent=True) or {}

    employee_id = data.get("employee_id")
    review_period = (
        data.get("review_period") or ""
    ).strip()

    if not employee_id:
        return jsonify({
            "error": "employee_id is required"
        }), 400

    if not review_period:
        return jsonify({
            "error": "review_period is required"
        }), 400

    employee = Employee.query.get(employee_id)

    if not employee:
        return jsonify({
            "error": "Employee not found"
        }), 404

    try:
        score = float(data.get("score", 0))
    except (TypeError, ValueError):
        return jsonify({
            "error": "score must be a number"
        }), 400

    if score < 0 or score > 100:
        return jsonify({
            "error": "score must be between 0 and 100"
        }), 400

    status = data.get("status", "draft")

    if status not in (
        "draft",
        "submitted",
        "completed"
    ):
        return jsonify({
            "error": "status must be draft, submitted, or completed"
        }), 400

    review = Performance(
        employee_id=employee_id,
        review_period=review_period,
        score=score,
        goals=data.get("goals", ""),
        achievements=data.get("achievements", ""),
        manager_comments=data.get("manager_comments", ""),
        status=status,
    )

    db.session.add(review)
    db.session.commit()

    return jsonify(review.to_dict()), 201


@performance_bp.route(
    "/api/performance/<int:review_id>",
    methods=["PUT"]
)
@jwt_required()
def update_performance_review(review_id):
    if not is_admin():
        return jsonify({
            "error": "Forbidden: only admin/HR can update performance reviews"
        }), 403

    review = Performance.query.get(review_id)

    if not review:
        return jsonify({
            "error": "Performance review not found"
        }), 404

    data = request.get_json(silent=True) or {}

    if "review_period" in data:
        review.review_period = (
            data["review_period"] or ""
        ).strip()

    if "score" in data:
        try:
            score = float(data["score"])
        except (TypeError, ValueError):
            return jsonify({
                "error": "score must be a number"
            }), 400

        if score < 0 or score > 100:
            return jsonify({
                "error": "score must be between 0 and 100"
            }), 400

        review.score = score

    if "goals" in data:
        review.goals = data["goals"] or ""

    if "achievements" in data:
        review.achievements = data["achievements"] or ""

    if "manager_comments" in data:
        review.manager_comments = (
            data["manager_comments"] or ""
        )

    if "status" in data:
        if data["status"] not in (
            "draft",
            "submitted",
            "completed"
        ):
            return jsonify({
                "error": "Invalid performance status"
            }), 400

        review.status = data["status"]

    review.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify(review.to_dict()), 200


@performance_bp.route(
    "/api/performance/<int:review_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_performance_review(review_id):
    if not is_admin():
        return jsonify({
            "error": "Forbidden: only admin/HR can delete performance reviews"
        }), 403

    review = Performance.query.get(review_id)

    if not review:
        return jsonify({
            "error": "Performance review not found"
        }), 404

    db.session.delete(review)
    db.session.commit()

    return jsonify({
        "message": "Performance review deleted successfully"
    }), 200