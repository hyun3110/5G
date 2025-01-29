import React, { useState, useEffect } from "react";
import "./css/styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/Header"; // Header 추가
import Login from "./component/Login";
import Signup from "./component/Signup";
import Main from "./component/Main";
import Forgotid from "./component/Forgotid";
import Forgotpw from "./component/Forgotpw";
import MyWardrobe from "./component/MyWardrobe"; // MyWardrobe 추가
import axios from 'axios';

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
      <div className="app-container">
        {/* 모든 페이지에서 공통으로 사용하는 Header */}
        <Header />
        {/* Routes는 페이지마다 다른 콘텐츠를 렌더링 */}
        <Routes>
          <Route path="/" element={<Main user={user}/>} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Forgotid" element={<Forgotid />} />
          <Route path="/Forgotpw" element={<Forgotpw />} />
          <Route path="/MyWardrobe" element={<MyWardrobe />} /> {/* MyWardrobe 경로 추가 */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
