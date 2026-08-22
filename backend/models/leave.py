from datetime import datetime
from extensions import db


class Leave(db.Model):
    __tablename__ = "leaves"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("employees.id"), nullable=False)
    leave_type = db.Column(db.String(20), nullable=False)  # paid / sick / unpaid
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    remarks = db.Column(db.String(300))
    status = db.Column(db.String(20), default="pending")  # pending / approved / rejected
    applied_on = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    reviewed_on = db.Column(db.DateTime, nullable=True)
    review_comment = db.Column(db.String(300), nullable=True)  # HR's note when approving/rejecting

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "leave_type": self.leave_type,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "remarks": self.remarks,
            "status": self.status,
            "applied_on": self.applied_on.isoformat(),
            "reviewed_by": self.reviewed_by,
            "reviewed_on": self.reviewed_on.isoformat() if self.reviewed_on else None,
            "review_comment": self.review_comment,
        }
