import React, { useState, useEffect } from 'react';
import { FiHome, FiUser, FiSettings, FiMail, FiEdit, FiDelete, FiCheck, FiX, FiAlertTriangle, FiInfo, FiShoppingCart, FiPackage, FiGrid, FiAward, FiBarChart, FiCalendar, FiDollarSign, FiFileText, FiBriefcase, FiUsers, FiGlobe, FiBook, FiBell } from 'react-icons/fi';

// Import all your components
import Button from '../src/components/Button';
import Input from '../src/components/Input';
import Modal from '../src/components/Modal';
import Card from '../src/components/Card';
import { ToastContainer } from '../src/components/Toast';
import { useToast } from '../src/hooks/useToast';
import Table from '../src/components/Table';
import Sidebar, { SidebarItem } from '../src/components/Sidebar';
import Dropdown from '../src/components/Dropdown';
import SearchBar from '../src/components/SearchBar';
import DatePicker from '../src/components/DatePicker';
import FilePicker from '../src/components/FilePicker';
import { FaBell, FaCapsules, FaUsers } from 'react-icons/fa';
import { FaMoneyCheckDollar } from 'react-icons/fa6';
import './App.css'
import NavbarComponents from './components/Navbar';
const { Navbar, NavbarItem, NavbarSubItem, NavbarDropdown } = NavbarComponents;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, success, error, warning, info, alert, removeToast, setToastPosition } = useToast();
  const [email, setEmail] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToastPosition, setSelectedToastPosition] = useState('top-right');

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'action',
      label: 'Action',
      render: (value, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="edit"
            size="small"
            icon={<FiEdit />}
            onClick={() => handleEditUser(row)}
          >
            Edit
          </Button>
          <Button
            variant="delete"
            size="small"
            icon={<FiDelete />}
            onClick={() => handleDeleteUser(row)}
          >
            Delete
          </Button>
        </div>
      )
    },
  ];

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
    { id: 5, name: 'John Doe', email: 'john@example.com' },
    { id: 6, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const dropdownOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  const handleLoadingClick = () => {
    setIsLoading(true);
    success('Loading started! This will complete in 2 seconds.');

    setTimeout(() => {
      setIsLoading(false);
      success('Loading completed successfully!', { duration: 2000 });
    }, 2000);
  };

  const handleEditUser = (user) => {
    success(`Editing user: ${user.name}`, { duration: 3000 });
    info(`User email: ${user.email}`, { duration: 4000 });
  };

  const handleDeleteUser = (user) => {
    warning(`Are you sure you want to delete ${user.name}?`, {
      duration: 5000,
      showCloseButton: true
    });
  };

  const handleSaveSettings = () => {
    success('Settings saved successfully!', {
      position: selectedToastPosition,
      duration: 3000
    });
  };

  const handleFormSubmit = () => {
    if (!email) {
      error('Please enter your email address!', {
        position: 'top-center',
        duration: 3000
      });
      return;
    }

    if (!email.includes('@')) {
      warning('Please enter a valid email address!', {
        position: 'top-center',
        duration: 3000
      });
      return;
    }

    success('Form submitted successfully!', {
      position: 'bottom-center',
      duration: 3000
    });
  };

  const handleFileUpload = () => {
    info('File upload in progress...', {
      duration: 2000
    });

    setTimeout(() => {
      success('File uploaded successfully!', {
        position: 'bottom-right',
        duration: 3000
      });
    }, 2000);
  };

  const handlePositionChange = (position) => {
    setSelectedToastPosition(position);
    setToastPosition(position);
    info(`Toast position changed to: ${position}`, {
      position: position,
      duration: 2000
    });
  };

  // Simulate an API call on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      info('Welcome to the UI Library Demo!', {
        position: selectedToastPosition,
        duration: 3000
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate periodic notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const notifications = [
        () => info('New update available! Check the settings.', { duration: 3000 }),
        () => success('System running smoothly.', { duration: 3000 }),
        () => warning('Storage at 80% capacity.', { duration: 3000 })
      ];

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      randomNotification();
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const [navbarVariant, setNavbarVariant] = useState('default');
  const [navbarBackground, setNavbarBackground] = useState('light');

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    avatar: null
  };

  // Navbar variants
  const navbarVariants = [
    { id: 'default', label: 'Default', icon: '📱' },
    { id: 'compact', label: 'Compact', icon: '📏' },
    { id: 'large', label: 'Large', icon: '🔼' }
  ];

  const navbarBackgrounds = [
    { id: 'light', label: 'Light', color: '#ffffff' },
    { id: 'dark', label: 'Dark', color: '#111827' },
    { id: 'primary', label: 'Primary', color: '#3b82f6' }
  ];

  const handleLogout = () => {
    success('Logged out successfully!', { duration: 2000 });
  };

  const handleNavbarVariantChange = (variant) => {
    setNavbarVariant(variant);
    info(`Navbar variant changed to: ${variant}`, { duration: 1500 });
  };

  const handleNavbarBackgroundChange = (background) => {
    setNavbarBackground(background);
    info(`Navbar background changed to: ${background}`, { duration: 1500 });
  };



  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        title={
          <>
            <div>UI Library</div>
          </>
        }
      >
        <SidebarItem
          icon={<FiHome />}
          label="Dashboard"
          active={activeItem === 'dashboard'}
          onClick={() => setActiveItem('dashboard')}
        />
        <SidebarItem
          icon={<FiUser />}
          label="Users"
          active={activeItem === 'users'}
          onClick={() => setActiveItem('users')}
        >
          <SidebarItem
            icon={<FaUsers />}
            label="All Users"
            active={activeItem === 'all-users'}
            onClick={() => setActiveItem('all-users')}
          />
          <SidebarItem
            icon={<FiUser />}
            label="Admins"
            active={activeItem === 'admins'}
            onClick={() => setActiveItem('admins')}
          />
          <SidebarItem
            icon={<FaMoneyCheckDollar />}
            label="Moderators"
            active={activeItem === 'moderators'}
            onClick={() => setActiveItem('moderators')}
          />
        </SidebarItem>
        <SidebarItem
          icon={<FiSettings />}
          label="Settings"
          active={activeItem === 'settings'}
          onClick={() => setActiveItem('settings')}
        >
          <SidebarItem
            icon={<FaCapsules />}
            label="General"
            active={activeItem === 'general'}
            onClick={() => setActiveItem('general')}
          />
          <SidebarItem
            icon={<FiSettings />}
            label="Security"
            active={activeItem === 'security'}
            onClick={() => setActiveItem('security')}
          />
          <SidebarItem
            icon={<FaBell />}
            label="Notifications"
            active={activeItem === 'notifications'}
            onClick={() => setActiveItem('notifications')}
          />
        </SidebarItem>
        <SidebarItem
          icon={<FiMail />}
          label="Messages"
          active={activeItem === 'messages'}
          onClick={() => setActiveItem('messages')}
        />
      </Sidebar>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', color: 'black', background: 'white' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          🎨 UI Library Demo
        </h1>


        {/* Buttons Section - Show ALL Variants */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Button Variants (All Types)
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              Main Action Buttons
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Button variant="primary" onClick={() => success('Primary action completed!')}>Primary</Button>
              <Button variant="save" onClick={handleSaveSettings}>Save</Button>
              <Button variant="submit" onClick={handleFormSubmit}>Submit</Button>
              <Button variant="add" onClick={() => success('New item added successfully!')}>Add New</Button>
              <Button variant="success" onClick={() => success('Success action triggered!')}>Success</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              Danger & Warning Buttons
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Button variant="delete" onClick={() => error('Item deleted permanently!')}>Delete</Button>
              <Button variant="danger" onClick={() => error('Danger! Operation cannot be undone.')}>Danger</Button>
              <Button variant="warning" onClick={() => warning('Warning: This action may have side effects.')}>Warning</Button>
              <Button variant="reset" onClick={() => info('Form has been reset to default values.')}>Reset</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              Informational & Utility Buttons
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Button variant="edit" onClick={() => info('Edit mode activated.')}>Edit</Button>
              <Button variant="info" onClick={() => info('This is an informational message.')}>Info</Button>
              <Button variant="secondary" onClick={() => success('Secondary action completed.')}>Secondary</Button>
              <Button variant="cancel" onClick={() => warning('Operation cancelled by user.')}>Cancel</Button>
              <Button variant="close" onClick={() => info('Window closed successfully.')}>Close</Button>
              <Button variant="draft" onClick={() => info('Document saved as draft.')}>Draft</Button>
              <Button variant="view" onClick={() => success('View mode activated.')}>View</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              File & Data Buttons
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Button variant="upload" onClick={handleFileUpload}>Upload</Button>
              <Button variant="download" onClick={() => success('Download started successfully!')}>Download</Button>
              <Button variant="export" onClick={() => info('Exporting data, please wait...')}>Export</Button>
              <Button variant="share" onClick={() => success('Link copied to clipboard!')}>Share</Button>
              <Button variant="print" onClick={() => info('Print dialog opened.')}>Print</Button>
              <Button variant="send" onClick={() => success('Message sent successfully!')}>Send</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              Special Purpose Buttons
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Button variant="search" onClick={() => info('Searching... Please wait.')}>Search</Button>
              <Button variant="filter" onClick={() => success('Filters applied successfully!')}>Filter</Button>
              <Button variant="lock" onClick={() => warning('Content locked for editing.')}>Lock</Button>
              <Button variant="unlock" onClick={() => success('Content unlocked successfully.')}>Unlock</Button>
              <Button variant="favorite" onClick={() => success('Added to favorites!')}>Favorite</Button>
              <Button variant="cart" onClick={() => success('Item added to cart!')}>Add to Cart</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              Button Sizes
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <Button variant="primary" size="small" onClick={() => success('Small action completed!')}>Small</Button>
              <Button variant="primary" size="medium" onClick={() => success('Medium action completed!')}>Medium</Button>
              <Button variant="primary" size="large" onClick={() => success('Large action completed!')}>Large</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              Button States
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Button variant="primary" loading={isLoading} onClick={handleLoadingClick}>
                {isLoading ? 'Loading...' : 'Click to Load'}
              </Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" fullWidth onClick={() => success('Full width button clicked!')}>Full Width</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              Button Styles & Modifiers
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Button variant="primary" withShadow={false} onClick={() => info('No shadow button clicked.')}>No Shadow</Button>
              <Button variant="primary" withGradient={false} onClick={() => info('No gradient button clicked.')}>No Gradient</Button>
              <Button variant="primary" rounded onClick={() => success('Rounded button clicked!')}>Rounded</Button>
              <Button variant="primary" iconPosition="right" onClick={() => info('Icon right button clicked.')}>Icon Right</Button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4b5563' }}>
              Custom Icon Buttons
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Button variant="primary" icon={<FiMail />} onClick={() => success('Mail action completed!')}>With Mail Icon</Button>
              <Button variant="save" icon={<FiUser />} iconPosition="right" onClick={() => success('User saved successfully!')}>
                Save User
              </Button>
              <Button variant="danger" icon={<FiSettings />} onClick={() => error('Dangerous settings changed!')}>Danger Settings</Button>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Inputs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<FiMail />}
              onBlur={() => {
                if (email && email.includes('@')) {
                  success('Email format is valid!');
                }
              }}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              onFocus={() => info('Password must be at least 8 characters long.')}
            />

            <Input
              label="Lockup"
              type="text"
              placeholder="Test Lockup"
              lockup={true}
              onSearchClick={() => success('Search functionality activated!')}
            />
          </div>
        </section>

        {/* Dropdown Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Dropdown
          </h2>
          <div >
            <Dropdown
              label="Select Option"
              fullWidth={true}
              options={dropdownOptions}
              placeholder="Choose one..."
              onChange={(value) => {
                const option = dropdownOptions.find(opt => opt.value === value);
                success(`Selected: ${option?.label}`, { duration: 2000 });
              }}
            />
          </div>
        </section>

        {/* SearchBar Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Search Bar
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Basic Search */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#4b5563' }}>
                Basic Search
              </h3>
              <SearchBar
                placeholder="Search products..."
                onSearch={(value) => {

                  if (value) {
                    info(`Searching for: "${value}"`, { duration: 2000 });
                  }
                }}
              />
            </div>

            {/* Search with Loading State */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#4b5563' }}>
                Search with Loading State
              </h3>
              <SearchBar
                placeholder="Search users..."
                onSearch={(value) => {
                  // if (value) {
                  //   success(`Found users matching: "${value}"`, { duration: 3000 });
                  // }
                }}
                loading={false}
              />
            </div>
          </div>
        </section>

        {/* DatePicker Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Date Picker
          </h2>
          <div >
            <DatePicker
              label="Select Date"
              onChange={(date) => {
                const formatted = date.toLocaleDateString();
                success(`Selected date: ${formatted}`, { duration: 2000 });
              }}
            />
          </div>
        </section>

        {/* FilePicker Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            File Picker
          </h2>
          <FilePicker
            png={true}
            jpg={true}
            pdf={true}
            xls={true}
            xlsx={true}
            preview={true}
            label="Upload Files"
            accept=".jpg,.png,.pdf,.exl"
            multiple
            onChange={(files) => {
              if (files && files.length > 0) {
                const fileNames = files.map(f => f.name).join(', ');
                success(`${files.length} file(s) selected: ${fileNames}`, {
                  duration: 4000,
                  position: 'bottom-right'
                });
              }
            }}
          />
        </section>

        {/* Cards Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Cards
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <Card
              title={
                <>
                  <div style={{ padding: '10px' }}>
                    User Details
                  </div>
                </>
              }
              footer={
                <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                  <Button variant="cancel" size="small" onClick={() => warning('Changes discarded.')}>Cancel</Button>
                  <Button variant="save" size="small" onClick={() => success('User details saved!')}>Save</Button>
                </div>
              }
            >
              <div style={{ padding: '10px' }}>This is a card with header and footer.</div>
            </Card>
            <Card title=
              <>
                <div style={{ padding: '10px' }}>
                  Statistics
                </div>
              </>
              variant="elevated"
            >
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', padding: '10px' }}>1,234</div>
              <div style={{ color: '#6b7280', padding: '10px' }}>Total Users</div>
              <Button
                variant="view"
                size="small"
                onClick={() => info('Viewing detailed statistics...')}
                style={{ margin: '10px' }}
              >
                View Details
              </Button>
            </Card>
          </div>
        </section>

        {/* Modal Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Modal
          </h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Test Modal"
            className='modal'
            footer={
              <>
                <Button variant="cancel" onClick={() => {
                  setIsModalOpen(false);
                  warning('Modal cancelled!');
                }}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => {
                  setIsModalOpen(false);
                  success('Modal confirmed successfully!');
                }}>
                  Confirm
                </Button>
              </>
            }
          >
            <p>This is a modal dialog for testing.</p>
          </Modal>
        </section>

        {/* Toast Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Toast Notifications
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Button variant="primary" size="small" onClick={() => success('Success! Operation completed successfully.', { duration: 3000 })}>
              Success
            </Button>
            <Button variant="delete" size="small" onClick={() => error('Error! Something went wrong. Please try again.', { duration: 3000 })}>
              Error
            </Button>
            <Button variant="warning" size="small" onClick={() => warning('Warning! Please check your input before proceeding.', { duration: 3500 })}>
              Warning
            </Button>
            <Button variant="alert" size="small" onClick={() => alert('Alert! Please check your input before proceeding.', { duration: 3500 })}>
              Alert
            </Button>
            <Button variant="info" size="small" onClick={() => info('Info: This is an informational message.', { duration: 2500 })}>
              Info
            </Button>
            {/* <Button variant="alert" size="small" onClick={() => alert('Alert: Important system notification!', { duration: 5000 })}>
              Alert
            </Button> */}
          </div>

          <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
              Toast Usage Examples
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {/* <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  // Multiple toasts at once
                  info('Starting batch process...', { duration: 1000 });
                  setTimeout(() => success('Step 1 completed!', { duration: 1000 }), 1200);
                  setTimeout(() => success('Step 2 completed!', { duration: 1000 }), 2400);
                  setTimeout(() => success('Batch process finished!', { duration: 2000 }), 3600);
                }}
              >
                Batch Process
              </Button> */}

              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  // Toast with custom position
                  success('Custom positioned toast!', {
                    position: 'bottom-left',
                    duration: 3000
                  });
                }}
              >
                Bottom Left
              </Button>

              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  // Toast without auto-close
                  info('This toast will stay until you close it.', {
                    duration: 0,
                    showCloseButton: true
                  });
                }}
              >
                Persistent Toast
              </Button>

              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  // Long message toast
                  success('This is a longer toast message that demonstrates how the toast component handles multiline content and longer text that might wrap to multiple lines.', {
                    duration: 5000
                  });
                }}
              >
                Long Message
              </Button>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Table
          </h2>
          <Table
            columns={tableColumns}
            data={tableData}
            pagination={true}
            onRowClick={(row) => {
              info(`Clicked on: ${row.name}`, {
                position: selectedToastPosition,
                duration: 2000
              });
            }}
          />
        </section>
      </main>

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
        topCenter={true}
      // duration={1000}
      />
    </div>
  );
}

export default App;