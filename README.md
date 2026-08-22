# Dayflow HRMS — Admin/HR Frontend

React + Vite + Tailwind frontend covering: login, dashboard, employees, employee
detail, attendance, leave approval, and payroll. Talks to the Flask backend
over the 9 endpoints your teammate is building — no hardcoded data anywhere.

## Setup

```bash
npm install
cp .env.example .env      # then set VITE_API_BASE_URL to the Flask server's URL
npm run dev
```

## How it's organized

- `src/api/client.js` — one axios instance, one function per backend endpoint.
  Every page imports from here instead of writing raw URLs, so if an endpoint
  path changes you fix it in one place.
- `src/context/AuthContext.jsx` — holds the logged-in user, exposes `login()`
  and `logout()`, persists to `localStorage` so a refresh doesn't log you out.
  This is also where role checking happens: only `admin` or `hr` roles are
  allowed in; anything else is rejected right after login.
- `src/components/ProtectedRoute.jsx` — wraps every page except `/login`.
  If there's no logged-in user it redirects to `/login`.
- `src/components/Layout.jsx`, `Sidebar.jsx`, `Topbar.jsx` — the shared shell
  (nav + header) so every page looks consistent.
- `src/components/EmployeeSelect.jsx` — a dropdown that loads the employee
  list once; reused by both the Attendance and Payroll pages since they both
  need "pick an employee first."
- `src/pages/*` — one file per screen, listed below.

## Pages

1. **Login** (`/login`) — validates email format + non-empty password client
   side, calls `POST /api/login`, shows the backend's error message on failure.
2. **Dashboard** (`/dashboard`) — pulls `GET /api/employees` and
   `GET /api/leaves` and derives counts (total employees, pending/approved/
   rejected leaves) instead of hardcoding numbers. Links to the other pages.
3. **Employees** (`/employees`) — table from `GET /api/employees` with a
   client-side search box (filters by name/email/department).
4. **Employee Detail** (`/employees/:id`) — `GET /api/employees/<id>`, plus
   quick-action links into that employee's attendance and payroll.
5. **Attendance** (`/attendance?employeeId=`) — since the backend's attendance
   endpoint is per-employee (`GET /api/attendance/<employee_id>`), this page
   starts with an employee picker, then shows their check-in/out history.
6. **Leave Approval** (`/leaves`) — the core workflow. `GET /api/leaves` lists
   every request; Approve/Reject buttons only show on `Pending` rows and call
   `PUT /api/leaves/<id>/approve` or `.../reject`. On success the row updates
   immediately in the UI (no full page reload) so it visually matches what the
   employee will see once they refresh their own view.
7. **Payroll** (`/payroll?employeeId=`) — same employee-picker pattern as
   Attendance. Loads `GET /api/payroll/<employee_id>`, lets HR edit basic
   salary / allowances / deductions with number validation (no negatives, no
   blanks), shows a live-computed net pay, and saves via
   `PUT /api/payroll/<employee_id>`.

## Role-based access

The employee-facing app is a separate piece your other teammate owns. This
frontend simply refuses to log in anyone whose `role` isn't `admin` or `hr`
(see `AuthContext.jsx`), and there is no UI anywhere in this app for an
employee to approve their own leave or edit their own salary — those actions
only exist on the HR pages behind login.

## One thing to confirm with your backend teammate

`AuthContext.jsx` assumes `POST /api/login` returns:
```json
{ "token": "...", "user": { "id": 1, "name": "...", "role": "hr" } }
```
If the real response shape differs, only that one function needs updating —
nothing else in the app depends on the exact login response format.
