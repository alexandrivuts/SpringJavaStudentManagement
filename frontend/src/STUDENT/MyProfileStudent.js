import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StudentSidebar from '../components/StudentSidebar';
import '../styles/MyProfileStudent.css';

const MyProfileStudent = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/student/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStudentData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Не удалось загрузить данные профиля');
                setLoading(false);
                console.error('Ошибка загрузки:', err);
                if (err.response?.status === 403) {
                    navigate('/');
                }
            }
        };

        fetchStudentData();
    }, [navigate]);

    if (loading) return <div className="loading">Загрузка профиля...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!studentData) return <div className="error">Данные профиля не найдены</div>;

    return (
        <div className="profile-container">
            <Header studentData={studentData} />

            <div className="profile-content">
                <StudentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="profile-main">
                    <div className="student-info">
                        <h2>{studentData.surname} {studentData.name}</h2>
                        <p>Студент {studentData.course} курса</p>
                        <p>Факультет {studentData.faculty}, {studentData.specialization}</p>
                        <p>Дата рождения: {studentData.birthday}</p>
                    </div>

                    <div className="student-details">
                        <div className="detail-row">
                            <span className="detail-label">Группа:</span>
                            <span className="detail-value">{studentData.groupNumber}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{studentData.email}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Телефон:</span>
                            <span className="detail-value">{studentData.phoneNumber}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Средний балл:</span>
                            <span className="detail-value">
        {studentData.averageGrade ? studentData.averageGrade : '-'}
    </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileStudent;