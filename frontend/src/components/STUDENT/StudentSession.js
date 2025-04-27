import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import StudentSidebar from './StudentSidebar';
import './StudentSession.css';

const StudentSession = () => {
    const [transcript, setTranscript] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('session');

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
                        <table className="session-table">
                            <thead>
                            <tr>
                                <th>Предмет</th>
                                <th>Оценка</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transcript.exams.map((exam, index) => (
                                <tr key={index}>
                                    <td>{exam.subject}</td>
                                    <td className={`exam-grade grade-${exam.grade}`}>
                                        {exam.grade}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSession;
