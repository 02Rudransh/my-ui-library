// src/components/Input/Input.jsx
import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiSearch } from 'react-icons/fi';
import styles from './Input.module.css';

/**
 * Input Component
 * 
 * @param {Object} props
 * @param {string} props.type - Input type (text, password, email, number, tel, url)
 * @param {string} props.value - Input value (controlled)
 * @param {string} props.defaultValue - Default value (uncontrolled)
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.helperText - Helper text below input
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.fullWidth - Full width input
 * @param {React.ReactNode} props.leftIcon - Left icon
 * @param {React.ReactNode} props.rightIcon - Right icon
 * @param {('small'|'medium'|'large')} props.size - Input size
 * @param {string} props.className - Additional classes
 * @param {string} props.name - Input name attribute
 * @param {string} props.id - Input id attribute
 * @param {boolean} props.lockup - Show search icon for lockup functionality
 * @param {Function} props.onSearchClick - Search icon click handler
 */
const Input = ({
  type = 'text',
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  onSearchClick,
  label,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  size = 'medium',
  className = '',
  name,
  id,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  autoFocus,
  lockup = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const containerClasses = [
    styles.container,
    fullWidth && styles.fullWidth,
    className
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    styles.inputWrapper,
    styles[size],
    error && styles.error,
    disabled && styles.disabled,
    isFocused && styles.focused,
    leftIcon && styles.hasLeftIcon,
    (rightIcon || isPasswordType || lockup) && styles.hasRightIcon
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSearchClick && !disabled) {
      onSearchClick(e);
    }
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={wrapperClasses}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

        <input
          id={inputId}
          type={inputType}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...rest}
        />

        {lockup && !isPasswordType && !rightIcon && (
          <button
            type="button"
            className={styles.searchIcon}
            onClick={handleSearchClick}
            disabled={disabled}
            aria-label="Open search"
            tabIndex={disabled ? -1 : 0}
          >
            <FiSearch size={16} />
          </button>
        )}

        {!lockup && isPasswordType && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}

          </button>
        )}

        {rightIcon && !isPasswordType && !lockup && (
          <span className={styles.rightIcon}>{rightIcon}</span>
        )}
      </div>

      {error && (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}

      {helperText && !error && (
        <span id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;