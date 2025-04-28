import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './AUTH/LoginForm';
import MyProfileStudent from './STUDENT/MyProfileStudent';
import HomePage from "./GUEST/HomePage";
import StudentSession from "./STUDENT/StudentSession";
import AllStudents from "./STUDENT/AllStudents";
import Scholarship from "./STUDENT/Scholarship";
import Group from "./STUDENT/Group";
import MySchedule from "./STUDENT/MySchedule";
import Schedule from "./GUEST/Schedule";
import Phone from "./GUEST/Phone";
import AdminProfile from "./ADMIN/AdminProfile";
import AdminAllStudents from "./ADMIN/AdminAllStudents";
import AddStudent from "./ADMIN/AddStudent";
import DeleteStudent from "./ADMIN/DeleteStudent";
import ManageExams from "./ADMIN/ManageExams";
import AddSession from "./ADMIN/AddSession";
import AddGroup from "./ADMIN/AddGroup";
import DeleteGroup from "./ADMIN/DeleteGroup";
import AccountantProfile from "./ACCOUNTANT/AccountantProfile";
import AccountantAllStudents from "./ACCOUNTANT/AccountantAllStudents";
import Scholarships from "./ACCOUNTANT/Scholarships";
import EditScholarship from "./ACCOUNTANT/EditScholarship";
import ScholarshipReport from "./ACCOUNTANT/ScholarshipReport";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/profile" element={<MyProfileStudent />} />
                <Route path="/admin" element={<AdminProfile />} />
                <Route path="/session" element={<StudentSession />} />
                <Route path="/student/all" element={<AllStudents />} />
                <Route path="/scholarship" element={<Scholarship />} />
                <Route path="/group" element={<Group />} />
                <Route path="/my-schedule" element={<MySchedule />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/phone" element={<Phone />} />
                <Route path="/admin/students" element={<AdminAllStudents />} />
                <Route path="/admin/students/add" element={<AddStudent />} />
                <Route path="/admin/students/delete" element={<DeleteStudent />} />
                <Route path="/admin/session/edit" element={<ManageExams />} />
                <Route path="/admin/session/add" element={<AddSession />} />
                <Route path="/admin/groups/add" element={<AddGroup />} />
                <Route path="/admin/groups/delete" element={<DeleteGroup />} />
                <Route path="/accountant" element={<AccountantProfile />} />
                <Route path="/accountant/students" element={<AccountantAllStudents />} />
                <Route path="/accountant/scholarships" element={<Scholarships />} />
                <Route path="/accountant/scholarships/edit" element={<EditScholarship />} />
                <Route path="/accountant/report" element={<ScholarshipReport />} />

            </Routes>
        </Router>
    );
}

export default App;