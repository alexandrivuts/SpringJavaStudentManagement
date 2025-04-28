import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/ManageExams.css';

const ManageExams = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('edit-session');
    const [editMode, setEditMode] = useState(false);
    const [currentExam, setCurrentExam] = useState({ examId: null, subject: '', course: 1 });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/exams/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Добавляем проверку на наличие examId
                const validExams = response.data.filter(exam => exam.examId !== undefined && exam.examId !== null);
                setExams(validExams);
                setFilteredExams(validExams);
                setLoading(false);
            } catch (err) {
                setError('Ошибка загрузки списка экзаменов');
                setLoading(false);
                console.error('Ошибка:', err);
                if (err.response?.status === 403) {
                    navigate('/login');
                }
            }
        };

        fetchExams();
    }, [navigate]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter(exam =>
                exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.course.toString().includes(searchQuery)
            );
            setFilteredExams(filtered);
        }
    }, [searchQuery, exams]);

    const handleEditExam = (exam) => {
        if (!exam.examId) {
            alert('Невозможно редактировать экзамен без ID');
            return;
        }
        setEditMode(true);
        setCurrentExam({
            examId: exam.examId,
            subject: exam.subject,
            course: exam.course
        });
    };

    const handleUpdateExam = async () => {
        if (!currentExam.examId) {
            alert('Не выбран экзамен для редактирования');
            return;
        }

        if (isUpdating) return;
        setIsUpdating(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/exams/update/${currentExam.examId}`,
                {
                    subject: currentExam.subject,
                    course: currentExam.course
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Проверяем, что сервер вернул обновленный экзамен с ID
            if (!response.data.examId) {
                throw new Error('Сервер не вернул ID обновленного экзамена');
            }

            setExams(exams.map(exam =>
                exam.examId === currentExam.examId ? response.data : exam
            ));
            setEditMode(false);
            alert('Экзамен успешно обновлен');
        } catch (err) {
            console.error('Полная ошибка обновления экзамена:', {
                message: err.message,
                response: err.response?.data,
                config: err.config
            });
            alert(`Ошибка при обновлении экзамена: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="loading">Загрузка данных...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-exams-container">
            <Header />
            <div className="admin-exams-content">
                <AdminSidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />

                <div className="admin-exams-main">
                    <div className="exams-card">
                        <div className="exams-header">
                            <h2>Управление экзаменами</h2>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Поиск по предмету или курсу"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="clear-search-button"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        {editMode ? (
                            <div className="edit-exam-form">
                                <h3>Редактирование экзамена</h3>
                                <div className="form-group">
                                    <label>Предмет:</label>
                                    <input
                                        type="text"
                                        value={currentExam.subject}
                                        onChange={(e) => setCurrentExam({...currentExam, subject: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Курс:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={currentExam.course}
                                        onChange={(e) => setCurrentExam({
                                            ...currentExam,
                                            course: parseInt(e.target.value)
                                        })}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        onClick={handleUpdateExam}
                                        className="save-button"
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="cancel-button"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="exams-list">
                                <div className="list-header">
                                    <span className="header-subject">Предмет</span>
                                    <span className="header-course">Курс</span>
                                    <span className="header-actions">Действия</span>
                                </div>
                                {filteredExams.map(exam => (
                                    <div key={exam.examId} className="exam-row">
                                        <span className="exam-subject">{exam.subject}</span>
                                        <span className="exam-course">{exam.course}</span>
                                        <button
                                            onClick={() => handleEditExam(exam)}
                                            className="edit-button"
                                        >
                                            Редактировать
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageExams;