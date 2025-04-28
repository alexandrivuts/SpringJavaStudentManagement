import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAdminData(response.data);
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

        fetchAdminData();
    }, [navigate]);

    if (loading) return <div className="loading">Загрузка профиля...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!adminData) return <div className="error">Данные профиля не найдены</div>;

    return (
        <div className="admin-profile-container">
            <Header />

            <div className="admin-profile-content">
                <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="admin-profile-main">
                    <div className="admin-info-card">
                        <div className="admin-header">
                            <h2>{adminData.surname} {adminData.name}</h2>
                            <div className="admin-badge">Представитель деканата</div>
                        </div>

                        <div className="admin-details">
                            <div className="detail-item">
                                <span className="detail-label">Дата рождения:</span>
                                <span className="detail-value">{adminData.birthday || '—'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{adminData.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Телефон:</span>
                                <span className="detail-value">{adminData.phoneNumber || '—'}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;