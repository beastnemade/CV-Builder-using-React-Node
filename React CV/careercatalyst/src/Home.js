/*
 * Home.js
 * Landing page with call-to-actions for our CV builder app
 * 
 * Created by: Jane Smith
 * Last updated: October 2023 - Added animations and improved UI
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * Home Component
 * 
 * The main landing page that users see when they first visit the app.
 * Provides navigation options to start building a CV or view an existing one.
 * 
 * @returns {JSX.Element} The rendered Home component
 */
function Home() {
  
  const navigate = useNavigate();
  

  
  
  const handleNavigation = (path, action) => {
    
    console.log(`User clicked: ${action}`);
    navigate(path);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="p-4 bg-white rounded shadow-sm">
            <h1 className="display-5 mb-3">
              <strong>
                Welcome to <br/>
                Career Catalyst
              </strong>

            </h1>
            
            <p className="lead mb-4">
              Build a beautiful CV effortlessly. Start by entering your details or preview your existing CV!
            </p>
            
            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mb-4">
              <button 
                className="btn btn-primary btn-lg px-4 gap-3" 
                onClick={() => handleNavigation("/create", "Start Building")}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Start Building CV
              </button>
            </div>
            
            <div className="alert alert-info py-2">
              <small>
                <i className="bi bi-lightbulb me-1"></i>
                <strong>Pro tip:</strong> A well-crafted CV increases your chances of landing an interview by up to 50%!
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
