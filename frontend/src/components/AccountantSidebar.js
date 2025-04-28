import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountantSidebar.css';

const AccountantSidebar = ({ activeSection, setActiveSection }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'profile', label: 'Мой профиль', navigate: () => navigate('/accountant') },
        { id: 'all-students', label: 'Все студенты', navigate: () => navigate('/accountant/students') },
        { id: 'scholarships', label: 'Таблица стипендий', navigate: () => navigate('/accountant/scholarships') },
        { id: 'edit-scholarships', label: 'Изменить стипендии', navigate: () => navigate('/accountant/scholarships/edit') },
        { id: 'report', label: 'Отчет', navigate: () => navigate('/accountant/report') },
    ];

    return (
        <div className="accountant-sidebar">
            <div className="sidebar-header">
                <h3>Панель бухгалтера</h3>
            </div>
            <ul className="menu-list">
                {menuItems.map((item) => (
                    <li key={item.id}>
                        <button
                            className={`menu-button ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveSection(item.id);
                                if (item.navigate) item.navigate();
                            }}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AccountantSidebar;
