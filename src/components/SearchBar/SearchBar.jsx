// src/components/SearchBar/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from './SearchBar.module.css';

export const SearchBar = ({
    value,
    onChange,
    onSearch,
    placeholder = 'Search...',
    debounceMs = 300,
    className = '',
    icon,
    clearable = true,
    size = 'medium',
    variant = 'outlined',
    fullWidth = true,
    loading = false,
    disabled = false,
    autoFocus = false,
    ...rest
}) => {
    const [internalValue, setInternalValue] = useState(value || '');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const searchIcon = icon || <FiSearch />;

    useEffect(() => {
        setInternalValue(value || '');
    }, [value]);

    useEffect(() => {
        if (!onSearch) return;

        const timer = setTimeout(() => {
            onSearch?.(internalValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [internalValue, debounceMs, onSearch]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInternalValue('');
        onChange?.('');
        onSearch?.('');
        inputRef.current?.focus();
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        rest.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        rest.onBlur?.(e);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch?.(internalValue);
            e.preventDefault();
        }
        rest.onKeyDown?.(e);
    };

    const containerClasses = [
        styles.container,
        styles[size],
        styles[variant],
        isFocused && styles.focused,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <div className={styles.inputWrapper}>
                <span className={styles.searchIcon}>
                    {loading ? (
                        <span className={styles.loadingSpinner}>
                            <span className={styles.spinner} />
                        </span>
                    ) : (
                        searchIcon
                    )}
                </span>

                <input
                    ref={inputRef}
                    type="text"
                    value={internalValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={styles.input}
                    aria-label={placeholder}
                    aria-busy={loading}
                    {...rest}
                />

                {clearable && internalValue && !disabled && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClear}
                        aria-label="Clear search"
                        disabled={disabled}
                    >
                        <FiX size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;