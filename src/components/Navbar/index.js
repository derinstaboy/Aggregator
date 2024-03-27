import React, { useState } from 'react';
import Logo from '../assests/images/logo.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './style.css';

export default function Navbar(props) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <>
      <header className="primary-header">
        <div className="container mobile-width">
          <div className="nav-wrapper" id="nav-wrapper">
            <div className="logo cursor-pointer">
              <img src={Logo} alt="" />
              <p>CroKing</p>
            </div>

            {/* Hamburger Icon for mobile */}
            <div className="hamburger" onClick={toggleDropdown}>
              {/* Icon bars */}
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <a href="https://app.croking.net/staking/boosted">Staking</a>
                <a href="https://app.croking.net/marketplace">NFT Marketplace</a>
                {/* Add other links as needed */}
              </div>
            )}

            <ConnectButton sx={{ color: '#020202' }} />
          </div>
        </div>
      </header>
    </>
  );
}
