import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };
    const handleScheduleRedirect = () => {
        navigate('/schedule');

    };const handlePhoneRedirect = () => {
        navigate('/phone');
    };

    return (
        <div className="home-page">
            {/* Хедер на всю ширину */}
            <header className="full-width-header">
                <div className="header-content">
                    <h1 className="header-title">ИИС «БГУИР: Университет»</h1>
                    <button className="login-button" onClick={handleLoginRedirect}>Войти</button>
                </div>
            </header>

            <div className="main-container">
                <div className="main-content">
                    <section className="intro-section">
                        <h2>Интегрированная информационная система «БГУИР: Университет»</h2>
                    </section>

                    <div className="services-grid">
                        <div className="service-card" onClick={handleScheduleRedirect} style={{cursor: 'pointer'}}>
                            <h3>Расписание</h3>
                            <p>Расписание преподавателей и студентов БГУИР</p>
                        </div>

                        <div className="service-card" onClick={handleLoginRedirect} style={{cursor: 'pointer'}}>
                            <h3>Личный кабинет</h3>
                            <p>Переход ко входу в личный кабинет</p>
                        </div>

                        <div className="service-card" onClick={handlePhoneRedirect} style={{cursor: 'pointer'}}>
                            <h3>Телефонный справочник</h3>
                            <p>Контактные данные сотрудников университета</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Футер */}
            <footer className="full-width-footer">
                <div className="footer-content">
                    <div className="university-info">
                        <p>УО "Белорусский государственный университет информатики и радиоэлектроники"</p>
                        <p>+375 (17) 293-22-22</p>
                        <p>Техподдержка</p>
                    </div>
                    <div className="legal-info">
                        <p>УНП: 100363845</p>
                        <p>© 2009-2025 ОИТ ЦИИР БГУИР. Все права защищены.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;