// src/utils/validation.js

/**
 * Email validation
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Phone validation
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * URL validation
 * @param {string} url
 * @returns {boolean}
 */
export const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Password strength check
 * @param {string} password
 * @returns {{strength: string, score: number}}
 */
export const checkPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strength = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][Math.min(score, 4)];
    return { strength, score };
};

/**
 * Required field validation
 * @param {any} value
 * @returns {boolean}
 */
export const isRequired = (value) => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
};

/**
 * Min length validation
 * @param {string} value
 * @param {number} min
 * @returns {boolean}
 */
export const minLength = (value, min) => {
    return value.length >= min;
};

/**
 * Max length validation
 * @param {string} value
 * @param {number} max
 * @returns {boolean}
 */
export const maxLength = (value, max) => {
    return value.length <= max;
};

// src/utils/formatters.js

/**
 * Format date
 * @param {Date|string} date
 * @param {string} format - 'short' | 'long' | 'full'
 * @returns {string}
 */
export const formatDate = (date, format = 'short') => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const options = {
        short: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { month: 'long', day: 'numeric', year: 'numeric' },
        full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };

    return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format currency
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
};

/**
 * Format file size
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 * @param {string} text
 * @returns {string}
 */
export const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Format phone number
 * @param {string} phone
 * @returns {string}
 */
export const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
};

