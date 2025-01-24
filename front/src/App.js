import React from "react";
import "./css/styles.css";
import Calendar from "./component/Calander";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./component/login";
import Signup from "./component/Signup";
import Main from "./component/main";

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/" element={<Main />} />
    </Routes>
    </Router>
  );
};

export default App;
