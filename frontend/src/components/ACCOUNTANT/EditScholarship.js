import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AccountantSidebar from './AccountantSidebar';
import './EditScholarship.css';

const EditScholarship = () => {
    const navigate = useNavigate();
    const [scholarships, setScholarships] = useState([]);
    const [selectedScholarship, setSelectedScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [activeSection, setActiveSection] = useState('edit-scholarships');

    const fetchScholarships = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/scholarship/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setScholarships(response.data);
            setError('');
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            setError('Ошибка загрузки списка стипендий');
            if (err.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarships();
    }, []);

    const handleSelectScholarship = (scholarship) => {
        setSelectedScholarship({ ...scholarship });
        setEditMode(true);
        setError('');
        setSuccess('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedScholarship(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedScholarship?.amountId) {
            setError('Выберите стипендию для редактирования');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/scholarship/update/${selectedScholarship.amountId}`,
                {
                    minAverage: parseFloat(selectedScholarship.minAverage),
                    maxAverage: parseFloat(selectedScholarship.maxAverage),
                    amount: parseFloat(selectedScholarship.amount)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess('Стипендия успешно обновлена');
            fetchScholarships();
        } catch (err) {
            console.error('Ошибка сохранения:', err);
            setError(err.response?.data?.message || 'Ошибка при сохранении изменений');
        }
    };

    if (loading) return <div className="loading">Загрузка данных...</div>;

    return (
        <div className="accountant-profile-container">
            <Header />

            <div className="accountant-profile-content">
                <AccountantSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="accountant-profile-main">
                    <div className="scholarship-card">
                        <h2>Редактирование стипендий</h2>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <table className="scholarships-table">
                            <thead>
                            <tr>
                                <th>Минимальный балл</th>
                                <th>Максимальный балл</th>
                                <th>Сумма</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {scholarships.map((scholarship) => (
                                <tr key={`scholarship-${scholarship.amountId}`}>
                                    <td>{scholarship.minAverage}</td>
                                    <td>{scholarship.maxAverage}</td>
                                    <td>{scholarship.amount}</td>
                                    <td>
                                        <button
                                            onClick={() => handleSelectScholarship(scholarship)}
                                            className="edit-btn"
                                        >
                                            Редактировать
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {editMode && selectedScholarship && (
                            <form onSubmit={handleSubmit} className="edit-form">
                                <h3>Редактирование стипендии</h3>

                                <div className="form-group">
                                    <label>Минимальный балл:</label>
                                    <input
                                        type="number"
                                        name="minAverage"
                                        value={selectedScholarship.minAverage}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="10"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Максимальный балл:</label>
                                    <input
                                        type="number"
                                        name="maxAverage"
                                        value={selectedScholarship.maxAverage}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="10"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Сумма стипендии:</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={selectedScholarship.amount}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="save-btn">
                                        Сохранить
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="cancel-btn"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditScholarship;