/**
 * SkillsForm.js
 * 
 * @author Sarah Johnson
 * @created 2023-04-18
 * @updated 2023-10-05 - Added skill categories and improved UI
 * 
 * Component for managing skills in the CV builder.
 * Allows users to add and remove skills with duplicate prevention.
 */
import React, { useState, useContext, useRef, useEffect } from "react";
import { CVContext, CV_ACTIONS } from "./CVContext";


const SKILL_CATEGORIES = [
  { name: "Programming", examples: ["JavaScript", "Python", "Java", "C++", "Ruby"] },
  { name: "Web", examples: ["React", "Angular", "Vue", "HTML5", "CSS3"] },
  { name: "Database", examples: ["SQL", "MongoDB", "PostgreSQL", "Firebase"] },
  { name: "Tools", examples: ["Git", "Docker", "AWS", "Jenkins", "Jira"] },
  { name: "Soft Skills", examples: ["Leadership", "Communication", "Teamwork"] }
];

/**
 * Skills form component for adding/removing skills
 */
function SkillsForm() {
  
  const { cvState, dispatch } = useContext(CVContext);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  
  
  const inputRef = useRef(null);
  
  
  useEffect(() => {
    if (activeCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeCategory]);
  
  
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmedSkill = skillInput.trim();
    
    
    if (!trimmedSkill) {
      setError("Please enter a skill");
      return;
    }
    
    
    const isDuplicate = cvState.skills.some(
      existingSkill => existingSkill.toLowerCase() === trimmedSkill.toLowerCase()
    );
    
    if (isDuplicate) {
      setError(`"${trimmedSkill}" is already in your skills list`);
      return;
    }
    
    
    dispatch({ type: CV_ACTIONS.ADD_SKILL, payload: trimmedSkill });
    setSkillInput("");
    setError("");
    
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  
  const handleRemoveSkill = (idx, skill) => {
    
    const seemsImportant = skill.length > 10 || skill.includes(" ");
    
    if (seemsImportant && !window.confirm(`Remove "${skill}" from your skills?`)) {
      return;
    }
    
    dispatch({ type: CV_ACTIONS.REMOVE_SKILL, payload: idx });
  };

  
  const addSuggestedSkill = (skill) => {
    
    const isDuplicate = cvState.skills.some(
      existingSkill => existingSkill.toLowerCase() === skill.toLowerCase()
    );
    
    if (!isDuplicate) {
      dispatch({ type: CV_ACTIONS.ADD_SKILL, payload: skill });
    } else {
      setError(`"${skill}" is already in your skills list`);
      setTimeout(() => setError(""), 2000); 
    }
  };

  return (
    <section className="mb-4 p-3 border rounded shadow-sm">
      <h4 className="mb-3">🔧 Skills & Expertise</h4>
      
      {/* Skill input form */}
      <form className="mb-3" onSubmit={handleAddSkill}>
        <div className="input-group">
          <input
            ref={inputRef}
            value={skillInput}
            onChange={e => {
              setSkillInput(e.target.value);
              if (error) setError("");
            }}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            placeholder={activeCategory ? `Add ${activeCategory} skill...` : "Enter a skill (e.g. JavaScript, Project Management)"}
            aria-label="Skill name"
          />
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={!skillInput.trim()}
          >
            Add
          </button>
        </div>
        {error && <div className="text-danger small mt-1">{error}</div>}
      </form>
      
      {/* Skill categories for quick selection */}
      <div className="mb-3">
        <p className="text-muted small mb-2">Quick add from categories:</p>
        <div className="d-flex flex-wrap gap-2">
          {SKILL_CATEGORIES.map(category => (
            <button
              key={category.name}
              className={`btn btn-sm ${activeCategory === category.name ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory(prev => prev === category.name ? null : category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Show examples from selected category */}
        {activeCategory && (
          <div className="mt-2 mb-3">
            <div className="d-flex flex-wrap gap-1 mt-1">
              {SKILL_CATEGORIES.find(c => c.name === activeCategory)?.examples.map(example => (
                <button
                  key={example}
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => addSuggestedSkill(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Display skills */}
      {cvState.skills.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No skills added yet. Add skills that are relevant to your target position.
        </div>
      ) : (
        <div>
          <p className="mb-2"><strong>Your Skills ({cvState.skills.length}):</strong></p>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {cvState.skills.map((skill, idx) => (
              <div key={idx} className="badge bg-light text-dark border p-2 d-flex align-items-center">
                <span>{skill}</span>
                <button 
                  className="btn btn-sm text-danger ms-2 p-0 border-0" 
                  onClick={() => handleRemoveSkill(idx, skill)}
                  title="Remove skill"
                  aria-label={`Remove ${skill}`}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ))}
          </div>
          <p className="text-muted small">
            <i className="bi bi-lightbulb me-1"></i>
            Tip: List your most relevant skills first as they'll have more impact.
          </p>
        </div>
      )}
    </section>
  );
}

export default SkillsForm;
