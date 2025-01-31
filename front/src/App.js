import React from "react";
import "./css/styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/Header"; // Header 추가
import Login from "./component/Login";
import Signup from "./component/Signup";
import Main from "./component/Main";
import Forgotid from "./component/Forgotid";
import Forgotpw from "./component/Forgotpw";
import MyWardrobe from "./component/MyWardrobe"; // MyWardrobe 추가

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* 모든 페이지에서 공통으로 사용하는 Header */}
        <Header />
        {/* Routes는 페이지마다 다른 콘텐츠를 렌더링 */}
        <Routes>
          <Route path="/" element={<Main />} />
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