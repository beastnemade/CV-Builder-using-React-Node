/*
 * Header.js
 * Navigation component for the CV builder app
 * 
 * Created by: Jane Smith
 * Last updated: October 2023 - Added active link highlighting
 */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * Header Component
 * 
 * Provides navigation links and branding for the application.
 * Highlights the active route and provides responsive navigation.
 * 
 * @returns {JSX.Element} The rendered Header component
 */
function Header() {
  
  const location = useLocation();
  
  
  const [menuOpen, setMenuOpen] = useState(false);
  
  
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        {/* Brand with icon */}
        <Link className="navbar-brand fw-bold d-inline-flex align-items-center" to="/">
          <img src="cata.png" alt="Career Catalyst" style={{width: "95px", height: "auto", marginRight: "10px"}} />
          Career Catalyst
        </Link>
        
        {/* Mobile toggle button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarNav" 
          aria-expanded={menuOpen ? "true" : "false"} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navigation links */}
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="bi bi-house me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/create')}`} to="/create">
                <i className="bi bi-pencil-square me-1"></i>
                Create CV
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/preview')}`} to="/preview">
                <i className="bi bi-eye me-1"></i>
                Preview CV
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
