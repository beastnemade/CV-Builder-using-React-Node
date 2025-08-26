import React, { useState, useContext } from "react";
import { CVContext, CV_ACTIONS } from "./CVContext";

function EducationForm() {
  const { cvState, dispatch } = useContext(CVContext);
  
  const [eduForm, setEduForm] = useState({
    school: "",
    degree: "",
    startYear: new Date().getFullYear() - 4, 
    endYear: new Date().getFullYear() 
  });

  function handleFormChange(e) {
    const { name, value } = e.target;
    setEduForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function submitEducation(e) {
    e.preventDefault();
    
    if (!eduForm.school || !eduForm.degree) {
      alert("Please fill out school and degree fields");
      return;
    }
    
    dispatch({ 
      type: CV_ACTIONS.ADD_EDUCATION, 
      payload: {...eduForm} 
    });
    
    setEduForm(prev => ({
      school: "",
      degree: "",
      startYear: prev.startYear,
      endYear: prev.endYear
    }));
  }

  const deleteEducation = (index) => {
    if (window.confirm("Remove this education entry?")) {
      dispatch({ type: CV_ACTIONS.REMOVE_EDUCATION, payload: index });
    }
  };

  const currentYear = new Date().getFullYear();
  
  return (
    <section className="mb-4 p-3 border rounded shadow-sm">
      <h4 className="mb-3">🎓 Education History</h4>
      
      <form className="row g-2 mb-3" onSubmit={submitEducation}>
        <div className="col-md-4">
          <label htmlFor="school" className="form-label small text-muted mb-1">School/University</label>
          <input
            id="school"
            name="school"
            value={eduForm.school}
            onChange={handleFormChange}
            className="form-control"
            placeholder="e.g. Lok Jagruti University"
          />
        </div>
        
        <div className="col-md-3">
          <label htmlFor="degree" className="form-label small text-muted mb-1">Degree/Certificate</label>
          <input
            id="degree"
            name="degree"
            value={eduForm.degree}
            onChange={handleFormChange}
            className="form-control"
            placeholder="e.g. B.Tech CST"
          />
        </div>
        
        <div className="col-md-2">
          <label htmlFor="startYear" className="form-label small text-muted mb-1">Start Year</label>
          <input
            id="startYear"
            name="startYear"
            value={eduForm.startYear}
            onChange={handleFormChange}
            className="form-control"
            placeholder="Start Year"
            type="number"
            min="1950"
            max={currentYear}
          />
        </div>
        
        <div className="col-md-2">
          <label htmlFor="endYear" className="form-label small text-muted mb-1">End Year</label>
          <input
            id="endYear"
            name="endYear"
            value={eduForm.endYear}
            onChange={handleFormChange}
            className="form-control"
            placeholder="End Year"
            type="number"
            min="1950"
            max={currentYear + 10} 
          />
        </div>
        
        <div className="col-md-1 d-flex align-items-end">
          <button className="btn btn-success w-100" type="submit" title="Add education entry">
            <i className="bi bi-plus"></i> Add
          </button>
        </div>
      </form>
      
      {cvState.education.length > 0 ? (
        <ul className="list-group">
          {cvState.education.map((edu, idx) => (
            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>{edu.school}</strong>
                <br />
                {edu.degree} ({edu.startYear} - {edu.endYear || 'Present'})
              </span>
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={() => deleteEducation(idx)}
                aria-label="Remove education entry"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-info">
          No education entries yet. Add your educational background above.
        </div>
      )}
    </section>
  );
}

export default EducationForm;
