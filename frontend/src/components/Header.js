import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import './Header.css';

const Header = ({ studentData }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        setIsDropdownOpen(false);
    };

    const handleNavigateProfile = () => {
        navigate('/profile');
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="profile-header">
            <h1>ИИС «БГУИР: Университет»</h1>

            <div className="user-menu">
                <button className="user-button" onClick={toggleDropdown}>
                    <FaUserCircle className="user-icon" />
                    <IoIosArrowDown className="arrow-icon" />
                </button>
                {isDropdownOpen && (
                    <div className="user-dropdown">
                        {studentData && (
                            <div className="user-name">
                                {studentData.surname} {studentData.name}
                            </div>
                        )}
                        <button className="dropdown-item" onClick={handleNavigateProfile}>
                            Личный кабинет
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