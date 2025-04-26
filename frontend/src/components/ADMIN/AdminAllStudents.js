import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AdminSidebar from './AdminSidebar';
import './AdminAllStudents.css';

const AdminAllStudents = () => {
    const navigate = useNavigate();
    const [allStudents, setAllStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('all-students');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/student/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
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
                            <div className="list-header">
                                <span className="header-name">ФИО</span>
                                <span className="header-group">Группа</span>
                                <span className="header-course">Курс</span>
                                <span className="header-grade">Средний балл</span>
                            </div>

                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <div key={index} className="student-row">
                                        <span className="student-name">
                                            {student.surname} {student.name}
                                        </span>
                                        <span className="student-group">
                                            {student.groupNumber || '-'}
                                        </span>
                                        <span className="student-course">
                                            {student.course || '-'}
                                        </span>
                                        <span className={`student-grade ${student.averageGrade ? 'has-grade' : 'no-grade'}`}>
                                            {student.averageGrade || '-'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    Студенты не найдены
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAllStudents;