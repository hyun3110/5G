import React from "react";
import "./css/styles.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./component/login";
import Signup from "./component/Signup";
import Main from "./component/main";
import Forgotid from "./component/Forgotid";
import Forgotpw from "./component/Forgotpw";

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Forgotid" element={<Forgotid />} />
      <Route path="/Forgotpw" element={<Forgotpw />} />
    </Routes>
    </Router>
  );
};

export default App;
