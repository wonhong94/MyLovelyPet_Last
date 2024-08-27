import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
// import Footer from '../components/Footer';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;