from datetime import datetime
from extensions import db


class Attendance(db.Model):
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("employees.id"), nullable=False)
    date = db.Column(db.Date, nullable=False, default=lambda: datetime.utcnow().date())
    check_in = db.Column(db.DateTime, nullable=True)
    check_out = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default="absent")  # present / absent / half-day / leave
    work_hours = db.Column(db.Float, default=0.0)

    # A DB-level guarantee: one attendance row per employee per day, no duplicates possible
    __table_args__ = (db.UniqueConstraint("employee_id", "date", name="uq_employee_date"),)

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "date": self.date.isoformat(),
            "check_in": self.check_in.isoformat() if self.check_in else None,
            "check_out": self.check_out.isoformat() if self.check_out else None,
            "status": self.status,
            "work_hours": self.work_hours,
        }
