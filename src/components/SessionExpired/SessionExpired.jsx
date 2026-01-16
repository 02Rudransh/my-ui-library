// ==================== SESSION EXPIRED COMPONENT ====================
// src/components/SessionExpired/SessionExpired.jsx
import React, { useState, useEffect } from 'react';
import styles from './SessionExpired.module.css';

export const SessionExpired = ({
    title = 'Session Expired',
    message = 'Your session has expired. Please sign in again to continue.',
    countdown = 10,
    onRedirect,
    redirectUrl = '/login',
    showCountdown = true,
    icon = '⏱️',
    primaryButtonText = 'Sign In Again',
    secondaryButtonText,
    onSecondaryClick,
    className = '',
    ...rest
}) => {
    const [timeLeft, setTimeLeft] = useState(countdown);

    useEffect(() => {
        if (!showCountdown || timeLeft <= 0) {
            if (timeLeft === 0) {
                handleRedirect();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showCountdown]);

    const handleRedirect = () => {
        if (onRedirect) {
            onRedirect();
        } else if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    };

    const containerClasses = [
        styles.container,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses} {...rest}>
            <div className={styles.card}>
                <div className={styles.icon}>{icon}</div>

                <h1 className={styles.title}>{title}</h1>

                <p className={styles.message}>{message}</p>

                {showCountdown && timeLeft > 0 && (
                    <div className={styles.countdown}>
                        <div className={styles.countdownCircle}>
                            <span className={styles.countdownNumber}>{timeLeft}</span>
                        </div>
                        <p className={styles.countdownText}>
                            Redirecting in {timeLeft} second{timeLeft !== 1 ? 's' : ''}...
                        </p>
                    </div>
                )}

                <div className={styles.actions}>
                    <button
                        className={styles.primaryButton}
                        onClick={handleRedirect}
                    >
                        {primaryButtonText}
                    </button>

                    {secondaryButtonText && (
                        <button
                            className={styles.secondaryButton}
                            onClick={onSecondaryClick}
                        >
                            {secondaryButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default
    SessionExpired;