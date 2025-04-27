import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import StudentSidebar from './StudentSidebar';
import './Group.css';

const Group = () => {
    const [groupStudents, setGroupStudents] = useState([]);
    const [currentUserGroup, setCurrentUserGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('group');

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const token = localStorage.getItem('token');

                const userResponse = await axios.get('http://localhost:8080/api/student/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const userGroup = userResponse.data.groupNumber;
                if (!userGroup) {
                    throw new Error('Вы не состоите в группе');
                }

                setCurrentUserGroup(userGroup);

                const allStudentsResponse = await axios.get('http://localhost:8080/api/student/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const filteredStudents = allStudentsResponse.data.filter(
                    student => student.groupNumber === userGroup
                );

                setGroupStudents(filteredStudents);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Ошибка загрузки данных группы');
                setLoading(false);
                console.error('Ошибка:', err);
            }
        };

        fetchGroupData();
    }, []);

    if (loading) return <div className="loading">Загрузка данных группы...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="page-container">
            <Header />

            <div className="content-container">
                <StudentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="group-container">
                    <h2>Моя группа: {currentUserGroup}</h2>

                    <div className="students-list">
                        <table className="students-table">
                            <thead>
                            <tr>
                                <th>ФИО</th>
                                <th>Email</th>
                                <th>Средний балл</th>
                            </tr>
                            </thead>
                            <tbody>
                            {groupStudents.length > 0 ? (
                                groupStudents.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.surname} {student.name}</td>
                                        <td>{student.email || '-'}</td>
                                        <td className={`student-grade ${student.averageGrade ? 'has-grade' : 'no-grade'}`}>
                                            {student.averageGrade || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no-results">
                                        В группе нет студентов
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Group;
