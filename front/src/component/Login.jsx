import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Loginstyle.css";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      setError("회원정보를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        { userId, pw: password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/");
      } else {
        setError("로그인 실패!");
      }
    } catch (err) {
      setError("요청 실패!");
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome!</h1>
        </div>

        {/* Login Section */}
        <form onSubmit={login}>
          <div className="login-section">
            <h2>로그인</h2>
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="message">{error}</div>}
            <button type="submit">로그인</button>
            <div className="additional-links">
              <a href="/signup" className="left-link">
                회원가입
              </a>
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
