import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'profile', label: 'Мой профиль', navigate: () => navigate('/admin') },
        { id: 'all-students', label: 'Все студенты', navigate: () => navigate('/admin/students') },
        { id: 'add-student', label: 'Добавить студента', navigate: () => navigate('/admin/students/add') },
        { id: 'delete-student', label: 'Удалить студента', navigate: () => navigate('/admin/students/delete') },
        { id: 'edit-session', label: 'Редактировать сессию', navigate: () => navigate('/admin/session/edit') },
        { id: 'fill-session', label: 'Заполнить сессию', navigate: () => navigate('/admin/session/add') },
        { id: 'add-group', label: 'Добавить группу', navigate: () => navigate('/admin/groups/add') },
        { id: 'delete-group', label: 'Удалить группу', navigate: () => navigate('/admin/groups/delete') }
    ];

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>Панель администратора</h3>
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

export default AdminSidebar;