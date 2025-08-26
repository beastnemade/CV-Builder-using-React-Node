/*
 * PersonalInfoForm.js
 * The first section users will fill out in our CV builder
 * 
 * Created by: Jane Smith
 * Last updated: October 2023 - Added validation and UI improvements
 * 
 * TODO: 
 * - Add social media links section
 * - Consider adding profile picture upload
 * - Implement auto-save functionality
 */
import React, { useState, useContext, useEffect, useRef } from "react";
import { CVContext, CV_ACTIONS } from "./CVContext";

import "bootstrap-icons/font/bootstrap-icons.css";

/**
 * Personal Information Form Component
 * 
 * This is the first form users see - collects basic contact info
 * I'm using local state here with useEffect to sync to global state
 * This gives us better performance than updating global on every keystroke
 * 
 * @author Jane Smith
 * @version 1.2.0
 */
function PersonalInfoForm() {
  
  const { cvState, dispatch } = useContext(CVContext);
  
  
  const [formData, setFormData] = useState(cvState.personalInfo);
  
  
  const [errors, setErrors] = useState({});
  
  
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  
  
  useEffect(() => {
    
    if (!formData.fullName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [formData.fullName]);
  
  
  
  useEffect(() => {
    const timer = setTimeout(() => {
      
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
      
      
      if (Object.keys(validationErrors).length === 0) {
        dispatch({ 
          type: CV_ACTIONS.UPDATE_PERSONAL_INFO, 
          payload: {...formData} 
        });
      }
    }, 300); 
    
    return () => clearTimeout(timer); 
    
  }, [formData]); 

  /**
   * Validates the form data
   * @param {Object} data - The form data to validate
   * @returns {Object} - Validation errors object
   */
  const validateForm = (data) => {
    const newErrors = {};
    
    
    if (!data.fullName || data.fullName.trim() === '') {
      newErrors.fullName = 'Name is required';
    }
    
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    
    if (data.phone && !/^[\d\s\-()+]+$/.test(data.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    
    if (data.summary && data.summary.length > 500) {
      newErrors.summary = 'Summary should be less than 500 characters';
    }
    
    return newErrors;
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    
    
    if (name === 'fullName' || name === 'email') {
      
      setFormData(prevData => ({ 
        ...prevData, 
        [name]: value 
      }));
    } else {
      
      const updatedData = { ...formData };
      updatedData[name] = value;
      setFormData(updatedData);
    }
    
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  
  
  const renderField = (name, placeholder, type = "text", colSize = "col-md-6", icon = null, ref = null) => {
    
    const fieldIcon = icon || getDefaultIcon(name);
    
    return (
      <div className={colSize}>
        <label htmlFor={name} className="form-label small text-muted mb-1">
          {fieldIcon && <i className={`bi bi-${fieldIcon} me-1`}></i>}
          {placeholder}
          {name === 'fullName' && <span className="text-danger ms-1">*</span>}
        </label>
        <input
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
          placeholder={getPlaceholderExample(name)}
          type={type}
          ref={ref}
          aria-describedby={`${name}-help`}
        />
        {errors[name] && (
          <div className="invalid-feedback">{errors[name]}</div>
        )}
        {name === 'phone' && (
          <div id="phone-help" className="form-text">Include country code for international CVs</div>
        )}
      </div>
    );
  };
  
  
  const getDefaultIcon = (fieldName) => {
    const iconMap = {
      fullName: 'person',
      email: 'envelope',
      phone: 'telephone',
      address: 'geo-alt',
      summary: 'file-text'
    };
    return iconMap[fieldName] || 'pencil';
  };
  
  
  const getPlaceholderExample = (fieldName) => {
    const placeholderMap = {
      fullName: 'e.g. Aditya Nemade',
      email: 'e.g. 23002171310089@example.com',
      phone: 'e.g. +91 9513574568',
      address: 'e.g. Ahmedabad, Gujarat, India',
      summary: 'Briefly describe your professional background and key strengths...'
    };
    return placeholderMap[fieldName] || '';
  };

  
  const summaryLength = formData.summary ? formData.summary.length : 0;
  const summaryProgress = Math.min((summaryLength / 500) * 100, 100);
  const getProgressColor = () => {
    if (summaryProgress < 30) return 'bg-info';
    if (summaryProgress < 70) return 'bg-success';
    if (summaryProgress < 90) return 'bg-warning';
    return 'bg-danger';
  };
  
  
  
  const hasFilledRequiredFields = () => {
    return formData.fullName && formData.fullName.trim() !== '';
  };

  return (
    <section className="mb-4 p-3 border rounded shadow-sm" style={{ backgroundColor: '#fcfcfc' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">
          <i className="bi bi-person-vcard me-2"></i>
          Personal Information
        </h4>
        {hasFilledRequiredFields() && (
          <span className="badge bg-success">
            <i className="bi bi-check-circle me-1"></i>
            Complete
          </span>
        )}
      </div>
      
      <div className="row g-3">
        {/* Name field - this is required */}
        {renderField("fullName", "Full Name", "text", "col-md-6", "person-fill", nameInputRef)}
        
        {/* Email with validation */}
        {renderField("email", "Email Address", "email", "col-md-6", "envelope-fill", emailInputRef)}
        
        {/* Phone number */}
        {renderField("phone", "Phone Number", "tel", "col-md-6", "telephone-fill")}
        
        {/* Address field */}
        {renderField("address", "Address", "text", "col-md-6", "geo-alt-fill")}
        
        {/* Professional summary - larger field */}
        <div className="col-12">
          <label htmlFor="summary" className="form-label small text-muted mb-1">
            <i className="bi bi-file-text me-1"></i>
            Professional Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            className={`form-control ${errors.summary ? 'is-invalid' : ''}`}
            placeholder="Write a brief summary of your professional background and key strengths..."
            rows={3}
            maxLength={500}
            aria-describedby="summary-help"
          />
          
          {errors.summary && (
            <div className="invalid-feedback">{errors.summary}</div>
          )}
          
          <div className="mt-1">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small id="summary-help" className="form-text">
                Keep it concise - aim for 2-3 sentences that highlight your strengths.
              </small>
              <small className={summaryLength > 450 ? 'text-danger' : 'text-muted'}>
                3{summaryLength}/1000
              </small>
            </div>
            <div className="progress" style={{ height: '5px' }}>
              <div 
                className={`progress-bar ${getProgressColor()}`} 
                role="progressbar" 
                style={{ width: `${summaryProgress}%` }} 
                aria-valuenow={summaryLength} 
                aria-valuemin="0" 
                aria-valuemax="1000"
              ></div>
            </div>
          </div>
        </div>
        
        {/* Tips section - I like adding these little helpers */}
        <div className="col-12 mt-2">
          <div className="alert alert-info py-2">
            <small>
              <i className="bi bi-lightbulb me-1"></i>
              <strong>Pro tip:</strong> Your personal information section is the first thing employers see. Make sure your summary highlights your most relevant skills and experience.
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PersonalInfoForm;
