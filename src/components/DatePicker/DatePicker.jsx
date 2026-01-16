// src/components/DatePicker/DatePicker.jsx
import { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './DatePicker.module.css';

export const DatePicker = ({
    value,
    onChange,
    label,
    placeholder = 'DD/MM/YYYY',
    minDate,
    maxDate,
    format = 'DD/MM/YYYY',
    disabled = false,
    error,
    className = '',
    size = 'medium',
    required = false,
    helperText,
    fullWidth = true,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value ? formatDate(value, format) : '');
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
    const pickerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format date to string
    function formatDate(date, format) {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        switch (format) {
            case 'MM/DD/YYYY':
                return `${month}/${day}/${year}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'DD/MM/YYYY':
            default:
                return `${day}/${month}/${year}`;
        }
    }

    // Parse string to date
    function parseDate(dateString, format) {
        if (!dateString) return null;

        let day, month, year;

        switch (format) {
            case 'MM/DD/YYYY':
                const mmddyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                if (mmddyyyy) {
                    month = parseInt(mmddyyyy[1], 10);
                    day = parseInt(mmddyyyy[2], 10);
                    year = parseInt(mmddyyyy[3], 10);
                }
                break;
            case 'YYYY-MM-DD':
                const yyyymmdd = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
                if (yyyymmdd) {
                    year = parseInt(yyyymmdd[1], 10);
                    month = parseInt(yyyymmdd[2], 10);
                    day = parseInt(yyyymmdd[3], 10);
                }
                break;
            case 'DD/MM/YYYY':
            default:
                const ddmmyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                if (ddmmyyyy) {
                    day = parseInt(ddmmyyyy[1], 10);
                    month = parseInt(ddmmyyyy[2], 10);
                    year = parseInt(ddmmyyyy[3], 10);
                }
                break;
        }

        if (day && month && year) {
            const date = new Date(year, month - 1, day);
            // Validate date
            if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
                return date;
            }
        }
        return null;
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Parse the date as user types
        if (value.length === 10) { // Full date length
            const date = parseDate(value, format);
            if (date) {
                setSelectedDate(date);
                setCurrentMonth(date);
                onChange?.(date);
            }
        }
    };

    const handleInputBlur = () => {
        if (inputValue) {
            const date = parseDate(inputValue, format);
            if (date) {
                setInputValue(formatDate(date, format));
                setSelectedDate(date);
                setCurrentMonth(date);
                onChange?.(date);
            } else {
                // Invalid date, revert to last valid or clear
                setInputValue(selectedDate ? formatDate(selectedDate, format) : '');
            }
        }
    };

    const handleDateSelect = (date) => {
        if (!date) return;

        const formatted = formatDate(date, format);
        setSelectedDate(date);
        setCurrentMonth(date);
        setInputValue(formatted);
        onChange?.(date);
        setIsOpen(false);
        setIsFocused(false);
        inputRef.current?.focus();
    };

    const handleCalendarClick = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            setIsFocused(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleInputBlur();
        }
    };

    const handleInputClick = () => {
        if (!disabled) {
            setIsOpen(true);
            setIsFocused(true);
        }
    };

    const isDateDisabled = (date) => {
        if (!date) return false;
        if (minDate && date < new Date(minDate)) return true;
        if (maxDate && date > new Date(maxDate)) return true;
        return false;
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const goToNextMonth = () => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    const goToPreviousYear = () => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setFullYear(prev.getFullYear() - 1);
            return newDate;
        });
    };

    const goToNextYear = () => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setFullYear(prev.getFullYear() + 1);
            return newDate;
        });
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const containerClasses = [
        styles.container,
        styles[size],
        fullWidth && styles.fullWidth,
        className
    ].filter(Boolean).join(' ');

    const inputClasses = [
        styles.input,
        isFocused && styles.focused,
        error && styles.error,
        disabled && styles.disabled
    ].filter(Boolean).join(' ');

    return (
        <div ref={pickerRef} className={containerClasses}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={styles.inputWrapper}>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onFocus={() => setIsFocused(true)}
                    onClick={handleInputClick}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClasses}
                    maxLength={10}
                    readOnly={true}
                />
                <button
                    type="button"
                    className={styles.calendarButton}
                    onClick={handleCalendarClick}
                    disabled={disabled}
                    aria-label="Open calendar"
                >
                    <FiCalendar size={16} />
                </button>

                {isOpen && (
                    <div className={styles.calendarWrapper}>
                        {/* Navigation Header */}
                        <div className={styles.calendarHeader}>
                            <div className={styles.navigation}>
                                <button
                                    type="button"
                                    className={styles.navButton}
                                    onClick={goToPreviousYear}
                                    aria-label="Previous year"
                                >
                                    <FiChevronLeft size={16} />
                                    <FiChevronLeft size={16} style={{ marginLeft: -8 }} />
                                </button>
                                <button
                                    type="button"
                                    className={styles.navButton}
                                    onClick={goToPreviousMonth}
                                    aria-label="Previous month"
                                >
                                    <FiChevronLeft size={16} />
                                </button>

                                <div className={styles.monthDisplay}>
                                    <span className={styles.monthName}>{monthNames[currentMonth.getMonth()]}</span>
                                    <span className={styles.year}>{currentMonth.getFullYear()}</span>
                                </div>

                                <button
                                    type="button"
                                    className={styles.navButton}
                                    onClick={goToNextMonth}
                                    aria-label="Next month"
                                >
                                    <FiChevronRight size={16} />
                                </button>
                                <button
                                    type="button"
                                    className={styles.navButton}
                                    onClick={goToNextYear}
                                    aria-label="Next year"
                                >
                                    <FiChevronRight size={16} />
                                    <FiChevronRight size={16} style={{ marginLeft: -8 }} />
                                </button>
                            </div>
                        </div>

                        <div className={styles.dayNames}>
                            {dayNames.map(day => (
                                <div key={day} className={styles.dayName}>{day}</div>
                            ))}
                        </div>

                        <div className={styles.daysGrid}>
                            {days.map((date, index) => {
                                const isSelected = date && selectedDate &&
                                    date.toDateString() === selectedDate.toDateString();
                                const isDisabled = date && isDateDisabled(date);
                                const isToday = date &&
                                    date.toDateString() === new Date().toDateString();

                                const dayClasses = [
                                    styles.day,
                                    isSelected && styles.selected,
                                    isDisabled && styles.disabledDay,
                                    isToday && !isSelected && styles.today
                                ].filter(Boolean).join(' ');

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={dayClasses}
                                        onClick={() => !isDisabled && handleDateSelect(date)}
                                        disabled={isDisabled}
                                        aria-label={`Select ${date ? date.getDate() : ''}`}
                                    >
                                        {date ? date.getDate() : ''}
                                    </button>
                                );
                            })}
                        </div>

                        <div className={styles.calendarFooter}>
                            <button
                                type="button"
                                className={styles.todayButton}
                                onClick={() => {
                                    const today = new Date();
                                    if (!isDateDisabled(today)) {
                                        handleDateSelect(today);
                                    }
                                }}
                                disabled={isDateDisabled(new Date())}
                            >
                                Today
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {(error || helperText) && (
                <div className={`${error ? styles.errorText : styles.helperText}`}>
                    {error || helperText}
                </div>
            )}
        </div>
    );
};

export default DatePicker;