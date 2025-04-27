import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AdminSidebar from './AdminSidebar';
import './AddSession.css';

const AddSession = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [examGrades, setExamGrades] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('add-session');

    useEffect(() => {
        // Загрузка студентов
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/student/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStudents(response.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка загрузки студентов');
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        if (!selectedStudent) return; // Если студент не выбран, не загружать экзамены

        const fetchExams = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/exams/all', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.status === 200) {
                    // Фильтрация экзаменов по курсу выбранного студента
                    const filteredExams = response.data.filter(exam => exam.course === selectedStudent.course);
                    setExams(filteredExams); // Устанавливаем отфильтрованные экзамены
                } else {
                    setError('Экзамены не найдены');
                }
            } catch (err) {
                setError('Ошибка загрузки списка экзаменов');
                console.error(err);
            }
        };

        fetchExams();
    }, [selectedStudent]); // Перезапускать загрузку экзаменов при изменении студента




    const handleGradeChange = (examId, grade) => {
        setExamGrades(prevGrades => ({
            ...prevGrades,
            [examId]: grade
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = {
                studentId: selectedStudent.studentId,
                examGrades
            };

            const response = await axios.post('http://localhost:8080/api/grades/add', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Оценки успешно добавлены');
        } catch (err) {
            setError('Ошибка добавления оценок');
            console.error('Ошибка:', err);
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-students-container">
            <Header />
            <div className="admin-students-content">
                <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="admin-students-main">
                    <div className="add-session-card">
                        <h2>Добавить Оценки</h2>

                        <div className="form-group">
                            <label htmlFor="student">Выберите студента</label>
                            <select
                                id="student"
                                onChange={(e) => setSelectedStudent(students.find(student => student.studentId === +e.target.value))}
                            >
                                <option value="">Выберите студента</option>
                                {students.map((student) => (
                                    <option key={student.studentId} value={student.studentId}>
                                        {student.surname} {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedStudent && (
                            <div>
                                <h3>Оценки для студента {selectedStudent.surname} {selectedStudent.name}</h3>
                                {exams.length > 0 ? (
                                    <div className="exam-list">
                                        {exams.map((exam) => (
                                            <div key={exam.examId} className="exam-item">
                                                <label>{exam.subject}</label>
                                                <input
                                                    type="number"
                                                    value={examGrades[exam.examId] || ''}
                                                    onChange={(e) => handleGradeChange(exam.examId, e.target.value)}
                                                    min="0"
                                                    max="10"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>Нет экзаменов для данного курса</div>
                                )}
                            </div>
                        )}

                        <button onClick={handleSubmit} className="submit-button">
                            Добавить Оценки
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSession;
