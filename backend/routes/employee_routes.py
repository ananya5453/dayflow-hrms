import secrets
import string
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from extensions import db
from models.employee import Employee
from models.user import User
from models.payroll import Payroll

employee_bp = Blueprint("employees", __name__)

COMPANY_CODE = "DF"  # short code for Dayflow -- change if your company name differs

# Fields an employee is allowed to change on their own profile
EMPLOYEE_EDITABLE_FIELDS = ["phone", "address", "profile_picture_url"]
# Additional fields only an admin/HR can change
ADMIN_ONLY_FIELDS = ["first_name", "last_name", "department", "designation", "date_of_birth"]


def generate_employee_code(first_name, last_name, joining_date):
    """
    Builds an ID like DFJODO20260001, following the team's wireframe format:
    [Company code][first 2 letters of first name + first 2 letters of last name][year][4-digit serial]
    """
    initials = (first_name[:2] + last_name[:2]).upper()
    year = joining_date.year
    # Count existing employees who joined the same year, to pick the next serial number
    count_this_year = Employee.query.filter(
        db.extract("year", Employee.date_of_joining) == year
    ).count()
    serial = str(count_this_year + 1).zfill(4)
    return f"{COMPANY_CODE}{initials}{year}{serial}"


def generate_temp_password(length=10):
    """Random password for a newly onboarded employee. They should change it after first login."""
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


@employee_bp.route("/api/employees", methods=["GET"])
@jwt_required()
def list_employees():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden: admin/HR only"}), 403

    employees = Employee.query.all()
    return jsonify([e.to_dict() for e in employees]), 200


@employee_bp.route("/api/employees/<int:employee_id>", methods=["GET"])
@jwt_required()
def get_employee(employee_id):
    claims = get_jwt()
    if claims.get("role") != "admin" and claims.get("employee_id") != employee_id:
        return jsonify({"error": "Forbidden: cannot view another employee's profile"}), 403

    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    return jsonify(employee.to_dict()), 200


@employee_bp.route("/api/employees", methods=["POST"])
@jwt_required()
def create_employee():
    """
    Onboards a new employee: creates the login account, the HR profile, and an
    empty payroll record together. Admin/HR only -- mirrors the wireframe's
    'HR officer registers a new employee' Sign Up flow.
    """
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden: only admin/HR can add employees"}), 403

    data = request.get_json(silent=True) or {}
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    role = data.get("role", "employee")

    if not first_name or not last_name:
        return jsonify({"error": "first_name and last_name are required"}), 400
    if not email:
        return jsonify({"error": "email is required"}), 400
    if role not in ("admin", "employee"):
        return jsonify({"error": "role must be 'admin' or 'employee'"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists"}), 400

    from datetime import datetime
    joining_date_str = data.get("date_of_joining")
    try:
        joining_date = (
            datetime.strptime(joining_date_str, "%Y-%m-%d").date()
            if joining_date_str else datetime.utcnow().date()
        )
    except ValueError:
        return jsonify({"error": "date_of_joining must be in YYYY-MM-DD format"}), 400

    temp_password = generate_temp_password()

    user = User(email=email, role=role)
    user.set_password(temp_password)
    db.session.add(user)
    db.session.flush()  # get user.id before creating the employee row

    employee = Employee(
        user_id=user.id,
        employee_code=generate_employee_code(first_name, last_name, joining_date),
        first_name=first_name,
        last_name=last_name,
        department=data.get("department"),
        designation=data.get("designation"),
        phone=data.get("phone"),
        address=data.get("address"),
        date_of_joining=joining_date,
    )
    db.session.add(employee)
    db.session.flush()

    # Every employee gets a payroll row (starts at zero, HR fills it in via PUT /api/payroll/<id>)
    db.session.add(Payroll(employee_id=employee.id))

    db.session.commit()

    return jsonify({
        "employee": employee.to_dict(),
        "temporary_password": temp_password,  # HR shares this with the new hire out-of-band
    }), 201


@employee_bp.route("/api/employees/<int:employee_id>", methods=["PUT"])
@jwt_required()
def update_employee(employee_id):
    """
    Employees can edit their own contact fields only.
    Admin/HR can edit any employee's full profile.
    """
    claims = get_jwt()
    is_admin = claims.get("role") == "admin"
    is_self = claims.get("employee_id") == employee_id

    if not is_admin and not is_self:
        return jsonify({"error": "Forbidden: cannot edit another employee's profile"}), 403

    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    data = request.get_json(silent=True) or {}
    allowed_fields = EMPLOYEE_EDITABLE_FIELDS + (ADMIN_ONLY_FIELDS if is_admin else [])

    rejected_fields = [f for f in data.keys() if f not in allowed_fields]
    if rejected_fields and not is_admin:
        return jsonify({
            "error": f"You can only edit {EMPLOYEE_EDITABLE_FIELDS}. "
                     f"Not allowed to edit: {rejected_fields}"
        }), 403

    from datetime import datetime
    for field in allowed_fields:
        if field not in data:
            continue
        value = data[field]
        if field == "date_of_birth" and value:
            try:
                value = datetime.strptime(value, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "date_of_birth must be in YYYY-MM-DD format"}), 400
        setattr(employee, field, value)

    db.session.commit()
    return jsonify(employee.to_dict()), 200
