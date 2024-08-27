import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaBoxOpen, FaClipboardList, FaCheckCircle, FaTags, FaVideo } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
    {
      title: '매출',
      icon: <FaChartLine />,
      subItems: [
        { title: '연매출보기', path: '/salespage' },
      ],
    },
    {
      title: '재고',
      icon: <FaBoxOpen />,
      subItems: [
        { title: '재고현황보기', path: '/stock' },
      ],
    },
    {
      title: '발주',
      icon: <FaClipboardList />,
      subItems: [
        { title: '발주신청', path: '/orders' },
        { title: '발주내역', path: '/ordershistory' },
      ],
    },
    {
      title: '검수',
      icon: <FaCheckCircle />,
      subItems: [
        { title: '검수하기', path: '/inspection' },
        { title: '검수내역', path: '/inspectionhistory' },
      ],
    },
    {
      title: '상품',
      icon: <FaTags />,
      subItems: [
        { title: '상품관리', path: '/productmanagement' },
      ],
    },
    {
      title: 'CCTV',
      icon: <FaVideo />,
      subItems: [
        { title: 'CCTV', path: '/cctv' },
      ],
    },
  ];

  const handleMenuClick = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const isActive = (subItems) => {
    return subItems.some(subItem => subItem.path === location.pathname);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {menuItems.map((menuItem, index) => (
          <div
            key={index}
            className={`sidebar-item ${isActive(menuItem.subItems) || openMenu === index ? 'active' : ''}`}
          >
            <div className="sidebar-title" onClick={() => handleMenuClick(index)}>
              <div className="icon">{menuItem.icon}</div>
              <span className="title">{menuItem.title}</span>
            </div>
            {(isActive(menuItem.subItems) || openMenu === index) && (
              <ul className="sidebar-submenu">
                {menuItem.subItems.map((subItem, subIndex) => (
                  <li key={subIndex} className={subItem.path === location.pathname ? 'active' : ''}>
                    <Link to={subItem.path} style={{ color: '#000' }}>{subItem.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
