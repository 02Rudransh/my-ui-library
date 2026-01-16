// src/components/Card/Card.jsx
import React from 'react';
import styles from './Card.module.css';

/**
 * Enhanced Card Component with modern design
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.header - Card header content
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {React.ReactNode} props.icon - Icon to display in header
 * @param {React.ReactNode} props.coverImage - Cover image for card
 * @param {string} props.coverAlt - Alt text for cover image
 * @param {boolean} props.hoverable - Add hover effect
 * @param {boolean} props.bordered - Show border
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 * @param {('default'|'elevated'|'outlined'|'gradient')} props.variant - Card variant
 * @param {string} props.backgroundColor - Custom background color
 * @param {string} props.borderColor - Custom border color
 */
const Card = ({
  children,
  header,
  footer,
  title,
  subtitle,
  icon,
  coverImage,
  coverAlt = 'Card cover',
  hoverable = false,
  bordered = true,
  onClick,
  className = '',
  variant = 'default',
  backgroundColor,
  borderColor,
  ...rest
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    hoverable && styles.hoverable,
    bordered && styles.bordered,
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  const cardStyle = {
    ...(backgroundColor && { '--card-bg': backgroundColor }),
    ...(borderColor && { '--card-border': borderColor }),
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={cardClasses}
      style={cardStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-variant={variant}
      {...rest}
    >
      {coverImage && (
        <div className={styles.cover}>
          <img src={coverImage} alt={coverAlt} className={styles.coverImage} />
        </div>
      )}

      {(header || title || subtitle || icon) && (
        <div className={styles.header}>
          {header || (
            <>
              {icon && <div className={styles.iconWrapper}>{icon}</div>}
              <div className={styles.headerContent}>
                {title && <h3 className={styles.title}>{title}</h3>}
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
              </div>
            </>
          )}
        </div>
      )
      }

      <div className={styles.body}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Card;