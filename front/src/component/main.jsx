import React from "react";
import Header from "./Header";
import Slider from "./Slider";
import EventSection from "./EventSection";
import Calendar from "./Calender";
import '../css/styles.css';


const App = () => {
  return (
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
  );
};

export default App;
