from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(db.Model):
    """
    One row per login account. Holds credentials + role only.
    Profile details (name, department, etc.) live in Employee, linked 1-to-1.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "admin" or "employee"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # One user <-> one employee profile. cascade means deleting a user
    # also deletes their employee profile (keeps the DB from having orphans).
    employee = db.relationship(
        "Employee", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )

    def set_password(self, password):
        """Never store raw passwords -- store a salted hash instead."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        # Deliberately excludes password_hash -- never send that to the frontend.
        return {"id": self.id, "email": self.email, "role": self.role}
