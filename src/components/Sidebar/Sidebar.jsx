import React, { useState, useCallback, memo } from 'react';
import { FiChevronDown, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import styles from './Sidebar.module.css';

const Sidebar = ({
  children,
  collapsed = false,
  onToggle,
  title,
  header,
  footer,
  width = '250px',
  collapsedWidth = '70px',
  position = 'left',
  className = '',
  showToggle = true,
  ...rest
}) => {
  const sidebarClasses = [
    styles.sidebar,
    styles[`position-${position}`],
    collapsed && styles.collapsed,
    className
  ].filter(Boolean).join(' ');

  const sidebarStyle = {
    '--sidebar-width': width,
    '--sidebar-collapsed-width': collapsedWidth,
    width: collapsed ? collapsedWidth : width
  };

  const handleToggle = useCallback(() => {
    if (onToggle) onToggle(!collapsed);
  }, [onToggle, collapsed]);

  // Pass collapsed prop to all direct SidebarItem children
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { collapsed });
  });

  return (
    <aside
      className={sidebarClasses}
      style={sidebarStyle}
      aria-label="Main navigation"
      data-collapsed={collapsed}
      {...rest}
    >
      {/* Header Section */}
      {(header || title || showToggle) && (
        <header className={styles.header}>
          <div className={styles.headerContent}>
            {header || (
              <>
                {!collapsed && title && (
                  <h2 className={styles.title}>
                    <span className={styles.titleText}>{title}</span>
                  </h2>
                )}
                {showToggle && onToggle && (
                  <button
                    className={styles.headerToggle}
                    onClick={handleToggle}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                    {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
                  </button>
                )}
              </>
            )}
          </div>
        </header>
      )}

      {/* Navigation Section */}
      <nav className={styles.navSec} role="navigation" aria-label="Primary">
        <div className={styles.navSecContent} role="menubar">
          {enhancedChildren}
        </div>
      </nav>

      {/* Footer Section */}
      {footer && (
        <footer className={styles.footer}>
          {footer}
        </footer>
      )}
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
export default Sidebar;