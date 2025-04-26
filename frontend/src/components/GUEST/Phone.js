import React from 'react';
import './Phone.css';

const Phone = () => {
    const phoneData = [
        {
            phone: '+375 (17) 293-23-07',
            room: '220-1 к. ул. Петруся Бровки, 6',
            department: 'Ректорат',
            employees: [
                'Богуш Вадим Анатольевич - ректор, доктор физико-математических наук, профессор',
            ]
        },
        {
            phone: '+375 (17) 379-32-35',
            room: '220-1 к. ул. Петруся Бровки, 6',
            department: 'Ректорат',
            employees: ['Красуцкая Юлия Леонидовна - заместитель начальника отдела документационного обеспечения']
        },
        {
            phone: '+375 (17) 293-21-12',
            room: '226-1 к. ул. Петруся Бровки, 6',
            department: 'Ректорат',
            employees: ['Шнейдеров Евгений Николаевич - проректор, кандидат технических наук, доцент']
        }
    ];

    return (
        <div className="phone-container">
            <h1 className="phone-header">Телефонный справочник</h1>

            <div className="phone-table">
                <div className="table-row header">
                    <div className="table-cell">Телефон</div>
                    <div className="table-cell">Помещение</div>
                    <div className="table-cell">Подразделение</div>
                    <div className="table-cell">Сотрудники</div>
                </div>

                {phoneData.map((item, index) => (
                    <div className="table-row" key={`phone-${index}`}>
                        <div className="table-cell">
                            <a href={`tel:${item.phone.replace(/\D/g, '')}`} className="phone-link">
                                {item.phone}
                            </a>
                        </div>
                        <div className="table-cell">{item.room}</div>
                        <div className="table-cell">{item.department}</div>
                        <div className="table-cell">
                            {item.employees.length > 0 ? (
                                <ul className="employees-list">
                                    {item.employees.map((employee, empIndex) => (
                                        <li key={`emp-${index}-${empIndex}`}>{employee}</li>
                                    ))}
                                </ul>
                            ) : <span className="no-data">-</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Phone;