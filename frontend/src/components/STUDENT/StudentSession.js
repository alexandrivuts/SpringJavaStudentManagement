import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import StudentSidebar from './StudentSidebar';
import './StudentSession.css';

const StudentSession = () => {
    const [transcript, setTranscript] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('session'); // Устанавливаем активную секцию

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/exams/transcript', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTranscript(response.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка загрузки данных сессии');
                setLoading(false);
                console.error('Ошибка:', err);
            }
        };

        fetchTranscript();
    }, []);

    if (loading) return <div className="loading">Загрузка данных сессии...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!transcript) return <div className="error">Данные сессии не найдены</div>;

    return (
        <div className="page-container">
            <Header />

            <div className="content-container">
                <StudentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="session-container">
                    <h2>Моя сессия: {transcript.courseName}</h2>

                    <div className="session-content">
                        <div className="session-header">
                            <span className="header-subject">Предмет</span>
                            <span className="header-grade">Оценка</span>
                        </div>

                        {transcript.exams.map((exam, index) => (
                            <div key={index} className="exam-row">
                                <span className="exam-subject">{exam.subject}</span>
                                <span className={`exam-grade grade-${exam.grade}`}>
                                    {exam.grade}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSession;