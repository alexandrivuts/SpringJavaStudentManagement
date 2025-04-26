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

                // 1. Получаем данные текущего пользователя
                const userResponse = await axios.get('http://localhost:8080/api/student/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const userGroup = userResponse.data.groupNumber;
                if (!userGroup) {
                    throw new Error('Вы не состоите в группе');
                }

                setCurrentUserGroup(userGroup);

                // 2. Получаем всех студентов
                const allStudentsResponse = await axios.get('http://localhost:8080/api/student/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 3. Фильтруем студентов по группе
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

                    <div className="group-members">
                        <div className="group-header">
                            <span className="header-name">ФИО</span>
                            <span className="header-email">Email</span>
                            <span className="header-grade">Средний балл</span>
                        </div>

                        {groupStudents.length > 0 ? (
                            groupStudents.map((student, index) => (
                                <div key={index} className="student-row">
                                    <span className="student-name">
                                        {student.surname} {student.name}
                                    </span>
                                    <span className="student-email">
                                        {student.email || '-'}
                                    </span>
                                    <span className={`student-grade ${student.averageGrade ? 'has-grade' : 'no-grade'}`}>
                                        {student.averageGrade || '-'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="no-members">
                                В группе нет студентов или данные не загружены
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Group;