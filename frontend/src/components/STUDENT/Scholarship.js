import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import StudentSidebar from './StudentSidebar';
import './Scholarship.css';

const Scholarship = () => {
    const [studentData, setStudentData] = useState(null);
    const [transcript, setTranscript] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('scholarship');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Загружаем данные студента (где есть averageGrade)
                const studentResponse = await axios.get('http://localhost:8080/api/student/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Загружаем транскрипт с оценками
                const transcriptResponse = await axios.get('http://localhost:8080/api/exams/transcript', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setStudentData(studentResponse.data);
                setTranscript(transcriptResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка загрузки данных для расчета стипендии');
                setLoading(false);
                console.error('Ошибка:', err);
            }
        };

        fetchData();
    }, []);

    // Функция расчета стипендии
    const calculateScholarship = () => {
        if (!studentData || !studentData.averageGrade || !transcript || !transcript.exams) {
            return { amount: 0, status: 'Недостаточно данных' };
        }

        const hasLowGrades = transcript.exams.some(exam => exam.grade < 4);
        const averageGrade = studentData.averageGrade;

        if (hasLowGrades) {
            return { amount: 0, status: 'Не получает (есть оценки ниже 4)' };
        }

        if (averageGrade >= 4.5) {
            return { amount: 120, status: 'Повышенная стипендия' };
        } else if (averageGrade >= 4) {
            return { amount: 80, status: 'Базовая стипендия' };
        }

        return { amount: 0, status: 'Не получает' };
    };

    const scholarship = calculateScholarship();

    if (loading) return <div className="loading">Загрузка данных...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="page-container">
            <Header />

            <div className="content-container">
                <StudentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="scholarship-container">
                    <h2>Моя стипендия</h2>

                    <div className="scholarship-card">
                        <div className="scholarship-amount">
                            <span className="amount">{scholarship.amount}</span>
                            <span className="currency">руб.</span>
                        </div>
                        <div className={`scholarship-status ${scholarship.amount > 0 ? 'active' : 'inactive'}`}>
                            {scholarship.status}
                        </div>
                    </div>

                    <div className="grades-info">
                        <h3>Основание для расчета:</h3>
                        <p>Средний балл: <strong>{studentData.averageGrade || '—'}</strong></p>

                        {transcript && transcript.exams && (
                            <div className="grades-list">
                                <h4>Ваши оценки:</h4>
                                <ul>
                                    {transcript.exams.map((exam, index) => (
                                        <li key={index} className={`grade-item grade-${exam.grade}`}>
                                            <span className="subject">{exam.subject}</span>
                                            <span className="grade">{exam.grade}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scholarship;