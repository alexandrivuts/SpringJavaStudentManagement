import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentSidebar.css';
const StudentSidebar = ({ activeSection, setActiveSection }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'profile', label: 'Мой профиль', navigate: () => navigate('/profile') },
        { id: 'session', label: 'Сессия', navigate: () => navigate('/session') },
        { id: 'students', label: 'Все студенты', navigate: () => navigate('/student/all') },
        { id: 'scholarship', label: 'Стипендия', navigate: () => navigate('/scholarship') },
        { id: 'group', label: 'Группа', navigate: () => navigate('/group') },
        { id: 'schedule', label: 'Расписание', navigate: () => navigate('/my-schedule') }
    ];

    return (
        <div className="profile-sidebar">
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

export default StudentSidebar;