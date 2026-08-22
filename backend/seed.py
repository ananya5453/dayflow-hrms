"""
Run this once after creating the venv and installing requirements:
    python seed.py

Creates a demo admin/HR account and a demo employee account so the rest of
the team has something to log in with right away.
"""
from datetime import date
from app import create_app
from extensions import db
from models.user import User
from models.employee import Employee
from models.payroll import Payroll
from routes.employee_routes import generate_employee_code

app = create_app()

with app.app_context():
    if User.query.first():
        print("Database already has data -- skipping seed.")
    else:
        # --- Admin / HR account ---
        admin_user = User(email="admin@dayflow.com", role="admin")
        admin_user.set_password("Admin@123")
        db.session.add(admin_user)
        db.session.flush()  # gets admin_user.id without committing yet

        admin_join_date = date(2022, 3, 1)
        admin_employee = Employee(
            user_id=admin_user.id,
            employee_code=generate_employee_code("Asha", "Rao", admin_join_date),
            first_name="Asha",
            last_name="Rao",
            department="Human Resources",
            designation="HR Manager",
            date_of_joining=admin_join_date,
        )
        db.session.add(admin_employee)
        db.session.flush()
        db.session.add(Payroll(
            employee_id=admin_employee.id,
            basic_salary=60000, hra=18000, standard_allowance=4000,
            performance_bonus=5000, leave_travel_allowance=2000, fixed_allowance=1500,
            pf_employee=3600, pf_employer=3600, professional_tax=200,
        ))

        # --- Regular employee account ---
        emp_user = User(email="employee@dayflow.com", role="employee")
        emp_user.set_password("Employee@123")
        db.session.add(emp_user)
        db.session.flush()

        emp_join_date = date(2023, 6, 15)
        employee = Employee(
            user_id=emp_user.id,
            employee_code=generate_employee_code("Rahul", "Nair", emp_join_date),
            first_name="Rahul",
            last_name="Nair",
            department="Engineering",
            designation="Software Engineer",
            date_of_joining=emp_join_date,
        )
        db.session.add(employee)
        db.session.flush()

        db.session.add(Payroll(
            employee_id=employee.id,
            basic_salary=40000, hra=12000, standard_allowance=2500,
            performance_bonus=0, leave_travel_allowance=1500, fixed_allowance=1000,
            pf_employee=2400, pf_employer=2400, professional_tax=200,
        ))

        db.session.commit()
        print("Seed data created.")
        print(f"  Admin login:    admin@dayflow.com / Admin@123    (employee_code={admin_employee.employee_code})")
        print(f"  Employee login: employee@dayflow.com / Employee@123 (employee_code={employee.employee_code})")
