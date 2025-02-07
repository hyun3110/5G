import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/Header"; // Header 추가
import Login from "./component/Login";
import Signup from "./component/Signup";
import Main from "./component/Main";
import Forgotid from "./component/Forgotid";
import Forgotpw from "./component/Forgotpw";
import Mypage from "./component/Mypage";
import Look from "./component/Look";
import Pwconfirm from "./component/Pwconfirm";
import Useredit from "./component/Useredit";
import Weekcalander from "./component/Weekcalander";
import Resetpw from "./component/Resetpw";
import CodiRecommend from './component/Codirecommend';
import MyWardrobe from "./component/MyWardrobe"; // MyWardrobe 추가
import { UserProvider } from "./context/UserContext"; // UserProvider import
import { EventsProvider } from "./context/eventsContext";

const App = () => {
  return (
    <UserProvider>
      <EventsProvider>
        <Router>
          <div>
            {/* 모든 페이지에서 공통으로 사용하는 Header */}
            <Header />
            {/* Routes는 페이지마다 다른 콘텐츠를 렌더링 */}
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgotid" element={<Forgotid />} />
              <Route path="/forgotpw" element={<Forgotpw />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/look" element={<Look />} />
              <Route path="/pwconfirm" element={<Pwconfirm />} />
              <Route path="/useredit" element={<Useredit />} />
              <Route path="/weekcalander" element={<Weekcalander />} />
              <Route path="/mywardrobe" element={<MyWardrobe />} /> {/* MyWardrobe 경로 추가 */}
              <Route path="/resetpw" element={<Resetpw />} />
              <Route path="/codirecommend" element={<CodiRecommend />} />
            </Routes>
          </div>
        </Router>
      </EventsProvider>
    </UserProvider>
  );
};

export default App;