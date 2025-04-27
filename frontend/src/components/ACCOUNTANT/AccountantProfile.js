import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AccountantSidebar from './AccountantSidebar';
import './AccountantProfile.css';

const AccountantProfile = () => {
    const navigate = useNavigate();
    const [accountantData, setAccountantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        const fetchAccountantData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAccountantData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Не удалось загрузить данные профиля');
                setLoading(false);
                console.error('Ошибка загрузки:', err);
                if (err.response?.status === 403) {
                    navigate('/login');
                }
            }
        };

        fetchAccountantData();
    }, [navigate]);

    if (loading) return <div className="loading">Загрузка профиля...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!accountantData) return <div className="error">Данные профиля не найдены</div>;

    return (
        <div className="accountant-profile-container">
            <Header />

            <div className="accountant-profile-content">
                <AccountantSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="accountant-profile-main">
                    <div className="accountant-info-card">
                        <div className="accountant-header">
                            <h2>{accountantData.surname} {accountantData.name}</h2>
                            <div className="accountant-badge">Бухгалтер</div>
                        </div>

                        <div className="accountant-details">
                            <div className="detail-item">
                                <span className="detail-label">Дата рождения:</span>
                                <span className="detail-value">{accountantData.birthday || '—'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{accountantData.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Телефон:</span>
                                <span className="detail-value">{accountantData.phoneNumber || '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantProfile;
