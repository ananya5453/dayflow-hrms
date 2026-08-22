from datetime import date
from extensions import db


class Employee(db.Model):
    """HR profile info. Every employee (and admin) has exactly one of these."""
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)

    # Human-readable ID like "DFJODO20260001" -- generated once at creation,
    # never edited afterwards. See routes/employee_routes.py: generate_employee_code().
    employee_code = db.Column(db.String(30), unique=True, nullable=False)

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(50))
    designation = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    date_of_birth = db.Column(db.Date)
    date_of_joining = db.Column(db.Date, default=date.today)
    profile_picture_url = db.Column(db.String(300))

    user = db.relationship("User", back_populates="employee")

    # backref="employee" means Attendance/Leave rows can do record.employee to get here
    attendance_records = db.relationship(
        "Attendance", backref="employee", cascade="all, delete-orphan"
    )
    leave_requests = db.relationship(
        "Leave", backref="employee", cascade="all, delete-orphan"
    )
    payroll = db.relationship(
        "Payroll", backref="employee", uselist=False, cascade="all, delete-orphan"
    )

    def to_dict(self, include_account_info=True):
        data = {
            "id": self.id,
            "employee_code": self.employee_code,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "department": self.department,
            "designation": self.designation,
            "phone": self.phone,
            "address": self.address,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "date_of_joining": self.date_of_joining.isoformat() if self.date_of_joining else None,
            "profile_picture_url": self.profile_picture_url,
        }
        if include_account_info and self.user:
            data["email"] = self.user.email
            data["role"] = self.user.role
        return data
