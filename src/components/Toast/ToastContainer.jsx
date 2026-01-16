// src/components/Toast/ToastContainer.jsx
import React from 'react';
import Toast from './Toast';
import styles from './Toast.module.css';

/**
 * Toast Container Component
 * 
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.positionConfig - Position configuration object
 * @param {boolean} props.positionConfig.topRight - Show toasts at top-right (default: true)
 * @param {boolean} props.positionConfig.topLeft - Show toasts at top-left
 * @param {boolean} props.positionConfig.topCenter - Show toasts at top-center
 * @param {boolean} props.positionConfig.bottomRight - Show toasts at bottom-right
 * @param {boolean} props.positionConfig.bottomLeft - Show toasts at bottom-left
 * @param {boolean} props.positionConfig.bottomCenter - Show toasts at bottom-center
 * @param {boolean} props.positionConfig.center - Show toasts at center
 * @param {boolean} props.positionConfig.centerRight - Show toasts at center-right
 * @param {boolean} props.positionConfig.centerLeft - Show toasts at center-left
 */
export const ToastContainer = ({
    toasts,
    onClose,
    positionConfig = {
        topRight: true,
        topLeft: false,
        topCenter: false,
        bottomRight: false,
        bottomLeft: false,
        bottomCenter: false,
        center: false,
        centerRight: false,
        centerLeft: false
    }
}) => {
    if (!toasts || toasts.length === 0) return null;

    // Group toasts by position
    const groupedToasts = {};
    toasts.forEach(toast => {
        const pos = toast.position || 'top-right';
        if (!groupedToasts[pos]) {
            groupedToasts[pos] = [];
        }
        groupedToasts[pos].push(toast);
    });

    // Determine which positions are active
    const activePositions = Object.entries(positionConfig)
        .filter(([key, value]) => value === true)
        .map(([key]) => {
            // Convert camelCase to kebab-case for CSS classes
            return key.replace(/([A-Z])/g, '-$1').toLowerCase();
        });

    return (
        <>
            {activePositions.map(position => (
                <div
                    key={position}
                    className={`${styles.container} ${styles[`position-${position.replace('-', '')}`]}`}
                    data-position={position}
                >
                    {groupedToasts[position]?.map((toast) => (
                        <Toast
                            key={toast.id}
                            {...toast}
                            onClose={onClose}
                            position={position}
                        />
                    ))}
                </div>
            ))}

            {/* Handle any toasts with positions not in positionConfig */}
            {Object.entries(groupedToasts).map(([position, positionToasts]) => {
                if (!activePositions.includes(position)) {
                    return (
                        <div
                            key={`fallback-${position}`}
                            className={`${styles.container} ${styles[`position-${position.replace('-', '')}`]}`}
                            data-position={position}
                        >
                            {positionToasts.map((toast) => (
                                <Toast
                                    key={toast.id}
                                    {...toast}
                                    onClose={onClose}
                                    position={position}
                                />
                            ))}
                        </div>
                    );
                }
                return null;
            })}
        </>
    );
};

export default ToastContainer;