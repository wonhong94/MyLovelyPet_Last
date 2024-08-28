import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PetHeader.css';
import { VscHubot } from "react-icons/vsc";

const Header = () => {
  const location = useLocation();

  return (
    <header className="kiosk-header">
      <div className="header-left">
        {/* <button className="language-button"><IoIosGlobe size="40"/></button> */}
      </div>
      {location.pathname !== '/inquiry' && (
        <div className="header-right">
          <Link to="/chat">
            <button className="contact-button"><VscHubot size="40"/></button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;