// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import "../css/Loginstyle.css";
import { useUser } from "../context/UserContext";
import { loginUser, getUserInfo } from "../api/authService";  // 로그인 서비스 임포트

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 위치 가져오기
  const { setUser } = useUser();  // UserContext에서 setUser 함수 가져오기

  const login = async (e) => {
    e.preventDefault();

    // 입력값 체크
    if (!userId || !password) {
      setError("회원정보를 입력해주세요.");
      return;
    }

    try {
      // 로그인 요청
      const loginSuccess = await loginUser(userId, password);  // authService에서 처리
      if (loginSuccess) {
        // 로그인 성공 후 유저 정보 가져오기
        const userInfo = await getUserInfo();  // authService에서 처리
        setUser(userInfo);  // UserContext에 유저 정보 저장
        sessionStorage.setItem("user", JSON.stringify(userInfo));  // 세션에 유저 정보 저장
        
        // ✅ 로그인 전에 사용자가 가려고 했던 경로 확인
        const redirectPath = location.state?.from || "/";  
        navigate(redirectPath, { replace: true }); // ✅ 해당 경로로 이동
      }
    } catch (err) {
      setError("아이디 혹은 패스워드를 확인해 주세요");  // 에러 메시지 표시
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome!</h1>
        </div>
        <form onSubmit={login}>
          <div className="login-section">
            <h2>로그인</h2>
            <input
              type="text"
              placeholder="ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="PW"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="login-error-message">{error}</p>}
            <button type="submit">로그인</button>

            <div className="additional-links">
              {/* 회원가입 버튼 */}
              <a href="/signup" className="top-link">회원가입</a>
              {/* 아이디 찾기 및 비밀번호 찾기 */}
              <div className="right-links">
                <a href="/forgotid">아이디 찾기</a>
                <a href="/forgotpw">비밀번호 찾기</a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
