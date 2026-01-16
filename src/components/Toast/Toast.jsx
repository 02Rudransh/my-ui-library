// src/components/Toast/Toast.jsx
import React, { useEffect } from 'react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import styles from './Toast.module.css';

/**
 * Toast Component 
 * 
 * @param {Object} props
 * @param {string} props.id - Toast unique id
 * @param {string} props.message - Toast message
 * @param {('success'|'error'|'warning'|'info'|'alert')} props.type - Toast type
 * @param {number} props.duration - Auto close duration (ms)
 * @param {Function} props.onClose - Close handler
 * @param {boolean} props.showCloseButton - Show close button
 * @param {string} props.position - Toast position
 */
const Toast = ({
  id,
  message,
  type,
  duration,
  onClose,
  showCloseButton = true,
  position
}) => {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const icons = {
    success: <FiCheck size={18} />,
    error: <FiX size={18} />,
    warning: <FiAlertTriangle size={18} />,
    info: <FiInfo size={18} />,
    alert: <FiAlertCircle size={18} />
  };

  const typeTitles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    alert: 'Alert'
  };

  const toastClasses = [
    styles.toast,
    styles[type],
    styles[`position-${position.replace('-', '')}`]
  ].filter(Boolean).join(' ');

  const handleClose = () => {
    onClose?.(id);
  };

  return (
    <div
      className={toastClasses}
      role="alert"
      aria-live="polite"
      data-position={position}
      style={{ '--progress-duration': `${duration}ms` }}
    >
      <div className={styles.toastContent}>
        {duration > 0 && (
          <div className={styles.progressBar}>
            <div className={styles.progress} />
          </div>
        )}
        <div className={styles.toastHeader}>
          <span className={styles.iconWrapper}>
            {icons[type]}
          </span>
          <span className={styles.title}>{typeTitles[type]}</span>
          {showCloseButton && (
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close notification"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className={styles.message}>{message}</div>


      </div>
    </div>
  );
};

export default Toast;