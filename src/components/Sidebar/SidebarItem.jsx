import React, { useState, useCallback, memo } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from './Sidebar.module.css';

export const SidebarItem = memo(({
    label,
    icon,
    onClick,
    active = false,
    children,
    disabled = false,
    collapsed = false,          // ← Received from parent Sidebar
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = React.Children.count(children) > 0;

    const handleClick = useCallback(() => {
        if (disabled) return;

        if (hasChildren) {
            setIsOpen(prev => !prev); // Always toggle - works in both expanded & collapsed mode
        } else if (onClick) {
            onClick();
        }
    }, [disabled, hasChildren, onClick]);

    const itemClasses = [
        styles.item,
        active && styles.active,
        disabled && styles.disabled,
        hasChildren && styles.hasChildren
    ].filter(Boolean).join(' ');

    // Pass collapsed prop down to nested children too
    const enhancedChildren = React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { collapsed });
    });

    return (
        <div className={styles.itemWrapper} role="presentation">
            <button
                className={itemClasses}
                onClick={handleClick}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-current={active ? 'page' : undefined}
                disabled={disabled}
                role="menuitem"
                aria-label={label}
                {...rest}
            >
                <div className={styles.iconContainer}>
                    {icon && (
                        <span className={styles.itemIcon} aria-hidden="true">
                            {icon}
                        </span>
                    )}

                    {/* Active/open indicator dot - only in collapsed mode */}
                    {collapsed && hasChildren && isOpen && (
                        <span className={styles.openIndicator} />
                    )}
                </div>

                <span className={styles.itemLabel}>{label}</span>

                {hasChildren && (
                    <span
                        className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
                        aria-hidden="true"
                    >
                        <FiChevronDown size={14} />
                    </span>
                )}
            </button>

            {hasChildren && (
                <div
                    className={styles.submenu}
                    style={{
                        display: isOpen ? 'block' : 'none'
                    }}
                    role="menu"
                    aria-label={`${label} submenu`}
                >
                    {enhancedChildren}
                </div>
            )}
        </div>
    );
});

SidebarItem.displayName = 'SidebarItem';