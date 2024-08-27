import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SidebarItem.css';

const SidebarItem = ({ title, subItems, isOpen, onClick, isSelected }) => {
  return (
    <div className={`sidebar-item ${isSelected ? 'selected' : ''}`}>
      <div className="sidebar-title" onClick={onClick}>
        {title}
      </div>
      {isOpen && (
        <ul className="sidebar-submenu">
          {subItems.map((subItem, index) => (
            <li key={index}>
              <Link to={subItem.path}>{subItem.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarItem;
