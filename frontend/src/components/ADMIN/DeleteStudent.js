import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AdminSidebar from './AdminSidebar';
import './DeleteStudent.css';

const AdminDeleteStudent = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/student/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setStudents(response.data);
            } catch (err) {
                setError('Ошибка загрузки списка студентов');
                console.error('Ошибка загрузки:', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [navigate]);

    const handleDelete = async () => {
        if (!selectedId) {
            setError('Выберите студента для удаления');
            return;
        }

        const student = students.find(s => s.id === selectedId);
        if (!student) {
            setError('Студент не найден');
            return;
        }

        if (!window.confirm(`Удалить студента ${student.surname} ${student.name}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/users/delete-student/${selectedId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccess(true);
            setStudents(prev => prev.filter(s => s.id !== selectedId));
            setSelectedId(null);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Ошибка удаления:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            setError(err.response?.data?.message || 'Ошибка при удалении');
        }
    };

    const filteredStudents = students.filter(student => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            student.surname.toLowerCase().includes(searchTerm) ||
            student.name.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="admin-delete-page">
            <Header />

            <div className="admin-container">
                <AdminSidebar activeSection="delete-student" />

                <div className="content-wrapper">
                    <div className="delete-student-card">
                        <h2>Удалить студента</h2>

                        {success && (
                            <div className="alert success">
                                Студент успешно удален!
                            </div>
                        )}

                        {error && (
                            <div className="alert error">
                                {error}
                                <button onClick={() => setError(null)}>×</button>
                            </div>
                        )}

                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Поиск по имени или фамилии"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="clear-search"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="loading">Загрузка данных...</div>
                        ) : (
                            <div className="students-table">
                                <div className="table-header">
                                    <div>ФИО</div>
                                    <div>Группа</div>
                                </div>

                                {filteredStudents.map(student => (
                                    <div
                                        key={`student-${student.id}`}
                                        className={`table-row ${selectedId === student.id ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedId(student.id);
                                            setError(null);
                                        }}
                                    >
                                        <div>{student.surname} {student.name}</div>
                                        <div>{student.groupNumber || '-'}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleDelete}
                            disabled={!selectedId}
                            className="delete-btn"
                        >
                            Удалить выбранного студента
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDeleteStudent;