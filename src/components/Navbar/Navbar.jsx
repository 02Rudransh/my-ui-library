import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronRight, FiUser, FiSettings, FiLogOut, FiBell, FiHelpCircle } from 'react-icons/fi';
import styles from './Navbar.module.css';

// NavbarDropdown Component
export const NavbarDropdown = ({ children, align = 'right', type = 'dropdown' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 200);
    };

    const dropdownClasses = [
        styles.dropdownMenu,
        styles[`align-${align}`],
        type === 'mega' && styles.megaMenu
    ].filter(Boolean).join(' ');

    return (
        <div
            className={styles.dropdownContainer}
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isOpen && (
                <div className={dropdownClasses}>
                    {children}
                </div>
            )}
        </div>
    );
};

// Main Navbar Component
export const Navbar = ({
    logo,
    title,
    children,
    actions,
    user,
    onLogout,
    className = '',
    sticky = true,
    variant = 'default',
    background = 'light',
    ...rest
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const navbarClasses = [
        styles.navbar,
        styles[variant],
        styles[`bg-${background}`],
        sticky && styles.sticky,
        className
    ].filter(Boolean).join(' ');

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleDropdownToggle = (dropdownId) => {
        setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
    };

    return (
        <nav className={navbarClasses} {...rest}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    {logo && <div className={styles.logo}>{logo}</div>}
                    {title && <h1 className={styles.title}>{title}</h1>}
                </div>

                {/* Desktop Menu */}
                <div className={styles.menu}>{children}</div>

                {/* Actions */}
                <div className={styles.actions}>
                    {actions}
                    <div className={styles.actionButtons}>
                        <button className={styles.actionButton} aria-label="Notifications">
                            <FiBell />
                            <span className={styles.badge}>3</span>
                        </button>
                        <button className={styles.actionButton} aria-label="Help">
                            <FiHelpCircle />
                        </button>
                    </div>

                    {user && (
                        <div className={styles.userDropdownContainer}>
                            <div className={styles.userProfile}>
                                <div className={styles.avatar}>
                                    {user.avatar || (
                                        <div className={styles.avatarFallback}>
                                            {user.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user.name}</span>
                                    <span className={styles.userRole}>{user.role}</span>
                                </div>
                                <FiChevronDown className={styles.userDropdownIcon} />
                            </div>
                            <div className={`${styles.userDropdownMenu} ${styles['align-right']}`}>
                                <div className={styles.userDropdownHeader}>
                                    <div className={styles.avatarLarge}>
                                        {user.avatar || (
                                            <div className={styles.avatarFallbackLarge}>
                                                {user.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.userDropdownInfo}>
                                        <div className={styles.userName}>{user.name}</div>
                                        <div className={styles.userEmail}>{user.email}</div>
                                    </div>
                                </div>
                                <div className={styles.dropdownDivider} />
                                <a href="#" className={styles.dropdownItem}>
                                    <FiUser className={styles.dropdownItemIcon} />
                                    <span>My Profile</span>
                                </a>
                                <a href="#" className={styles.dropdownItem}>
                                    <FiSettings className={styles.dropdownItemIcon} />
                                    <span>Account Settings</span>
                                </a>
                                <div className={styles.dropdownDivider} />
                                <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={onLogout}>
                                    <FiLogOut className={styles.dropdownItemIcon} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={styles.mobileToggle}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen}
                >
                    <span className={styles.mobileToggleIcon}>
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileMenuContent}>
                    {React.Children.map(children, (child, index) => {
                        if (React.isValidElement(child) && child.type === NavbarItem) {
                            const dropdownId = `mobile-dropdown-${index}`;
                            const hasChildren = child.props.children && React.Children.count(child.props.children) > 1;

                            return (
                                <div key={index} className={styles.mobileMenuItem}>
                                    {hasChildren ? (
                                        <>
                                            <button
                                                className={`${styles.mobileMenuButton} ${activeDropdown === dropdownId ? styles.active : ''}`}
                                                onClick={() => handleDropdownToggle(dropdownId)}
                                            >
                                                {child.props.icon && (
                                                    <span className={styles.mobileMenuIcon}>{child.props.icon}</span>
                                                )}
                                                <span className={styles.mobileMenuText}>{child.props.children[0]}</span>
                                                <FiChevronRight className={`${styles.mobileMenuArrow} ${activeDropdown === dropdownId ? styles.rotated : ''}`} />
                                            </button>
                                            <div className={`${styles.mobileSubmenu} ${activeDropdown === dropdownId ? styles.open : ''}`}>
                                                {React.Children.toArray(child.props.children).slice(1).map((subItem, subIndex) => (
                                                    <a
                                                        key={subIndex}
                                                        href="#"
                                                        className={styles.mobileSubmenuItem}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {subItem}
                                                    </a>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <a
                                            href="#"
                                            className={styles.mobileMenuButton}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {child.props.icon && (
                                                <span className={styles.mobileMenuIcon}>{child.props.icon}</span>
                                            )}
                                            <span className={styles.mobileMenuText}>{child.props.children}</span>
                                        </a>
                                    )}
                                </div>
                            );
                        }
                        return child;
                    })}

                    {user && (
                        <>
                            <div className={styles.mobileUserSection}>
                                <div className={styles.mobileUserInfo}>
                                    <div className={styles.avatar}>
                                        {user.avatar || (
                                            <div className={styles.avatarFallback}>
                                                {user.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className={styles.userName}>{user.name}</div>
                                        <div className={styles.userEmail}>{user.email}</div>
                                    </div>
                                </div>
                                <button className={styles.mobileLogoutButton} onClick={onLogout}>
                                    <FiLogOut />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

// NavbarItem Component
export const NavbarItem = ({ children, active = false, icon, href = '#', ...props }) => {
    const [isHovered, setIsHovered] = useState(false);
    const itemRef = useRef(null);

    return (
        <div className={styles.navItemContainer}>
            <a
                ref={itemRef}
                href={href}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                {...props}
            >
                {icon && <span className={styles.navIcon}>{icon}</span>}
                <span className={styles.navText}>{children}</span>
                {React.Children.count(children) > 1 && (
                    <FiChevronDown className={`${styles.navArrow} ${isHovered ? styles.rotated : ''}`} />
                )}
            </a>
            {isHovered && React.Children.count(children) > 1 && (
                <div className={styles.navItemDropdown}>
                    {React.Children.toArray(children).slice(1)}
                </div>
            )}
        </div>
    );
};

// NavbarSubItem Component
export const NavbarSubItem = ({ children, icon, href = '#', description, ...props }) => {
    return (
        <a href={href} className={styles.subItem} {...props}>
            {icon && <span className={styles.subItemIcon}>{icon}</span>}
            <div className={styles.subItemContent}>
                <div className={styles.subItemTitle}>{children}</div>
                {description && <div className={styles.subItemDescription}>{description}</div>}
            </div>
        </a>
    );
};

// Default export
const NavbarComponents = {
    Navbar,
    NavbarItem,
    NavbarSubItem,
    NavbarDropdown
};

export default NavbarComponents;