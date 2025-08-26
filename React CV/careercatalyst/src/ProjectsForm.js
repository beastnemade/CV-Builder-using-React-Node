/**
 * ProjectsForm.js
 * 
 * @author Sarah Johnson
 * @created 2023-04-20
 * @updated 2023-10-10 - Added validation and improved UI
 * 
 * Component for managing project entries in the CV builder.
 * Allows users to showcase their portfolio projects with descriptions.
 * 
 * TODO: 
 * - Add URL field for project links
 * - Add technology tags for each project
 * - Consider adding date range for project timeline
 */
import React, { useState, useContext, useRef } from "react";
import { CVContext, CV_ACTIONS } from "./CVContext";


function ProjectsForm() {
  
  const { cvState, dispatch } = useContext(CVContext);
  const nameInputRef = useRef(null);
  
  
  const [projectData, setProjectData] = useState({
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  
  function handleFieldChange(e) {
    const { name, value } = e.target;
    
    
    if (errors[name]) {
      const updatedErrors = {...errors};
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
    
    
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!projectData.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (projectData.name.length > 50) {
      newErrors.name = "Project name must be less than 50 characters";
    }
    
    if (projectData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (isEditing && editIndex !== null) {
      
      dispatch({ 
        type: CV_ACTIONS.UPDATE_PROJECT, 
        payload: { index: editIndex, project: {...projectData} }
      });
      setIsEditing(false);
      setEditIndex(null);
    } else {
      
      dispatch({ 
        type: CV_ACTIONS.ADD_PROJECT, 
        payload: {...projectData} 
      });
    }
    
    
    setProjectData({ name: "", description: "" });
    
    
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };
  
  
  const handleEdit = (project, idx) => {
    setProjectData({...project});
    setIsEditing(true);
    setEditIndex(idx);
    
    
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };
  
  
  const cancelEdit = () => {
    setProjectData({ name: "", description: "" });
    setIsEditing(false);
    setEditIndex(null);
    setErrors({});
  };
  
  
  const handleRemoveProject = (idx) => {
    if (window.confirm("Are you sure you want to remove this project?")) {
      dispatch({ type: CV_ACTIONS.REMOVE_PROJECT, payload: idx });
      
      
      if (isEditing && editIndex === idx) {
        cancelEdit();
      }
    }
  };

  return (
    <section className="mb-4 p-3 border rounded shadow-sm">
      <h4 className="mb-3">🚀 Projects & Portfolio</h4>
      
      {/* Project entry form */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-5">
            <label htmlFor="projectName" className="form-label">Project Name</label>
            <input
              id="projectName"
              ref={nameInputRef}
              name="name"
              value={projectData.name}
              onChange={handleFieldChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. E-commerce Website"
              maxLength={50}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          
          <div className="col-md-7">
            <label htmlFor="projectDescription" className="form-label">Description</label>
            <textarea
              id="projectDescription"
              name="description"
              value={projectData.description}
              onChange={handleFieldChange}
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              placeholder="Brief description of the project and your role"
              rows={2}
              maxLength={200}
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            <div className="form-text text-end">
              {projectData.description.length}/200 characters
            </div>
          </div>
          
          <div className="col-12 d-flex justify-content-end gap-2">
            {isEditing && (
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
            <button 
              className={`btn ${isEditing ? 'btn-info' : 'btn-primary'}`} 
              type="submit"
              disabled={!projectData.name.trim()}
            >
              {isEditing ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Display existing projects */}
      {cvState.projects.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No projects added yet. Showcase your work by adding relevant projects.
        </div>
      ) : (
        <div className="card">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <span><strong>Your Projects ({cvState.projects.length})</strong></span>
            <small className="text-muted">Click on a project to edit</small>
          </div>
          <ul className="list-group list-group-flush">
            {cvState.projects.map((project, idx) => (
              <li 
                key={idx} 
                className={`list-group-item ${editIndex === idx ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div onClick={() => handleEdit(project, idx)} className="flex-grow-1">
                    <h5 className="mb-1">{project.name}</h5>
                    {project.description && (
                      <p className="mb-0 text-secondary">{project.description}</p>
                    )}
                  </div>
                  <div className="ms-2 d-flex">
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProject(idx);
                      }}
                      title="Remove project"
                      aria-label={`Remove ${project.name}`}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Tips for users */}
      <div className="mt-3">
        <p className="text-muted small mb-0">
          <i className="bi bi-lightbulb me-1"></i>
          Tip: Include 2-4 of your most impressive and relevant projects. For each project, briefly describe your role and the impact.
        </p>
      </div>
    </section>
  );
}

export default ProjectsForm;
