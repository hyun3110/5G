import React, { useState, useEffect } from "react";
import "./css/styles.css";
import axios from 'axios';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./component/login";
import Signup from "./component/Signup";
import Main from "./component/main";
import Forgotid from "./component/Forgotid";
import Forgotpw from "./component/Forgotpw";

const App = () => {
  const [user, setUser] = useState(null); // 유저 정보

  useEffect(() => {
    const userInfo = sessionStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      axios.get('/api/auth/userinfo', { withCredentials: true })
        .then((response) => {
          setUser(response.data);
          sessionStorage.setItem('user', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error('유저 정보 가져오기 실패', error);
        });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main user={user}/>} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Forgotid" element={<Forgotid />} />
        <Route path="/Forgotpw" element={<Forgotpw />} />
      </Routes>
    </Router>
  );
};

export default App;
