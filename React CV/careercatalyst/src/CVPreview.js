import { useContext, useState } from "react";
import React from "react";
import { CVContext } from "./CVContext";

function CVPreview() {
  const { cvState } = useContext(CVContext);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastExportTime, setLastExportTime] = useState(null);

  /**
   * Generate and download the CV as a PDF file
   * Uses html2pdf library to convert the HTML to PDF
   */
  const generatePDF = async () => {
    
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);

      const html2pdf = (await import('html2pdf.js')).default;
      

      const cvElement = document.getElementById("cv-preview");
      
      const pdfOptions = {
        margin: 0.5,
        filename: `CV_${cvState.personalInfo.fullName || 'Resume'}_${new Date().toISOString().slice(0,10)}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 3, useCORS: true }, 
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      
      await html2pdf().set(pdfOptions).from(cvElement).save();
      
      setLastExportTime(new Date());
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Sorry, PDF generation failed. Please try again or check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const hasData = () => {
    return cvState.personalInfo.fullName || 
           cvState.education.length > 0 || 
           cvState.experience.length > 0 || 
           cvState.skills.length > 0 || 
           cvState.projects.length > 0;
  };
  
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="row">
      <div className="col-12 col-lg-8 mx-auto">
        {/* Header with title and actions */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>CV Preview</h2>
          <div>
            {lastExportTime && (
              <small className="text-muted me-3">
                Last exported: {formatDate(lastExportTime)}
              </small>
            )}
            <button 
              className={`btn ${isGenerating ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={generatePDF}
              disabled={isGenerating || !hasData()}
            >
              {isGenerating ? 'Generating PDF...' : 'Export to PDF'}
            </button>
          </div>
        </div>
        
        {/* The actual CV preview */}
        <div id="cv-preview" className="p-4 border rounded bg-white shadow-sm">
          {!hasData() ? (
            <div className="text-center py-5 text-muted">
              <h4>Your CV is empty</h4>
              <p>Fill out the form sections to see your CV preview here</p>
            </div>
          ) : (
            <>
              {/* Personal Info Section */}
              <header className="mb-4">
                <h2 className="mb-1">{cvState.personalInfo.fullName || 'Your Name'}</h2> <br/>
                <div className="text-muted">
                  {cvState.personalInfo.email && (
                    <span className="me-2">
                      <i className="bi bi-envelope me-1"></i>
                      {cvState.personalInfo.email}
                    </span>
                  )}<br/>
                  {cvState.personalInfo.phone && (
                    <span className="me-2">
                      <i className="bi bi-telephone me-1"></i>
                      {cvState.personalInfo.phone}
                    </span>
                  )}<br/>
                  {cvState.personalInfo.address && (
                    <span>
                      <i className="bi bi-geo-alt me-1"></i>
                      {cvState.personalInfo.address}
                    </span>
                  )}<br/>
                </div>
                {cvState.personalInfo.summary && (
                  <p className="mt-3 fst-italic">{cvState.personalInfo.summary}</p>
                )}
                <br/>
              </header>

              {/* Education Section */}
              {cvState.education.length > 0 && (
                <section className="mb-4">
                  <h4 className="border-bottom pb-2 mb-3">Education</h4>
                  {cvState.education.map((edu, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <strong className="text-primary">{edu.school}</strong>
                        <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                      </div>
                      <div>{edu.degree}</div>
                    </div>
                  ))}
                </section>
              )}

              {/* Experience Section */}
              {cvState.experience.length > 0 && (
                <section className="mb-4">
                  <h4 className="border-bottom pb-2 mb-3">Professional Experience</h4>
                  {cvState.experience.map((exp, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <strong className="text-primary">{exp.company}</strong>
                        <span>{exp.startYear} - {exp.endYear || 'Present'}</span>
                      </div>
                      <div className="fw-bold">{exp.title}</div>
                      {exp.description && <p className="mb-0 mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </section>
              )}

              {/* Skills Section - I like the badge style for skills */}
              {cvState.skills.length > 0 && (
                <section className="mb-4">
                  <h4 className="border-bottom pb-2 mb-3">Skills</h4>
                  <div>
                    {cvState.skills.map((skill, idx) => (
                      <span key={idx} className="badge bg-light text-dark border me-2 mb-2 p-2">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {cvState.projects.length > 0 && (
                <section>
                  <h4 className="border-bottom pb-2 mb-3">Projects</h4>
                  {cvState.projects.map((project, idx) => (
                    <div key={idx} className="mb-3">
                      <strong>{project.name}</strong>
                      <p className="mb-0">{project.description}</p>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CVPreview;
