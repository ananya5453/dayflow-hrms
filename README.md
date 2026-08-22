# 🌐 DayFlow — Human Resource Management System

> **Every workday, perfectly aligned.**

DayFlow is a modern **Full-Stack Human Resource Management System (HRMS)** designed to digitize and streamline essential HR operations such as **employee management, attendance tracking, leave management, payroll visibility, and performance management**.

The platform provides separate capabilities for **Admin/HR officers** and **Employees** through secure authentication and **role-based access control**.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization

* Secure email/password authentication
* JWT-based authentication
* Password hashing
* Role-based access control
* Separate Admin/HR and Employee permissions
* Protected API routes
* Persistent login sessions

### 👥 Employee Management

Admin/HR users can:

* View employees
* Add new employees
* Update employee information
* Generate employee IDs
* Assign departments and designations
* View joining dates
* Search employees
* Filter employees by department and status
* Delete employee records

Employee information includes:

* Employee ID
* Name
* Email
* Department
* Designation
* Joining date
* Phone number
* Address
* Profile information

---

## ⏰ Attendance Management

DayFlow provides centralized attendance tracking with:

* Employee check-in
* Employee check-out
* Automatic working-hours calculation
* Attendance status tracking
* Present / Absent / Half Day / Leave status
* Date-based attendance records
* Employee attendance search
* Admin attendance monitoring
* Attendance summary

---

## 🏖️ Leave Management

Employees can submit leave requests while Admin/HR users can manage approvals.

### Leave Types

* Paid Leave
* Sick Leave
* Unpaid Leave

### Leave Status

* Pending
* Approved
* Rejected

### Workflow

```text
Employee
   │
   ▼
Submit Leave Request
   │
   ▼
Pending
   │
   ├───────────────┐
   ▼               ▼
Approved         Rejected
```

---

## 💰 Payroll Management

DayFlow provides centralized payroll visibility.

Features include:

* Employee salary information
* Payroll records
* Employee-associated payroll
* Admin payroll management
* Secure payroll access

---

## 📊 Performance Management

The performance module allows HR/Admin users to maintain employee performance records.

Planned capabilities include:

* Performance records
* Employee evaluations
* Performance tracking
* Performance history
* Performance analytics

---

# 📈 Dashboard

The DayFlow dashboard provides quick access to major HR operations:

```text
┌──────────────────────────────────────────┐
│                 DayFlow                  │
├──────────────────────────────────────────┤
│                                          │
│  👥 Employees       ⏰ Attendance        │
│                                          │
│  🏖️ Leave           💰 Payroll           │
│                                          │
│  📊 Performance     📈 Analytics         │
│                                          │
└──────────────────────────────────────────┘
```

The dashboard is designed to provide HR personnel with a centralized overview of workforce operations.

---

# 🏗️ System Architecture

```text
                    ┌────────────────────────┐
                    │       DayFlow UI       │
                    │      React + Vite      │
                    │     Tailwind CSS       │
                    └────────────┬───────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌────────────────────────┐
                    │     Flask Backend      │
                    │      Python API        │
                    └────────────┬───────────┘
                                 │
                      JWT Authentication
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │       SQLAlchemy       │
                    │        ORM             │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │        Database        │
                    │    SQLite / SQL DB     │
                    └────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| React.js     | User interface                  |
| Vite         | Frontend development/build tool |
| JavaScript   | Application logic               |
| Tailwind CSS | Styling                         |
| HTML5        | Structure                       |
| CSS3         | Custom styling                  |

## Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Python             | Backend programming        |
| Flask              | REST API framework         |
| Flask-JWT-Extended | JWT authentication         |
| Flask-CORS         | Cross-origin communication |
| SQLAlchemy         | Database ORM               |

## Database

* SQLite for development
* SQLAlchemy-compatible databases for future deployment

## Development Tools

* Visual Studio Code
* Git
* GitHub
* PowerShell
* npm
* Python Virtual Environment

---

# 📁 Project Structure

```text
dayflow-hrms/
│
├── backend/
│   │
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── requirements.txt
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── employee.py
│   │   ├── payroll.py
│   │   └── performance.py
│   │
│   └── routes/
│       ├── auth_routes.py
│       ├── employee_routes.py
│       ├── attendance_routes.py
│       ├── leave_routes.py
│       ├── payroll_routes.py
│       └── performance_routes.py
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Input.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Leave.jsx
│   │   │   ├── Payroll.jsx
│   │   │   └── Performance.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/ananya5453/dayflow-hrms.git
```

Navigate into the project:

```bash
cd dayflow-hrms
```

---

# 🔧 Backend Setup

Navigate to the backend:

```powershell
cd backend
```

### Create a Virtual Environment

Windows:

```powershell
python -m venv venv
```

### Activate the Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

### Install Dependencies

```powershell
pip install -r requirements.txt
```

### Start the Flask Server

```powershell
python app.py
```

The backend will normally run at:

```text
http://127.0.0.1:5000
```

---

# 💻 Frontend Setup

Open a **new terminal**.

Navigate to the frontend:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🔑 Authentication Flow

DayFlow uses JWT-based authentication.

```text
User
 │
 ▼
Login
 │
 ▼
Flask validates credentials
 │
 ▼
JWT token generated
 │
 ▼
Frontend stores token
 │
 ▼
Protected API request
 │
 │ Authorization: Bearer <token>
 ▼
Flask validates JWT
 │
 ▼
Access granted
```

---

# 👤 User Roles

## 👨‍💼 Admin / HR

Administrators can:

* View employees
* Add employees
* Update employee information
* Delete employees
* View attendance
* Manage leave requests
* View payroll
* Manage performance information
* Access administrative functionality

## 👨‍💻 Employee

Employees have restricted access and can:

* Access their account
* View their information
* Check in/out
* View attendance
* Submit leave requests
* Track leave status
* View permitted payroll information

---

# 🔌 API Endpoints

## Authentication

```http
POST /api/login
```

---

## Employees

```http
GET    /api/employees
POST   /api/employees
GET    /api/employees/<employee_id>
PUT    /api/employees/<employee_id>
DELETE /api/employees/<employee_id>
```

---

## Attendance

```http
POST /api/attendance/check-in
POST /api/attendance/check-out
GET  /api/attendance/<employee_id>
```

---

## Leave

```http
GET  /api/leaves
POST /api/leaves
PUT  /api/leaves/<leave_id>
```

---

## Payroll

```http
GET /api/payroll
```

---

## Performance

```http
GET  /api/performance
POST /api/performance
```

---

# 🔒 Security

DayFlow implements multiple security mechanisms:

* JWT authentication
* Password hashing
* Protected API endpoints
* Role-based authorization
* Admin-only employee management
* Employee-specific access restrictions
* CORS configuration
* Token-based API authorization

Sensitive operations are protected using authentication and authorization checks.

---

# 🎯 Problem Statement

Traditional HR processes often rely on:

* Manual attendance records
* Scattered employee information
* Paper-based leave requests
* Limited payroll visibility
* Slow approval workflows
* Lack of centralized workforce information

These processes can result in:

* Increased administrative workload
* Data inconsistency
* Delayed approvals
* Poor workforce visibility
* Difficulty accessing employee records

### 💡 Our Solution

DayFlow brings essential HR operations into a **single centralized digital platform**.

```text
Employee Data
      │
      ├── Attendance
      │
      ├── Leave
      │
      ├── Payroll
      │
      └── Performance
              │
              ▼
        ┌─────────────┐
        │   DayFlow   │
        │    HRMS     │
        └─────────────┘
              │
              ▼
       Better HR Operations
```

---

# 🌟 Future Enhancements

The platform can be extended with:

### 📧 Communication

* Email verification
* Email notifications
* Leave approval notifications
* Automated HR alerts

### 📄 Documents

* Salary-slip generation
* Employee document management
* Profile picture uploads

### 📊 Analytics

* Attendance analytics
* Payroll analytics
* HR analytics dashboard
* Department-wise workforce analytics
* Monthly/weekly reports

### 🤖 AI-Powered HR

Future versions of DayFlow aim to introduce intelligent HR capabilities such as:

* Employee attrition-risk prediction
* Attendance anomaly detection
* Performance trend analysis
* Workforce forecasting
* Smart HR recommendations
* Automated HR report generation

### ☁️ Deployment

* Cloud deployment
* Production database
* CI/CD pipeline
* Mobile-responsive interface
* Scalable backend infrastructure

---

# 📸 Application Modules

| Module         | Purpose                              |
| -------------- | ------------------------------------ |
| 🏠 Dashboard   | HR overview                          |
| 👥 Employees   | Employee management                  |
| ⏰ Attendance   | Check-in/out and attendance tracking |
| 🏖️ Leave      | Leave requests and approvals         |
| 💰 Payroll     | Salary and payroll information       |
| 📊 Performance | Employee performance management      |

---

# 🚀 Future Vision

DayFlow aims to evolve from a traditional HR management system into an **intelligent workforce management platform**.

The long-term vision includes:

```text
                 DAYFLOW
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    HR Management  Analytics    AI
        │           │           │
        ▼           ▼           ▼
   Automation   Insights    Predictions
        │           │           │
        └───────────┼───────────┘
                    ▼
          Intelligent Workforce
             Management
```

The goal is to help organizations move from **manual HR operations to data-driven and intelligent workforce management**.

---

# 👨‍💻 Development

Built using:

**React + Vite + Tailwind CSS + Flask + SQLAlchemy + JWT**

DayFlow was developed as a **full-stack HRMS project for educational and hackathon purposes**.

---

# 📄 License

This project is developed for **educational and hackathon purposes**.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**DayFlow — Every workday, perfectly aligned.**
