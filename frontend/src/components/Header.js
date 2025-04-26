import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Получаем данные из localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // 'ADMIN', 'ACCOUNTANT' или 'USER'
    const username = localStorage.getItem('username'); // Добавьте сохранение username при логине

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
        setIsDropdownOpen(false);
    };

    const handleNavigateProfile = () => {
        if (role === 'ADMIN') {
            navigate('/admin');
        } else if (role === 'ACCOUNTANT') {
            navigate('/accountant');
        } else {
            navigate('/profile');
        }
        setIsDropdownOpen(false);
    };

    const handleNavigateAdminPanel = () => {
        navigate('/admin');
        setIsDropdownOpen(false);
    };

    const handleNavigateAccountantPanel = () => {
        navigate('/accountant');
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if (!token) return null; // Не показываем хедер если пользователь не авторизован

    return (
        <div className="profile-header">
            <h1>ИИС «БГУИР: Университет»</h1>

            <div className="user-menu">
                <button className="user-button" onClick={toggleDropdown}>
                    <FaUserCircle className="user-icon" />
                    <span className="user-name-short">
                        {username || 'Пользователь'}
                    </span>
                    <IoIosArrowDown className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`} />
                </button>

                {isDropdownOpen && (
                    <div className="user-dropdown">
                        <div className="user-info">
                            <div className="user-fullname">
                                {username || 'Пользователь'}
                            </div>
                            <div className="user-role">
                                {role === 'ADMIN' && 'Администратор'}
                                {role === 'ACCOUNTANT' && 'Бухгалтер'}
                                {role === 'USER' && 'Студент'}
                            </div>
                        </div>

                        <button className="dropdown-item" onClick={handleNavigateProfile}>
                            {role === 'ADMIN' ? 'Личный кабинет' :
                                role === 'ACCOUNTANT' ? 'Личный кабинет' : 'Личный кабинет'}
                        </button>

                        <button className="dropdown-item logout" onClick={handleLogout}>
                            Выйти
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;