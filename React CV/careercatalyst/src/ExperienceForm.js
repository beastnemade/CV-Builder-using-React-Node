/**
 * ExperienceForm.js
 * 
 * @author Sarah Johnson
 * @created 2023-04-15
 * @updated 2023-09-22 - Added validation for year fields
 * 
 * Component for managing work experience entries in the CV builder.
 * Allows users to add, edit, and remove work experience with validation.
 * 
 * TODO: 
 * - Add edit functionality for existing entries
 * - Consider adding company location field
 * - Implement drag-and-drop reordering
 */
import React, { useState, useContext, useRef } from "react";
import { CVContext, CV_ACTIONS } from "./CVContext";


function ExperienceForm() {
  
  const { cvState, dispatch } = useContext(CVContext);
  const currentYear = new Date().getFullYear();
  
  
  const [workExp, setWorkExp] = useState({
    company: "",
    title: "",
    startYear: "",
    endYear: "",
    description: ""
  });
  
  
  const [errors, setErrors] = useState({});
  
  
  const formRef = useRef(null);
  const companyInputRef = useRef(null);

  
  function handleInputChange(e) {
    const { name, value } = e.target;
    
    
    if (errors[name]) {
      const updatedErrors = {...errors};
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
    
    
    setWorkExp(prev => ({ ...prev, [name]: value }));
  }

  
  const validateForm = () => {
    const newErrors = {};
    
    
    if (!workExp.company.trim()) newErrors.company = "Company name is required";
    if (!workExp.title.trim()) newErrors.title = "Job title is required";
    
    
    if (workExp.startYear) {
      const startYearNum = parseInt(workExp.startYear);
      if (isNaN(startYearNum) || startYearNum < 1950 || startYearNum > currentYear) {
        newErrors.startYear = `Must be between 1950 and ${currentYear}`;
      }
    }
    
    if (workExp.endYear) {
      const endYearNum = parseInt(workExp.endYear);
      if (isNaN(endYearNum) || endYearNum < 1950 || endYearNum > currentYear + 10) {
        newErrors.endYear = `Must be between 1950 and ${currentYear + 10}`;
      }
    }
    
    
    if (workExp.startYear && workExp.endYear && 
        parseInt(workExp.startYear) > parseInt(workExp.endYear)) {
      newErrors.endYear = "End year must be after start year";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const submitExperience = (e) => {
    e.preventDefault();
    
    
    if (!validateForm()) return;
    
    
    const experienceEntry = {...workExp};
    
    
    dispatch({ 
      type: CV_ACTIONS.ADD_EXPERIENCE, 
      payload: experienceEntry 
    });
    
    
    setWorkExp({ company: "", title: "", startYear: "", endYear: "", description: "" });
    setErrors({});
    
    
    if (companyInputRef.current) {
      companyInputRef.current.focus();
    }
  };

  
  const deleteExperience = (idx) => {
    
    if (window.confirm("Are you sure you want to remove this experience?")) {
      dispatch({ type: CV_ACTIONS.REMOVE_EXPERIENCE, payload: idx });
    }
  };

  
  const renderField = (name, label, type = "text", placeholder = "", options = {}) => {
    return (
      <div className={options.colClass || "col-md-6"}>
        <label htmlFor={name} className="form-label">{label}</label>
        <input
          id={name}
          name={name}
          value={workExp[name]}
          onChange={handleInputChange}
          className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          type={type}
          ref={name === 'company' ? companyInputRef : null}
          min={type === 'number' ? options.min : undefined}
          max={type === 'number' ? options.max : undefined}
          {...options}
        />
        {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
      </div>
    );
  };

  return (
    <section className="mb-4 p-3 border rounded shadow-sm">
      <h4 className="mb-3">💼 Professional Experience</h4>
      
      {/* Experience entry form */}
      <form className="row g-3 mb-4" onSubmit={submitExperience} ref={formRef}>
        {renderField('company', 'Company Name', 'text', 'e.g. Acme Corporation', {
          colClass: 'col-md-6',
          required: true
        })}
        
        {renderField('title', 'Job Title', 'text', 'e.g. Senior Developer', {
          colClass: 'col-md-6',
          required: true
        })}
        
        {renderField('startYear', 'Start Year', 'number', '', {
          colClass: 'col-md-3',
          min: 1950,
          max: currentYear
        })}
        
        {renderField('endYear', 'End Year', 'number', '', {
          colClass: 'col-md-3',
          min: 1950,
          max: currentYear + 10,
        })}
        
        <div className="col-12">
          <label htmlFor="description" className="form-label">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={workExp.description}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Describe your responsibilities and achievements"
            rows={3}
          />
          <div className="form-text">Be concise but highlight key accomplishments</div>
        </div>
        
        <div className="col-12 d-flex justify-content-end">
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={!workExp.company || !workExp.title}
          >
            Add Experience
          </button>
        </div>
      </form>
      
      {/* Display existing experiences */}
      {cvState.experience.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No work experience added yet. Use the form above to add your professional history.
        </div>
      ) : (
        <div className="card">
          <div className="card-header bg-light">
            <strong>Your Experience ({cvState.experience.length})</strong>
          </div>
          <ul className="list-group list-group-flush">
            {cvState.experience.map((exp, idx) => (
              <li key={idx} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">{exp.company}</h5>
                    <div className="d-flex align-items-center mb-1">
                      <span className="badge bg-secondary me-2">{exp.title}</span>
                      <small className="text-muted">
                        {exp.startYear} - {exp.endYear || 'Present'}
                      </small>
                    </div>
                    {exp.description && (
                      <p className="mb-0 small">{exp.description}</p>
                    )}
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => deleteExperience(idx)}
                    title="Remove this experience"
                    aria-label="Remove experience"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default ExperienceForm;
