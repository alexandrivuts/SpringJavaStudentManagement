import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import StudentSidebar from '../components/StudentSidebar';
import '../styles/Scholarship.css';

const Scholarship = () => {
    const [scholarshipData, setScholarshipData] = useState({
        averageGrade: null,
        scholarshipAmount: null
    });
    const [transcriptData, setTranscriptData] = useState({
        courseName: null,
        exams: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('scholarship');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Требуется авторизация');

            const [scholarshipRes, transcriptRes] = await Promise.all([
                axios.get('http://localhost:8080/api/grades/scholarship', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('http://localhost:8080/api/exams/transcript', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            setScholarshipData({
                averageGrade: scholarshipRes.data.averageGrade,
                scholarshipAmount: scholarshipRes.data.scholarshipAmount
            });

            setTranscriptData({
                courseName: transcriptRes.data.courseName,
                exams: transcriptRes.data.exams || []
            });

            setLoading(false);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            setError(err.response?.data?.message ||
                err.message ||
                'Ошибка загрузки данных');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="loading">Загрузка данных...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="page-container">
            <Header />
            <div className="content-container">
                <StudentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="scholarship-container">
                    <h2>Моя стипендия</h2>

                    <div className="scholarship-info">
                        <div className="scholarship-card">
                            <div className="amount">
                                {scholarshipData.scholarshipAmount !== null
                                    ? `${scholarshipData.scholarshipAmount} руб.`
                                    : 'Не назначена'}
                            </div>
                            <div className="average-grade">
                                Средний балл: <strong>
                                {scholarshipData.averageGrade !== null
                                    ? scholarshipData.averageGrade.toFixed(2)
                                    : 'Не рассчитан'}
                            </strong>
                            </div>
                        </div>

                        <div className="course-info">
                            Направление: <strong>
                            {transcriptData.courseName || 'Не указано'}
                        </strong>
                        </div>
                    </div>

                    <div className="exams-section">
                        <h3>Экзамены</h3>
                        {transcriptData.exams.length > 0 ? (
                            <div className="exams-grid">
                                {transcriptData.exams.map((exam, index) => (
                                    <div key={index} className={`exam-card grade-${Math.floor(exam.grade || 0)}`}>
                                        <div className="exam-header">
                                            <span className="subject">{exam.subject || 'Без названия'}</span>
                                            <span className="grade">
                                                {exam.grade !== null && exam.grade !== undefined
                                                    ? exam.grade
                                                    : '       -    '}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-exams">Нет данных об экзаменах</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scholarship;