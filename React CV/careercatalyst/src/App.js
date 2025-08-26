import React, { useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CVContext, cvReducer, initialCVState } from "./CVContext";
import Header from "./Header";
import Home from "./Home";
import CVForm from "./CVForm";
import CVPreview from "./CVPreview";


function App() {
  
  const [cvState, dispatch] = useReducer(cvReducer, initialCVState);

  return (
    <CVContext.Provider value={{ cvState, dispatch }}>
      <BrowserRouter>
        <Header />
        <main className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CVForm />} />
            <Route path="/preview" element={<CVPreview />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CVContext.Provider>
  );
}

export default App;
