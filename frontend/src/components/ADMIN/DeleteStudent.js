import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AdminSidebar from './AdminSidebar';
import './DeleteStudent.css';

const DeleteStudent = () => {
    const navigate = useNavigate();
    const [allStudents, setAllStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('delete-student');
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/student/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                console.log('Ответ API:', response.data);

                setAllStudents(response.data);
                setFilteredStudents(response.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка загрузки списка студентов');
                setLoading(false);
                console.error('Ошибка:', err);
                if (err.response?.status === 403) {
                    navigate('/login');
                }
            }
        };

        fetchStudents();
    }, [navigate]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredStudents(allStudents);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = allStudents.filter(student => {
                const fullName = `${student.surname} ${student.name}`.toLowerCase();
                return fullName.includes(query);
            });
            setFilteredStudents(filtered);
        }
    }, [searchQuery, allStudents]);

    const handleSelectStudent = (studentId) => {
        setSelectedStudents((prevSelected) => {
            if (prevSelected.includes(studentId)) {
                return prevSelected.filter((id) => id !== studentId);
            }

            return [...prevSelected, studentId];
        });
    };

    const handleDeleteSelected = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Необходима авторизация');
                return;
            }

            console.log('Список выбранных студентов перед удалением:', selectedStudents);

            if (selectedStudents.length === 0) {
                alert('Выберите хотя бы одного студента для удаления');
                return;
            }

            const validStudentIds = selectedStudents.filter(id => id !== undefined && id !== null);
            console.log('Проверенные ID студентов:', validStudentIds);

            if (validStudentIds.length === 0) {
                alert('Невозможно удалить студентов, ID не найдены');
                return;
            }

            // Логируем токен и отправляем запросы
            console.log('Токен для авторизации:', token);

            await Promise.all(
                validStudentIds.map((studentId) => {
                    console.log(`Отправка запроса на удаление студента с ID: ${studentId}`);
                    return axios.delete(`http://localhost:8080/api/users/delete-student/${studentId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                })
            );

            setSelectedStudents([]);
            setFilteredStudents((prev) =>
                prev.filter((student) => !validStudentIds.includes(student.studentId)) // Используем studentId
            );
            alert('Выбранные студенты успешно удалены');
        } catch (err) {
            console.error('Ошибка удаления студентов:', err);
            if (err.response) {
                // Логируем ответ ошибки
                console.error('Ответ ошибки от сервера:', err.response);
            }
            alert('Ошибка удаления студентов');
        }
    };

    if (loading) return <div className="loading">Загрузка данных...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-students-container">
            <Header />

            <div className="admin-students-content">
                <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="admin-students-main">
                    <div className="students-card">
                        <div className="students-header">
                            <h2>Все студенты</h2>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Поиск по имени или фамилии"
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

                        <div className="students-list">
                            <table className="students-table">
                                <thead>
                                <tr>
                                    <th>ФИО</th>
                                    <th>Группа</th>
                                    <th>Курс</th>
                                    <th>Средний балл</th>
                                    <th>Выбрать</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr
                                            key={student.studentId}
                                            className={selectedStudents.includes(student.studentId) ? 'selected' : ''}
                                        >
                                            <td>{student.surname} {student.name}</td>
                                            <td>{student.groupNumber || '-'}</td>
                                            <td>{student.course || '-'}</td>
                                            <td className={student.averageGrade ? 'has-grade' : 'no-grade'}>
                                                {student.averageGrade || '-'}
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.studentId)}
                                                    onChange={() => handleSelectStudent(student.studentId)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-results">Студенты не найдены</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>


                        <div className="delete-students-container">
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selectedStudents.length === 0}
                                className="delete-button"
                            >
                                Удалить выбранных студентов
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteStudent;
