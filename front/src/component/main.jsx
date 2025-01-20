import React from "react";
import Header from "./Header";
import Slider from "./Slider";
import EventSection from "./EventSection";
import Calendar from "./Calander";
import '../css/styles.css';


const App = () => {
  return (
    <div>

      <div> <Slider />  </div>

      <div> <Header /></div>

      <div><EventSection /></div>
      <div> <Calendar /></div>
    </div>
  );
};

export default App;
