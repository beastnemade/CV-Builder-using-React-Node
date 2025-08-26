/*
 * CVForm.js
 * Main form container component for the CV builder
 * 
 * Created by: Jane Smith
 * Last updated: October 2023 - Added section navigation and progress tracking
 */
import React, { useState, useContext, useEffect } from "react";
import { CVContext } from "./CVContext";
import PersonalInfoForm from "./PersonalInfoForm";
import EducationForm from "./EducationForm";
import ExperienceForm from "./ExperienceForm";
import SkillsForm from "./SkillsForm";
import ProjectsForm from "./ProjectsForm";
import 'bootstrap-icons/font/bootstrap-icons.css';

function CVForm() {
  
  const { cvState } = useContext(CVContext);
  
  
  const [activeSection, setActiveSection] = useState("personal");
  
  
  const [progress, setProgress] = useState(0);
  
  
  useEffect(() => {
    let completedSections = 0;
    let totalSections = 5; 
    
    
    if (cvState.personalInfo.fullName) completedSections++;
    
    
    if (cvState.education.length > 0) completedSections++;
    
    
    if (cvState.experience.length > 0) completedSections++;
    
    
    if (cvState.skills.length > 0) completedSections++;
    
    
    if (cvState.projects.length > 0) completedSections++;
    
    
    setProgress(Math.round((completedSections / totalSections) * 100));
  }, [cvState]);
  
  
  const scrollToSection = (sectionId, sectionName) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionName);
    }
  };

  return (
    <div className="row">
      <div className="col-12 col-lg-8 mx-auto">
        {/* Header with progress */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <i className="bi bi-file-earmark-text me-2"></i>
            Create Your CV
          </h2>
          <div className="d-flex align-items-center">
            <div className="progress" style={{ width: '150px', height: '10px' }}>
              <div 
                className={`progress-bar ${progress < 60 ? 'bg-warning' : 'bg-success'}`} 
                role="progressbar" 
                style={{ width: `${progress}%` }} 
                aria-valuenow={progress} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            <span className="ms-2 small">{progress}% Complete</span>
          </div>
        </div>
        
        {/* Section navigation */}
        <div className="mb-4 d-none d-md-block">
          <div className="btn-group w-100">
            <button 
              className={`btn btn-sm ${activeSection === 'personal' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => scrollToSection('personal-section', 'personal')}
            >
              <i className="bi bi-person me-1"></i> Personal
            </button>
            <button 
              className={`btn btn-sm ${activeSection === 'education' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => scrollToSection('education-section', 'education')}
            >
              <i className="bi bi-mortarboard me-1"></i> Education
            </button>
            <button 
              className={`btn btn-sm ${activeSection === 'experience' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => scrollToSection('experience-section', 'experience')}
            >
              <i className="bi bi-briefcase me-1"></i> Experience
            </button>
            <button 
              className={`btn btn-sm ${activeSection === 'skills' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => scrollToSection('skills-section', 'skills')}
            >
              <i className="bi bi-tools me-1"></i> Skills
            </button>
            <button 
              className={`btn btn-sm ${activeSection === 'projects' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => scrollToSection('projects-section', 'projects')}
            >
              <i className="bi bi-kanban me-1"></i> Projects
            </button>
          </div>
        </div>
        
        {/* Form sections */}
        <div id="personal-section">
          <PersonalInfoForm />
        </div>
        <div id="education-section">
          <EducationForm />
        </div>
        <div id="experience-section">
          <ExperienceForm />
        </div>
        <div id="skills-section">
          <SkillsForm />
        </div>
        <div id="projects-section">
          <ProjectsForm />
        </div>
      </div>
    </div>
  );
}

export default CVForm;
