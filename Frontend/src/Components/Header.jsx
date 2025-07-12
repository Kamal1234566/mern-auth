
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import './Header.css'; 
import { AppContent } from './AppContext';

const Header = () => {
  const {userData}=useContext(AppContent);
  return (
    <div className="header-container">
      <img src={assets.header_img} alt="Header" className="header-img" />

      <h1 className="header-title">
        Hey {userData?userData.name:'Developer'}!  <img src={assets.hand_wave} alt="👋" className="hand-icon" />
      </h1>

      <h2 className="header-subtitle">Welcome to our App</h2>

      <p className="header-description">
        Let’s start a quick product tour and we’ll have you up and running in no time!
      </p>

      <button className="get-started-btn">Get Started</button>
    </div>
  );
};

export default Header;
