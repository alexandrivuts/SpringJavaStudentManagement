import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/StudentSidebar';
import '../styles/MySchedule.css';

const MySchedule = () => {
    const [scheduleData, setScheduleData] = useState(null);
    const [groupNumber, setGroupNumber] = useState('');
    const [currentWeek, setCurrentWeek] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('schedule');

    const weekDaysOrder = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userResponse = await axios.get('http://localhost:8080/api/student/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const userGroup = userResponse.data.groupNumber;
                if (!userGroup) throw new Error('Вы не состоите в группе');

                setGroupNumber(userGroup);

                const response = await axios.get(`http://localhost:8080/api/schedule/group/${userGroup}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                console.log('Полученные данные с сервера:', response.data);
                setScheduleData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Ошибка загрузки расписания');
                setLoading(false);
                console.error('Ошибка:', err);
            }
        };

        fetchData();
    }, []);

    const processScheduleData = () => {
        if (!scheduleData?.schedules) {
            console.log('Нет данных schedules в scheduleData', scheduleData);
            return [];
        }

        return weekDaysOrder.map(dayName => {
            // Убираем преобразование в lowercase, так как сервер использует правильный регистр
            const dayData = scheduleData.schedules[dayName] || [];

            console.log(`Обрабатываем день: ${dayName}, найдено занятий: ${dayData.length}`);

            return {
                dayName,
                lessons: dayData
            };
        });
    };

    const filterLessonsByWeek = (lessons) => {
        if (!lessons) return [];

        return lessons.filter(lesson => {
            if (lesson.dateLesson) return true;
            return lesson.weekNumber?.includes(currentWeek);
        });
    };

    const renderDaySchedule = (day) => {
        const filteredLessons = filterLessonsByWeek(day.lessons);

        return (
            <div key={day.dayName} className="day-schedule">
                <h3 className="day-title">{day.dayName}</h3>
                {filteredLessons.length > 0 ? (
                    <div className="lessons-container">
                        {filteredLessons.map((lesson, index) => (
                            <div key={index} className="lesson-card">
                                <div className="lesson-time">
                                    {lesson.startLessonTime} - {lesson.endLessonTime}
                                </div>
                                <div className="lesson-main">
                                    <div className="lesson-subject">
                                        {lesson.subjectFullName || lesson.subject}
                                    </div>
                                    <div className="lesson-details">
                                        <span className="lesson-type">{lesson.lessonTypeAbbrev}</span>
                                        {lesson.auditories?.length > 0 && (
                                            <span className="lesson-room">{lesson.auditories[0]}</span>
                                        )}
                                    </div>
                                    {lesson.employees?.length > 0 && (
                                        <div className="lesson-teacher">
                                            {lesson.employees[0].lastName} {lesson.employees[0].firstName[0]}.{lesson.employees[0].middleName[0]}.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-lessons">Нет занятий</div>
                )}
            </div>
        );
    };

    const renderExams = () => {
        if (!scheduleData?.exams || scheduleData.exams.length === 0) {
            return null;
        }

        return (
            <div className="exams-section">
                <h3 className="section-title">Экзамены</h3>
                <div className="exams-container">
                    {scheduleData.exams.map((exam, index) => (
                        <div key={index} className="exam-card">
                            <div className="exam-date">{exam.dateLesson}</div>
                            <div className="exam-main">
                                <div className="exam-subject">
                                    {exam.subjectFullName || exam.subject}
                                </div>
                                <div className="exam-details">
                                    <span className="exam-time">{exam.startLessonTime} - {exam.endLessonTime}</span>
                                    {exam.auditories?.length > 0 && (
                                        <span className="exam-room">{exam.auditories[0]}</span>
                                    )}
                                </div>
                                {exam.employees?.length > 0 && (
                                    <div className="exam-teacher">
                                        {exam.employees[0].lastName} {exam.employees[0].firstName[0]}.{exam.employees[0].middleName[0]}.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    if (loading) return <div className="loading">Загрузка расписания...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!scheduleData) return <div className="error">Данные расписания не найдены</div>;

    return (
        <div className="page-container">
            <Header />
            <div className="content-container">
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <div className="schedule-container">
                    <div className="schedule-header">
                        <h2>Расписание группы {groupNumber}</h2>
                        <div className="week-selector">
                            <button
                                onClick={() => setCurrentWeek(prev => Math.max(1, prev - 1))}
                                disabled={currentWeek === 1}
                            >
                                ←
                            </button>
                            <span>Неделя {currentWeek}</span>
                            <button
                                onClick={() => setCurrentWeek(prev => Math.min(4, prev + 1))}
                                disabled={currentWeek === 4}
                            >
                                →
                            </button>
                        </div>
                    </div>

                    {scheduleData.currentTerm && (
                        <div className="term-info">
                            {scheduleData.currentTerm} семестр
                            {scheduleData.startDate && scheduleData.endDate && (
                                ` (${scheduleData.startDate} - ${scheduleData.endDate})`
                            )}
                        </div>
                    )}

                    <div className="schedule-content">
                        {processScheduleData().map(day => renderDaySchedule(day))}
                    </div>

                    {renderExams()}
                </div>
            </div>
        </div>
    );
};

export default MySchedule;