// src/components/Button/Button.jsx
import React from 'react';
import styles from './Button.module.css';
import {
    FiSave, FiX, FiCheck, FiEdit2, FiTrash2, FiUpload,
    FiDownload, FiShare2, FiRotateCcw, FiEye, FiFileText,
    FiPlus, FiSearch, FiFilter, FiPrinter, FiSend,
    FiLock, FiUnlock, FiStar, FiHeart, FiShoppingCart
} from 'react-icons/fi';
import { MdOutlineDangerous } from 'react-icons/md';

/**
 * Enhanced Button Component with attractive designs and contextual icons
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Button content
 * @param {('save'|'cancel'|'submit'|'edit'|'delete'|'upload'|'download'|'export'|'reset'|'close'|'draft'|'primary'|'secondary'|'success'|'warning'|'info'|'danger'|'add'|'search'|'filter'|'print'|'send'|'lock'|'unlock'|'favorite'|'cart')} props.variant - Button variant with auto icons
 * @param {('small'|'medium'|'large')} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {React.ReactNode} props.icon - Custom icon element (overrides default variant icon)
 * @param {('left'|'right')} props.iconPosition - Icon position
 * @param {boolean} props.fullWidth - Full width button
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.withShadow - Add shadow effect for depth
 * @param {boolean} props.withGradient - Add gradient background
 * @param {boolean} props.rounded - Fully rounded pill-style button
 * @returns {JSX.Element} Rendered button component
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    onClick,
    type = 'button',
    withShadow = true,
    withGradient = true,
    rounded = false,
    ...rest
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.loading,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        withShadow && styles.withShadow,
        withGradient && styles.withGradient,
        rounded && styles.rounded,
        className
    ].filter(Boolean).join(' ');

    /**
     * Get default icon based on button variant
     * @returns {JSX.Element|null} React icon component
     */
    const getDefaultIcon = () => {
        const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;

        switch (variant) {
            case 'save': return <FiSave size={iconSize} />;
            case 'cancel': case 'close': return <FiX size={iconSize} />;
            case 'submit': return <FiCheck size={iconSize} />;
            case 'edit': return <FiEdit2 size={iconSize} />;
            case 'delete': return <FiTrash2 size={iconSize} />;
            case 'danger': return <MdOutlineDangerous size={iconSize} />;
            case 'upload': return <FiUpload size={iconSize} />;
            case 'download': return <FiDownload size={iconSize} />;
            case 'export': case 'share': return <FiShare2 size={iconSize} />;
            case 'reset': return <FiRotateCcw size={iconSize} />;
            case 'draft': case 'view': return <FiEye size={iconSize} />;
            case 'info': return <FiFileText size={iconSize} />;
            case 'add': case 'primary': return <FiPlus size={iconSize} />;
            case 'search': return <FiSearch size={iconSize} />;
            case 'filter': return <FiFilter size={iconSize} />;
            case 'print': return <FiPrinter size={iconSize} />;
            case 'send': return <FiSend size={iconSize} />;
            case 'lock': return <FiLock size={iconSize} />;
            case 'unlock': return <FiUnlock size={iconSize} />;
            case 'success': return <FiCheck size={iconSize} />;
            case 'warning': return <FiStar size={iconSize} />;
            case 'favorite': return <FiHeart size={iconSize} />;
            case 'cart': return <FiShoppingCart size={iconSize} />;
            default: return null;
        }
    };

    const defaultIcon = getDefaultIcon();
    const showIcon = icon || defaultIcon;

    /**
     * Render button content based on state
     * @returns {JSX.Element} Button content
     */
    const renderContent = () => {
        if (loading) {
            return (
                <>
                    <span className={styles.spinner}></span>
                    <span className={styles.loadingText}>Loading...</span>
                </>
            );
        }

        return (
            <>
                {showIcon && iconPosition === 'left' && (
                    <span className={styles.icon} data-position="left">
                        {icon || defaultIcon}
                    </span>
                )}
                <span className={styles.text}>{children}</span>
                {showIcon && iconPosition === 'right' && (
                    <span className={styles.icon} data-position="right">
                        {icon || defaultIcon}
                    </span>
                )}
            </>
        );
    };

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            aria-busy={loading}
            data-variant={variant}
            {...rest}
        >
            {renderContent()}
        </button>
    );
};

export default Button;