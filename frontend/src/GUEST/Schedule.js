import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MySchedule.css'; // Используем те же стили

const GuestSchedule = () => {
    const [scheduleData, setScheduleData] = useState(null);
    const [groupNumber, setGroupNumber] = useState('');
    const [inputGroup, setInputGroup] = useState('');
    const [currentWeek, setCurrentWeek] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const weekDaysOrder = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
    ];

    const fetchSchedule = async (group) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`http://localhost:8080/api/schedule/group/${group}`);

            console.log('Полученные данные:', response.data);
            setScheduleData(response.data);
            setGroupNumber(group);
            setLoading(false);
        } catch (err) {
            setError('Не удалось загрузить расписание. Проверьте номер группы.');
            setLoading(false);
            console.error('Ошибка:', err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputGroup.trim()) {
            fetchSchedule(inputGroup.trim());
        }
    };

    const processScheduleData = () => {
        if (!scheduleData?.schedules) return [];

        return weekDaysOrder.map(dayName => {
            const dayData = scheduleData.schedules[dayName] || [];
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
        if (!scheduleData?.exams || scheduleData.exams.length === 0) return null;

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

    return (
        <div className="guest-page-container">
            <div className="guest-schedule-container">
                {!scheduleData ? (
                    <div className="group-input-form">
                        <h2>Просмотр расписания</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={inputGroup}
                                onChange={(e) => setInputGroup(e.target.value)}
                                placeholder="Введите номер группы"
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Загрузка...' : 'Показать расписание'}
                            </button>
                        </form>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                ) : (
                    <>
                        <div className="schedule-header">
                            <h2>Расписание группы {groupNumber}</h2>
                            <button
                                className="back-button"
                                onClick={() => {
                                    setScheduleData(null);
                                    setInputGroup('');
                                }}
                            >
                                ← Выбрать другую группу
                            </button>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default GuestSchedule;