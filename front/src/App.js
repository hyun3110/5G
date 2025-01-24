import React from "react";
import Header from "./component/Header";
import Slider from "./component/Slider";
import EventSection from "./component/EventSection";
import "./css/styles.css";
import Calendar from "./component/Calander";
import main from "./component/Main";

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
