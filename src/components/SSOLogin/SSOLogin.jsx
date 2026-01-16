// ==================== SSO LOGIN COMPONENT ====================
// src/components/SSOLogin/SSOLogin.jsx
import React from 'react';
import styles from './SSOLogin.module.css';

export const SSOLogin = ({
    providers = [],
    onProviderClick,
    title = 'Sign In',
    subtitle = 'Choose your preferred sign-in method',
    logo,
    footer,
    loading = false,
    error,
    className = '',
    ...rest
}) => {
    const defaultProviders = {
        google: {
            name: 'Google',
            icon: '🔍',
            color: '#4285f4'
        },
        microsoft: {
            name: 'Microsoft',
            icon: '🪟',
            color: '#00a4ef'
        },
        azure: {
            name: 'Azure AD',
            icon: '☁️',
            color: '#0078d4'
        },
        okta: {
            name: 'Okta',
            icon: '🔐',
            color: '#007dc1'
        },
        github: {
            name: 'GitHub',
            icon: '🐙',
            color: '#24292e'
        }
    };

    const containerClasses = [
        styles.container,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses} {...rest}>
            <div className={styles.card}>
                {logo && <div className={styles.logo}>{logo}</div>}

                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>

                {error && (
                    <div className={styles.error} role="alert">
                        {error}
                    </div>
                )}

                <div className={styles.providers}>
                    {providers.map((provider) => {
                        const providerConfig = typeof provider === 'string'
                            ? defaultProviders[provider.toLowerCase()]
                            : provider;

                        if (!providerConfig) return null;

                        return (
                            <button
                                key={providerConfig.name}
                                className={styles.providerButton}
                                onClick={() => onProviderClick?.(providerConfig)}
                                disabled={loading}
                                style={{
                                    borderColor: providerConfig.color,
                                    color: providerConfig.color
                                }}
                            >
                                <span className={styles.providerIcon}>{providerConfig.icon}</span>
                                <span>Sign in with {providerConfig.name}</span>
                            </button>
                        );
                    })}
                </div>

                {footer && <div className={styles.footer}>{footer}</div>}
            </div>
        </div>
    );
};

export default
    SSOLogin;