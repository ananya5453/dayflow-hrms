# Dayflow HRMS — Backend

Flask + SQLAlchemy + SQLite REST API.

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                 # creates instance/dayflow.db + demo accounts
python app.py                  # runs on http://localhost:5000
```

## Demo accounts (created by seed.py)

| Role     | Email                  | Password      |
|----------|-------------------------|---------------|
| Admin/HR | admin@dayflow.com       | Admin@123     |
| Employee | employee@dayflow.com    | Employee@123  |

## Auth

Every route except `/api/login` requires a header:
```
Authorization: Bearer <token>
```
Get the token from the `/api/login` response.

## Notes for the frontend teammate

- All error responses look like `{"error": "message"}` with an appropriate HTTP status (400/401/403/404).
- All success responses are plain JSON (object or array) with HTTP 200/201.
- Dates are `YYYY-MM-DD`, timestamps are ISO 8601.
- `employee_id` for the logged-in user is available in the `/api/login` response under `employee.id` — store this alongside the token.
- Role is stored/sent as `"admin"` for both Admin and HR Officer (they have identical permissions everywhere in the spec) — label it "Admin/HR" in the UI.
- Each employee has an auto-generated `employee_code` (e.g. `DFRANA20230001`) shown on their profile — it's read-only, never edited.

## Endpoints added since the first pass

- `POST /api/employees` (admin only) — onboards a new employee. Creates the login + profile + a zero'd payroll record together, and returns a `temporary_password` for HR to hand to the new hire.
- `PUT /api/employees/<id>` — employees can edit `phone`, `address`, `profile_picture_url` on their own profile; admins can edit any field on any profile.
- `PUT /api/leaves/<id>/approve` and `/reject` now accept an optional body: `{"comment": "..."}`, stored as `review_comment` on the leave.
- Approving a leave automatically writes `"leave"` attendance rows for every day in that leave's date range.
- Checking out automatically sets attendance status to `"present"` or `"half-day"` (currently: under 4 worked hours = half-day).
- Payroll fields now mirror the wireframe exactly: `basic_salary`, `hra`, `standard_allowance`, `performance_bonus`, `leave_travel_allowance`, `fixed_allowance`, `pf_employee`, `pf_employer`, `professional_tax`. The response also includes computed `gross_monthly`, `monthly_wage` (take-home), and `yearly_wage`.

## Known simplifications (intentional, for the 7-hour scope)

- `"absent"` isn't stored as a row for every non-working day — it's implied by the *absence* of an attendance record. A "days present vs. absent" report would need a small aggregation endpoint, not yet built.
- Leave approval doesn't yet recompute payroll based on unpaid days taken — the source PRD itself lists this under "Future Enhancements," so it's deliberately out of scope here.
