import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AddSession.css';

const AddSession = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [examGrades, setExamGrades] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('add-session');
    const [isExamsLoading, setIsExamsLoading] = useState(false);

    // Функция для проверки и получения токена
    const getAuthToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Требуется авторизация');
            navigate('/login');
            return null;
        }
        return token;
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = getAuthToken();
                if (!token) return;

                const response = await axios.get('http://localhost:8080/api/student/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setStudents(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Ошибка загрузки студентов');
                setLoading(false);
                if (err.response?.status === 403) {
                    navigate('/login');
                }
            }
        };

        fetchStudents();
    }, [navigate]);

    useEffect(() => {
        if (!selectedStudent) {
            setExams([]);
            return;
        }

        const fetchExams = async () => {
            setIsExamsLoading(true);
            setError(null);
            try {
                const token = getAuthToken();
                if (!token) return;

                const response = await axios.get('http://localhost:8080/api/exams/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const filteredExams = response.data.filter(exam => exam.course === selectedStudent.course);
                setExams(filteredExams);
                setExamGrades({});
            } catch (err) {
                console.error('Ошибка загрузки экзаменов:', err);
                setError(err.response?.data?.message || 'Ошибка загрузки списка экзаменов');
                if (err.response?.status === 403) {
                    navigate('/login');
                }
                setExams([]);
            } finally {
                setIsExamsLoading(false);
            }
        };

        fetchExams();
    }, [selectedStudent, navigate]);

    const handleGradeChange = (examId, grade) => {
        setExamGrades(prev => ({
            ...prev,
            [examId]: grade
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            if (!selectedStudent) {
                setError('Выберите студента');
                return;
            }

            if (Object.keys(examGrades).length === 0) {
                setError('Введите хотя бы одну оценку');
                return;
            }

            await axios.post('http://localhost:8080/api/grades/add', {
                studentId: selectedStudent.studentId,
                examGrades
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert('Оценки успешно добавлены!');
            setSelectedStudent(null);
            setExams([]);
            setExamGrades({});
        } catch (err) {
            console.error('Ошибка добавления оценок:', err);
            setError(err.response?.data?.message || 'Ошибка при добавлении оценок');
            if (err.response?.status === 403) {
                navigate('/login');
            }
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;

    return (
        <div className="admin-students-container">
            <Header />
            <div className="admin-students-content">
                <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="admin-students-main">
                    <div className="add-session-card">
                        <h2>Добавить оценки</h2>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label>Выберите студента:</label>
                            <select
                                value={selectedStudent?.studentId || ''}
                                onChange={e => setSelectedStudent(
                                    e.target.value
                                        ? students.find(s => s.studentId === +e.target.value)
                                        : null
                                )}
                            >
                                <option value="">Выберите студента</option>
                                {students.map(student => (
                                    <option key={student.studentId} value={student.studentId}>
                                        {student.surname} {student.name} (Группа: {student.groupNumber}) (Курс: {student.course})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedStudent && (
                            <>
                                <h3>Экзамены для {selectedStudent.surname} {selectedStudent.name}</h3>
                                {isExamsLoading ? (
                                    <div>Загрузка экзаменов...</div>
                                ) : exams.length > 0 ? (
                                    <div className="exam-grid">
                                        {exams.map(exam => (
                                            <div key={exam.examId} className="exam-item">
                                                <label>{exam.subject}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    value={examGrades[exam.examId] || ''}
                                                    onChange={e => handleGradeChange(exam.examId, e.target.value)}
                                                    placeholder="0-10"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>Нет экзаменов для этого курса</div>
                                )}
                            </>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!selectedStudent || isExamsLoading || Object.keys(examGrades).length === 0}
                            className="submit-button"
                        >
                            Сохранить оценки
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSession;