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
        <Header user={user} setUser={setUser}/>
        {/* Routes는 페이지마다 다른 콘텐츠를 렌더링 */}
        <Routes>
          <Route path="/" element={<Main user={user} setUser={setUser}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser}/>} />
          <Route path="/forgotid" element={<Forgotid />} />
          <Route path="/forgotpw" element={<Forgotpw />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/look" element={<Look />} />
          <Route path="/pwconfirm" element={<Pwconfirm user={user}/>} />
          <Route path="/useredit" element={<Useredit user={user} setUser={setUser}/>} />
          <Route path="/weekcalander" element={<Weekcalander />} />
          <Route path="/mywardrobe" element={<MyWardrobe user={user}/>} /> {/* MyWardrobe 경로 추가 */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;