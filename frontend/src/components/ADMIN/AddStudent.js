import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AdminSidebar from './AdminSidebar';
import './AddStudent.css';

const AdminAddStudent = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('add-student');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        surname: '',
        email: '',
        birthday: '',
        phoneNumber: '',
        groupNumber: ''
    });
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/groups', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setGroups(response.data);
                setLoadingGroups(false);
            } catch (err) {
                console.error('Ошибка загрузки групп:', err);
                setLoadingGroups(false);
            }
        };

        fetchGroups();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Преобразуем groupNumber в число, если это необходимо
            const dataToSend = {
                ...formData,
                groupNumber: Number(formData.groupNumber)
            };

            const response = await axios.post(
                'http://localhost:8080/api/users/add-student',
                dataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Success:', response.data);
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/students');
            }, 1500);
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Ошибка при добавлении студента');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-add-student-container">
            <Header />

            <div className="admin-add-student-content">
                <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="admin-add-student-main">
                    <div className="add-student-card">
                        <h2>Добавить нового студента</h2>

                        {success && (
                            <div className="success-message">
                                Студент успешно добавлен!
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Логин*</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Пароль*</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Имя*</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Фамилия*</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Дата рождения</label>
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Телефон</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+375-##-###-##-##"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Группа*</label>
                                    {loadingGroups ? (
                                        <div className="loading-groups">Загрузка списка групп...</div>
                                    ) : (
                                        <select
                                            name="groupNumber"
                                            value={formData.groupNumber}
                                            onChange={handleChange}
                                            required
                                            className="group-select"
                                        >
                                            <option value="">Выберите группу</option>
                                            {groups.map(group => (
                                                <option key={group.id} value={group.groupNumber}>
                                                    {group.groupNumber}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={loading || loadingGroups}
                                >
                                    {loading ? 'Добавление...' : 'Добавить студента'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAddStudent;