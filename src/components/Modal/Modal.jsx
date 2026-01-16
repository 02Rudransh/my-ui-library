// src/components/Modal/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import styles from './Modal.module.css';

/**
 * Modal Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {('small'|'medium'|'large'|'fullscreen')} props.size - Modal size
 * @param {boolean} props.closeOnOverlayClick - Close when clicking overlay
 * @param {boolean} props.closeOnEsc - Close when pressing ESC
 * @param {boolean} props.showCloseButton - Show close button
 * @param {string} props.className - Additional classes
 * @param {('confirmation'|'alert'|'form'|'default')} props.variant - Modal variant
 * @param {string} props.icon - Custom icon (optional)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
  variant = 'default',
  icon,
  ...rest
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;

      // Trap focus in modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, closeOnEsc]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose?.();
    }
  };

  const getVariantIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'confirmation':
        return <FiCheckCircle className={styles.icon} />;
      case 'alert':
        return <FiAlertCircle className={styles.icon} />;
      case 'form':
        return <FiInfo className={styles.icon} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const modalClasses = [
    styles.modal,
    styles[size],
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  const hasIcon = getVariantIcon() || icon;
  const modalContent = (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
      data-open={isOpen}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        {...rest}
      >
        {showCloseButton && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        )}

        <div className={styles.modalInner}>
          {(title || hasIcon) && (
            <div className={styles.header}>
              {hasIcon && (
                <div className={styles.iconWrapper}>
                  {getVariantIcon()}
                </div>
              )}
              {title && (
                <h3 id="modal-title" className={styles.title}>
                  {title}
                </h3>
              )}
            </div>
          )}

          <div className={styles.content}>
            {children}
          </div>

          {footer && (
            <div className={styles.footer}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;