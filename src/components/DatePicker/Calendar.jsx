// src/components/DatePicker/Calendar.jsx
import React, { useState, useMemo } from 'react';
// import styles from './Calendar.module.css';

/**
 * Calendar Component
 * Internal component used by DatePicker
 * 
 * @param {Object} props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateSelect - Date selection handler
 * @param {Date} props.minDate - Minimum selectable date
 * @param {Date} props.maxDate - Maximum selectable date
 * @param {Date} props.currentMonth - Currently displayed month
 * @param {Function} props.onMonthChange - Month change handler
 */
const Calendar = ({
    selectedDate,
    onDateSelect,
    minDate,
    maxDate,
    currentMonth,
    onMonthChange
}) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get all days to display in calendar grid
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        const firstDayOfWeek = firstDay.getDay();

        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Previous month
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();

        const days = [];

        // Previous month's days
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, daysInPrevMonth - i),
                isCurrentMonth: false,
                isPrevMonth: true
            });
        }

        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true,
                isPrevMonth: false,
                isNextMonth: false
            });
        }

        // Next month's days
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
                isNextMonth: true
            });
        }

        return days;
    }, [currentMonth]);

    const isDateDisabled = (date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    const isDateSelected = (date) => {
        if (!selectedDate) return false;
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const handlePrevMonth = () => {
        const newMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() - 1,
            1
        );
        onMonthChange(newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            1
        );
        onMonthChange(newMonth);
    };

    const handleDateClick = (day) => {
        if (!day.isCurrentMonth || isDateDisabled(day.date)) return;
        onDateSelect(day.date);
    };

    const handleToday = () => {
        const today = new Date();
        onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1));
        onDateSelect(today);
    };

    const getDayClasses = (day) => {
        const classes = [styles.day];

        if (!day.isCurrentMonth) {
            classes.push(styles.otherMonth);
        }

        if (isDateSelected(day.date)) {
            classes.push(styles.selected);
        }

        if (isToday(day.date)) {
            classes.push(styles.today);
        }

        if (isDateDisabled(day.date)) {
            classes.push(styles.disabled);
        }

        return classes.join(' ');
    };

    return (
        <div className={styles.calendar}>
            {/* Header with Month/Year Navigation */}
            <div className={styles.header}>
                <button
                    type="button"
                    className={styles.navButton}
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                >
                    ‹
                </button>

                <div className={styles.title}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>

                <button
                    type="button"
                    className={styles.navButton}
                    onClick={handleNextMonth}
                    aria-label="Next month"
                >
                    ›
                </button>
            </div>

            {/* Weekday Headers */}
            <div className={styles.weekdays}>
                {weekdays.map((day) => (
                    <div key={day} className={styles.weekday}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className={styles.grid}>
                {calendarDays.map((day, index) => (
                    <button
                        key={index}
                        type="button"
                        className={getDayClasses(day)}
                        onClick={() => handleDateClick(day)}
                        disabled={!day.isCurrentMonth || isDateDisabled(day.date)}
                        aria-label={day.date.toLocaleDateString()}
                        aria-selected={isDateSelected(day.date)}
                    >
                        {day.date.getDate()}
                    </button>
                ))}
            </div>

            {/* Quick Actions */}
            <div className={styles.footer}>
                <button
                    type="button"
                    className={styles.quickAction}
                    onClick={handleToday}
                >
                    Today
                </button>
            </div>
        </div>
    );
};

export default Calendar;