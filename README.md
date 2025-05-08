# Student Vaccination Management System

This project is a **Student Vaccination Management System** built using **React** for the frontend and **Node.js**, **Express**, and **MongoDB** for the backend. It allows school coordinators to manage student vaccination records, vaccination drives, and generate reports.

---

## Features

- **Admin Login**: Secure login for administrators.
- **Dashboard**: View metrics like total students, vaccinated students, and upcoming vaccination drives.
- **Student Management**:
  - Add, edit, and delete student details.
  - Bulk upload student data via CSV files.
  - Update vaccination status for students.
- **Vaccination Management**:
  - Add, edit, and delete vaccination drives.
- **Reports**:
  - Filter and search student vaccination data.
  - Download vaccination reports as PDFs.

---

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (running locally or accessible via a connection string)

---

## Installation and Setup

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
2. Install dependencies: npm install
3. Create a .env file in the backend directory with the following content:
   PORT=3000
  NODE_ENV=development
  MONGO_URI=mongodb://localhost:27017/schoolVaccine
  JWT_SECRET=MySecretKey1028#
  LOG_LEVEL=info
4. To register the admin in the application run the command "npm run seed" . This command will generate admin record in your database.
5. Start the backend server: npm run dev
   The backend server will run on http://localhost:3000.
### Frontend Setup
1. Navigate to the vaccine directory: cd vaccine
2. Install dependencies: npm install
3. Create a .env file in the vaccine directory with the following content: PORT=3001
4. Start the frontend development server: npm start
   The frontend will run on http://localhost:3001.
### Usage
- Open the frontend in your browser at http://localhost:3001.
- Log in using the default admin credentials:
- Username: admin
- Password: admin
- Navigate through the application to manage students, vaccination drives, and generate reports.

### API Endpoints
### Backend API
  Admin Login: /admin/login
  Student Management:
    Get all students: /student
    Add a student: /student/add
    Edit a student: /student/:id
    Bulk upload students: /student/bulk-upload
  Vaccination Management:
    Get all vaccines: vaccine
    Add a vaccine: /vaccine/add
    Edit a vaccine: /vaccine/:id
    Get upcoming drives: /vaccine/upcoming
  Metrics: /metrics

### Deployment
  - Build the frontend for production: npm run build
  - The build files will be located in the vaccine/build directory.
  - Deploy the backend and frontend to your preferred hosting service.
### License
This project is licensed under the MIT License.

This `README.md` provides clear instructions for setting up and running the application, along with a list of features and API endpoints.This `README.md` provides clear instructions for setting up and running the application, along with a list of features and API endpoints.
