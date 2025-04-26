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
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/profile" element={<MyProfileStudent />} />
                <Route path="/session" element={<StudentSession />} />
                <Route path="/student/all" element={<AllStudents />} />
                <Route path="/scholarship" element={<Scholarship />} />
                <Route path="/group" element={<Group />} />
                <Route path="/schedule" element={<MySchedule />} />

            </Routes>
        </Router>
    );
}

export default App;