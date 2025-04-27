import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AccountantSidebar from './AccountantSidebar';
import './Scholarships.css';

const AccountantScholarships = () => {
    const navigate = useNavigate();
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('scholarships');

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/scholarship/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setScholarships(response.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError('Ошибка загрузки стипендий');
                console.error('Ошибка запроса:', err.response || err.message);
                if (err.response?.status === 403) {
                    navigate('/login');
                }
            }
        };

        fetchScholarships();
    }, [navigate]);

    if (loading) return <div className="loading">Загрузка данных...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="accountant-scholarships-container">
            <Header />

            <div className="accountant-scholarships-content">
                <AccountantSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="accountant-scholarships-main">
                    <div className="scholarships-card">
                        <div className="scholarships-header">
                            <h2>Таблица стипендий</h2>
                        </div>

                        <div className="scholarships-list">
                            <table className="scholarships-table">
                                <thead>
                                <tr>
                                    <th>Мин. Средний балл</th>
                                    <th>Макс. Средний балл</th>
                                    <th>Сумма стипендии</th>
                                </tr>
                                </thead>
                                <tbody>
                                {scholarships.length > 0 ? (
                                    scholarships.map((scholarship) => (
                                        <tr key={scholarship.amountId}>
                                            <td>{scholarship.minAverage}</td>
                                            <td>{scholarship.maxAverage}</td>
                                            <td>{scholarship.amount} BYN</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="no-results">
                                            Стипендии не найдены
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantScholarships;
