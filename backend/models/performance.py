from datetime import datetime

from extensions import db


class Performance(db.Model):
    __tablename__ = "performance_reviews"

    id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(
        db.Integer,
        db.ForeignKey("employees.id"),
        nullable=False
    )

    review_period = db.Column(db.String(50), nullable=False)

    score = db.Column(db.Float, default=0.0)

    goals = db.Column(db.Text, default="")
    achievements = db.Column(db.Text, default="")
    manager_comments = db.Column(db.Text, default="")

    status = db.Column(
        db.String(20),
        default="draft"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "review_period": self.review_period,
            "score": self.score,
            "goals": self.goals,
            "achievements": self.achievements,
            "manager_comments": self.manager_comments,
            "status": self.status,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            ),
        }