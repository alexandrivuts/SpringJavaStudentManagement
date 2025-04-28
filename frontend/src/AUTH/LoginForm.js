import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import bsuirLogo from './bsuir_logo1.png';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
                username,
                password,
            });

            const { token, user } = response.data;
            const roleName = user.role.roleName;

            localStorage.setItem('token', token);
            localStorage.setItem('role', roleName);
            localStorage.setItem('username', user.name+" "+user.surname);

            if (roleName === 'ADMIN') {
                navigate('/admin');
            } else if (roleName === 'ACCOUNTANT') {
                navigate('/accountant');
            } else {
                navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Неверный логин или пароль');
        }
    };

    return (
        <div className="bguiir-page">
            <header className="bguiir-header">
                <h1>ИИС «БГУИР: Университет»</h1>
            </header>

            <div className="bguiir-login-wrapper">
                <div className="bguiir-login-card">
                    <div className="bguiir-login-avatar">
                        {/* Заменяем иконку на логотип */}
                        <img src={bsuirLogo} alt="БГУИР Логотип" className="bguiir-logo" />
                    </div>
                    <h2 className="bguiir-login-title">Личный кабинет</h2>

                    <form onSubmit={handleSubmit} className="bguiir-login-form">
                        <div className="bguiir-form-group">
                            <i className="fa fa-user"></i>
                            <input
                                type="text"
                                placeholder="Логин"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="bguiir-form-group">
                            <i className="fa fa-lock"></i>
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="bguiir-error">{error}</div>}

                        <button type="submit" className="bguiir-login-button">Войти</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;