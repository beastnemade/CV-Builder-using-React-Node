
import { createContext } from "react";

export const initialCVState = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    summary: ""
  },
  education: [],
  experience: [],
  skills: [],
  projects: []
};

export const CV_ACTIONS = {
  UPDATE_PERSONAL_INFO: "UPDATE_PERSONAL_INFO",
  ADD_EDUCATION: "ADD_EDUCATION",
  REMOVE_EDUCATION: "REMOVE_EDUCATION",
  UPDATE_EDUCATION: "UPDATE_EDUCATION",  
  ADD_EXPERIENCE: "ADD_EXPERIENCE",
  REMOVE_EXPERIENCE: "REMOVE_EXPERIENCE",
  UPDATE_EXPERIENCE: "UPDATE_EXPERIENCE",
  ADD_SKILL: "ADD_SKILL",
  REMOVE_SKILL: "REMOVE_SKILL",
  ADD_PROJECT: "ADD_PROJECT",
  REMOVE_PROJECT: "REMOVE_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT"
};

export function cvReducer(state, action) {
  const { type, payload } = action;
  
  switch (type) {

    case CV_ACTIONS.UPDATE_PERSONAL_INFO:
      return { 
        ...state, 
        personalInfo: { ...payload } 
      };
      
    case CV_ACTIONS.ADD_EDUCATION: {
      const updatedEducation = [...state.education, payload];
      return { ...state, education: updatedEducation };
    }
    
    case CV_ACTIONS.REMOVE_EDUCATION: {
      const filteredEducation = state.education.filter((_, idx) => idx !== payload);
      return { ...state, education: filteredEducation };
    }
      
    case CV_ACTIONS.UPDATE_EDUCATION:
      return {
        ...state,
        education: state.education.map((edu, idx) =>
          idx === payload.index ? payload.data : edu
        )
      };
      
    case CV_ACTIONS.ADD_EXPERIENCE:
      return { ...state, experience: [...state.experience, payload] };
      
    case CV_ACTIONS.REMOVE_EXPERIENCE:
      return {
        ...state,
        experience: state.experience.filter((_, idx) => idx !== payload)
      };
      
    case CV_ACTIONS.UPDATE_EXPERIENCE:
      return {
        ...state,
        experience: state.experience.map((exp, idx) =>
          idx === payload.index ? payload.data : exp
        )
      };
    
    case CV_ACTIONS.ADD_SKILL:
      if (state.skills.includes(payload)) {
        return state;
      }
      return { ...state, skills: [...state.skills, payload] };
      
    case CV_ACTIONS.REMOVE_SKILL:
      return {
        ...state,
        skills: state.skills.filter((_, idx) => idx !== payload)
      };
    
    case CV_ACTIONS.ADD_PROJECT:
      return { ...state, projects: [...state.projects, payload] };
      
    case CV_ACTIONS.REMOVE_PROJECT: {
      const newProjects = [...state.projects];
      newProjects.splice(payload, 1);
      return { ...state, projects: newProjects };
    }
    
    case CV_ACTIONS.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project, idx) =>
          idx === payload.index ? payload.data : project
        )
      };
      
    default:
      console.warn('Unknown action type:', type);
      return state;
  }
}

// Create context for sharing CV state and dispatch
export const CVContext = createContext();