import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AccountantSidebar from '../components/AccountantSidebar';
import '../styles/ScholarshipReport.css';
import { jsPDF } from 'jspdf';
import '../fonts/arial-normal';

const ScholarshipReport = () => {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('report');
    const [filter, setFilter] = useState({
        minGrade: '',
        maxGrade: '',
        minAmount: '',
        maxAmount: ''
    });

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/reports/scholarship', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setReportData(response.data);
            setError('');
        } catch (err) {
            console.error('Ошибка загрузки отчета:', err);
            setError('Ошибка загрузки данных отчета');
            if (err.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        return reportData.filter(item => {
            return (
                (filter.minGrade === '' || item.averageGrade >= parseFloat(filter.minGrade)) &&
                (filter.maxGrade === '' || item.averageGrade <= parseFloat(filter.maxGrade)) &&
                (filter.minAmount === '' || item.scholarshipAmount >= parseFloat(filter.minAmount)) &&
                (filter.maxAmount === '' || item.scholarshipAmount <= parseFloat(filter.maxAmount))
            );
        });
    };

    const downloadPDF = () => {
        const filtered = applyFilters();
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm'
        });

        doc.addFont('arial-normal.ttf', 'Arial', 'normal');
        doc.setFont('Arial');

        // Заголовок отчета
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text('Отчет по стипендиям студентов', 15, 15);

        // Информация о генерации
        doc.setFontSize(10);
        doc.text(`Дата формирования: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 22);
        doc.text(`Всего студентов: ${filtered.length}`, 15, 28);
        doc.text(`Общая сумма выплат: ${filtered.reduce((sum, item) => sum + item.scholarshipAmount, 0).toFixed(2)} руб.`, 15, 34);

        // Параметры таблицы
        const startY = 40;
        const columnWidths = [60, 30, 30, 40];
        const headers = ['ФИО студента', 'Группа', 'Средний балл', 'Сумма стипендии'];
        const rowHeight = 10;
        let currentY = startY;

        // Заголовок таблицы
        doc.setFillColor(26, 51, 83);
        doc.rect(15, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
        doc.setTextColor(255);
        doc.setFontSize(12);

        let currentX = 15;
        headers.forEach((header, i) => {
            doc.text(header, currentX + 2, currentY + 7);
            currentX += columnWidths[i];
        });

        currentY += rowHeight;

        // Данные таблицы
        doc.setTextColor(0);
        doc.setFontSize(10);

        filtered.forEach((item, index) => {
            // Чередование цвета строк
            if (index % 2 === 0) {
                doc.setFillColor(240, 240, 240);
                doc.rect(15, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
            }

            // Ячейки данных
            currentX = 15;
            const rowData = [
                item.fullName || 'Не указано',
                item.groupNumber || 'Не указано',
                item.averageGrade?.toFixed(2) || '0.00',
                `${item.scholarshipAmount?.toFixed(2) || '0.00'} руб.`
            ];

            rowData.forEach((cell, i) => {
                // Обрезаем длинный текст, чтобы помещался в колонку
                let displayText = cell;
                if (i === 0 && cell.length > 25) {
                    displayText = cell.substring(0, 22) + '...';
                }
                doc.text(displayText, currentX + 2, currentY + 7);
                currentX += columnWidths[i];
            });

            currentY += rowHeight;

            // Перенос на новую страницу при необходимости
            if (currentY > 280) {
                doc.addPage();
                currentY = 20;
            }
        });

        // Сохранение PDF
        doc.save(`Стипендии_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const filteredData = applyFilters();

    if (loading) return <div className="loading">Загрузка отчета...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="accountant-profile-container">
            <Header />
            <div className="accountant-profile-content">
                <AccountantSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="accountant-profile-main">
                    <div className="report-card">
                        <div className="report-header">
                            <h2>Отчет по стипендиям</h2>
                            <button
                                onClick={downloadPDF}
                                className="download-btn"
                                disabled={filteredData.length === 0}
                            >
                                Скачать PDF
                            </button>
                        </div>

                        <div className="filters">
                            <div className="filter-group">
                                <label>Средний балл от:</label>
                                <input
                                    type="number"
                                    name="minGrade"
                                    value={filter.minGrade}
                                    onChange={handleFilterChange}
                                    min="0"
                                    max="10"
                                    step="0.1"
                                />
                            </div>
                            <div className="filter-group">
                                <label>до:</label>
                                <input
                                    type="number"
                                    name="maxGrade"
                                    value={filter.maxGrade}
                                    onChange={handleFilterChange}
                                    min="0"
                                    max="10"
                                    step="0.1"
                                />
                            </div>
                            <div className="filter-group">
                                <label>Сумма стипендии от:</label>
                                <input
                                    type="number"
                                    name="minAmount"
                                    value={filter.minAmount}
                                    onChange={handleFilterChange}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="filter-group">
                                <label>до:</label>
                                <input
                                    type="number"
                                    name="maxAmount"
                                    value={filter.maxAmount}
                                    onChange={handleFilterChange}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="report-summary">
                            <p>Всего студентов: {filteredData.length}</p>
                            <p>Общая сумма выплат: {filteredData.reduce((sum, item) => sum + item.scholarshipAmount, 0).toFixed(2)} руб.</p>
                        </div>

                        <table className="report-table">
                            <thead>
                            <tr>
                                <th>ФИО студента</th>
                                <th>Группа</th>
                                <th>Средний балл</th>
                                <th>Сумма стипендии</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr key={`report-${index}`}>
                                        <td>{item.fullName}</td>
                                        <td>{item.groupNumber}</td>
                                        <td>{item.averageGrade.toFixed(2)}</td>
                                        <td>{item.scholarshipAmount.toFixed(2)} руб.</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-results">Нет данных, соответствующих фильтрам</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipReport;