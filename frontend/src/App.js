import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/AUTH/LoginForm';
import MyProfileStudent from './components/STUDENT/MyProfileStudent';
import HomePage from "./components/HomePage";
import StudentSession from "./components/STUDENT/StudentSession";
import AllStudents from "./components/STUDENT/AllStudents";
import Scholarship from "./components/STUDENT/Scholarship";
import Group from "./components/STUDENT/Group";
import MySchedule from "./components/STUDENT/MySchedule";
import Schedule from "./components/GUEST/Schedule";
import Phone from "./components/GUEST/Phone";
import AdminProfile from "./components/ADMIN/AdminProfile";
import AdminAllStudents from "./components/ADMIN/AdminAllStudents";
import AddStudent from "./components/ADMIN/AddStudent";
import DeleteStudent from "./components/ADMIN/DeleteStudent";
import ManageExams from "./components/ADMIN/ManageExams";
import AddSession from "./components/ADMIN/AddSession";
import AddGroup from "./components/ADMIN/AddGroup";
import DeleteGroup from "./components/ADMIN/DeleteGroup";

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
            </Routes>
        </Router>
    );
}

export default App;