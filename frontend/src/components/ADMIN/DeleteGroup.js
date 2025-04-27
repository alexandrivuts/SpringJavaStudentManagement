import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AdminSidebar from './AdminSidebar';
import './DeleteGroup.css';

const DeleteGroup = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('delete-group');

    // Загружаем все группы
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/groups', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setGroups(response.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке групп');
                setLoading(false);
                console.error('Ошибка:', err);
                if (err.response?.status === 403) {
                    navigate('/login');
                }
            }
        };

        fetchGroups();
    }, [navigate]);

    // Обработчик выбора группы для удаления
    const handleSelectGroup = (groupId) => {
        setSelectedGroups((prevSelected) => {
            if (prevSelected.includes(groupId)) {
                return prevSelected.filter((id) => id !== groupId);
            }
            return [...prevSelected, groupId];
        });
    };

    // Обработчик удаления выбранных групп
    const handleDeleteGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Необходима авторизация');
                return;
            }

            if (selectedGroups.length === 0) {
                alert('Выберите хотя бы одну группу для удаления');
                return;
            }

            await Promise.all(
                selectedGroups.map((groupId) => {
                    return axios.delete(`http://localhost:8080/api/groups/${groupId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                })
            );

            // Обновляем список групп после удаления
            setGroups((prevGroups) =>
                prevGroups.filter((group) => !selectedGroups.includes(group.groupId))
            );
            setSelectedGroups([]);
            alert('Группы успешно удалены');
        } catch (err) {
            console.error('Ошибка при удалении групп:', err);
            alert('Ошибка при удалении групп');
        }
    };

    if (loading) return <div className="loading">Загрузка данных...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-groups-container">
            <Header />
            <div className="admin-groups-content">
                <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="admin-groups-main">
                    <div className="groups-card">
                        <h2>Все группы</h2>

                        <div className="groups-list">
                            <table className="groups-table">
                                <thead>
                                <tr>
                                    <th>Номер группы</th>
                                    <th>Курс</th>
                                    <th>Факультет</th>
                                    <th>Специализация</th>
                                    <th>Выбрать</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groups.length > 0 ? (
                                    groups.map((group) => (
                                        <tr
                                            key={group.groupId}
                                            className={selectedGroups.includes(group.groupId) ? 'selected' : ''}
                                        >
                                            <td>{group.groupNumber}</td>
                                            <td>{group.course}</td>
                                            <td>{group.faculty}</td>
                                            <td>{group.specialization}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGroups.includes(group.groupId)}
                                                    onChange={() => handleSelectGroup(group.groupId)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-results">Группы не найдены</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="delete-groups-container">
                            <button
                                onClick={handleDeleteGroups}
                                disabled={selectedGroups.length === 0}
                                className="delete-button"
                            >
                                Удалить выбранные группы
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteGroup;
