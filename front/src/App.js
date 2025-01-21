import React from "react";
import Header from "./component/Header";
import Slider from "./component/Slider";
import EventSection from "./component/EventSection";
import "./css/styles.css";
import Calendar from "./component/Calander";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./component/login";
import Signup from "./component/Signup";

const App = () => {
  return (
    <Router>
    <div className="app-container">
      <div className="left-side">
        <Slider />
      </div>
      <div className="right-side">
        <Header />
        <EventSection />
        <Calendar />
      </div>
    </div>
    <Routes>
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
    </Router>
  );
};

export default App;
