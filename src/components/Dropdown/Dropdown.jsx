// src/components/Dropdown/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiX, FiCheck } from 'react-icons/fi';
import styles from './Dropdown.module.css';

const Dropdown = ({
    options = [],
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    error,
    disabled = false,
    searchable = true,
    multiple = false,
    clearable = true,
    className = '',
    size = 'medium',
    required = false,
    helperText,
    fullWidth = true,
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchable && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isOpen, searchable]);

    const filteredOptions = searchable
        ? options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    const handleSelect = (option) => {
        if (multiple) {
            const newValue = value?.includes(option.value)
                ? value.filter(v => v !== option.value)
                : [...(value || []), option.value];
            onChange?.(newValue);
        } else {
            onChange?.(option.value);
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        if (multiple) {
            onChange?.([]);
        } else {
            onChange?.(null);
        }
    };

    const getDisplayValue = () => {
        if (multiple && Array.isArray(value) && value.length > 0) {
            if (value.length === 1) {
                const option = options.find(o => o.value === value[0]);
                return option ? option.label : placeholder;
            }
            return `${value.length} selected`;
        }

        if (!multiple && value) {
            return options.find(o => o.value === value)?.label || placeholder;
        }

        return placeholder;
    };

    const hasValue = () => {
        if (multiple) {
            return Array.isArray(value) && value.length > 0;
        }
        return value !== null && value !== undefined && value !== '';
    };

    const containerClasses = [
        styles.container,
        styles[size],
        fullWidth && styles.fullWidth,
        className
    ].filter(Boolean).join(' ');

    const dropdownClasses = [
        styles.dropdown,
        isOpen && styles.open,
        error && styles.error,
        disabled && styles.disabled,
        hasValue() && styles.hasValue
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses} ref={dropdownRef}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div
                className={dropdownClasses}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={styles.value}>{getDisplayValue()}</span>

                <div className={styles.controls}>
                    {clearable && hasValue() && (
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={handleClear}
                            aria-label="Clear selection"
                        >
                            <FiX size={14} />
                        </button>
                    )}
                    <span className={styles.arrow}>
                        <FiChevronDown size={16} />
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className={styles.menu}>
                    {searchable && (
                        <div className={styles.searchContainer}>
                            <input
                                ref={searchRef}
                                type="text"
                                className={styles.search}
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    className={styles.clearSearch}
                                    onClick={() => setSearchTerm('')}
                                    aria-label="Clear search"
                                >
                                    <FiX size={14} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className={styles.options}>
                        {filteredOptions.map(option => {
                            const isSelected = multiple
                                ? value?.includes(option.value)
                                : value === option.value;

                            return (
                                <div
                                    key={option.value}
                                    className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {multiple && (
                                        <span className={styles.checkbox}>
                                            {isSelected && <FiCheck size={12} />}
                                        </span>
                                    )}
                                    <span className={styles.optionLabel}>{option.label}</span>
                                </div>
                            );
                        })}
                        {filteredOptions.length === 0 && (
                            <div className={styles.empty}>No options found</div>
                        )}
                    </div>
                </div>
            )}

            {(error || helperText) && (
                <div className={`${error ? styles.errorText : styles.helperText}`}>
                    {error || helperText}
                </div>
            )}
        </div>
    );
};

export default Dropdown;