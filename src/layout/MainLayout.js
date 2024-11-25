import React, { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent/HeaderComponent';
import SidebarComponent from '../components/SidebarComponent/SidebarComponent';
import './MainLayout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`layout-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <SidebarComponent isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="layout-content">
        <HeaderComponent isOpen={isSidebarOpen} />
        <div className="layout-main">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
