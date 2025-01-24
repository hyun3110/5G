import React from "react";
import "./css/styles.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./component/Main";
import Signup from  "./component/Signup";
import Login from "./component/Login";




const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/Login" element={<Login/>} />
          
        </Routes>
      </Router>
    </div>
  );
};

export default App;
