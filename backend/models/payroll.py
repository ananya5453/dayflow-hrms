from datetime import datetime
from extensions import db


class Payroll(db.Model):
    """
    Salary structure for one employee. Field names mirror the wireframe's
    Salary Info tab so the frontend can bind directly without translating.
    """
    __tablename__ = "payroll"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("employees.id"), unique=True, nullable=False)

    # Earnings (each is a monthly amount)
    basic_salary = db.Column(db.Float, default=0.0)
    hra = db.Column(db.Float, default=0.0)                       # House Rent Allowance
    standard_allowance = db.Column(db.Float, default=0.0)
    performance_bonus = db.Column(db.Float, default=0.0)
    leave_travel_allowance = db.Column(db.Float, default=0.0)
    fixed_allowance = db.Column(db.Float, default=0.0)

    # Deductions / contributions
    pf_employee = db.Column(db.Float, default=0.0)   # deducted from employee's take-home
    pf_employer = db.Column(db.Float, default=0.0)    # company cost, not deducted from wage
    professional_tax = db.Column(db.Float, default=0.0)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    @property
    def gross_monthly(self):
        return round(
            self.basic_salary + self.hra + self.standard_allowance
            + self.performance_bonus + self.leave_travel_allowance + self.fixed_allowance,
            2,
        )

    @property
    def monthly_wage(self):
        """Take-home pay: gross earnings minus employee-side deductions.
        Employer PF is a company cost, so it does NOT reduce take-home pay."""
        return round(self.gross_monthly - self.pf_employee - self.professional_tax, 2)

    @property
    def yearly_wage(self):
        return round(self.monthly_wage * 12, 2)

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "basic_salary": self.basic_salary,
            "hra": self.hra,
            "standard_allowance": self.standard_allowance,
            "performance_bonus": self.performance_bonus,
            "leave_travel_allowance": self.leave_travel_allowance,
            "fixed_allowance": self.fixed_allowance,
            "pf_employee": self.pf_employee,
            "pf_employer": self.pf_employer,
            "professional_tax": self.professional_tax,
            "gross_monthly": self.gross_monthly,
            "monthly_wage": self.monthly_wage,
            "yearly_wage": self.yearly_wage,
            "updated_at": self.updated_at.isoformat(),
        }
