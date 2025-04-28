import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AddGroup.css';

const AddGroup = () => {
    const navigate = useNavigate();
    const [groupNumber, setGroupNumber] = useState('');
    const [course, setCourse] = useState(1);
    const [faculty, setFaculty] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeSection, setActiveSection] = useState('add-group');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8080/api/groups',
                {
                    groupNumber,
                    course,
                    faculty,
                    specialization
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setSuccessMessage('Группа успешно добавлена!');

                // Ожидаем 2 секунды, чтобы пользователь увидел сообщение
                setTimeout(() => {
                    navigate('/admin/groups/delete');  // Переход на страницу удаления группы
                }, 2000);

                // Сброс формы
                setGroupNumber('');
                setCourse(1);
                setFaculty('');
                setSpecialization('');
            }
        } catch (err) {
            setError('Ошибка при добавлении группы. Попробуйте снова.');
            console.error('Ошибка:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-groups-container">
            <Header />
            <div className="admin-groups-content">
                <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="admin-groups-main">
                    <div className="add-group-card">
                        <h2>Добавить группу</h2>

                        {successMessage && <div className="success-message">{successMessage}</div>}
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Номер группы</label>
                                <input
                                    type="number"
                                    value={groupNumber}
                                    onChange={(e) => setGroupNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Курс</label>
                                <select
                                    value={course}
                                    onChange={(e) => setCourse(parseInt(e.target.value))}
                                    required
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Факультет</label>
                                <input
                                    type="text"
                                    value={faculty}
                                    onChange={(e) => setFaculty(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Специализация</label>
                                <input
                                    type="text"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-button" disabled={loading}>
                                {loading ? 'Загрузка...' : 'Добавить группу'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGroup;
