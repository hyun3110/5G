import React from "react";
import Header from "./Header";
import Slider from "./Slider";
import EventSection from "./EventSection";
import Calandar from "./Calander";
import "../css/styles.css";

const App = () => {
  return (
    <div className="app-container">
      <div className="left-side">
        <div className="slider-container">
          <h1 className="daily-look-title">Daily Look</h1>
          <Slider />
        </div>
      </div>
      <div className="right-side">
        <Header />
        <EventSection />
        <Calandar />
      </div>
    </div>
  );
};

export default App;
