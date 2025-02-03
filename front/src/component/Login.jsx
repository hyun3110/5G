import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Loginstyle.css";

function Login({ setUser }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    // 입력값 체크
    if (!userId || !password) {
      setError("회원정보를 입력해주세요.");
      return;
    }

    try {
      // 로그인 요청
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        {
          userId: userId,
          pw: password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // 로그인 성공 시 유저 정보 업데이트
        axios
          .get("http://localhost:8081/api/auth/userinfo", {
            withCredentials: true,
          })
          .then((response) => {
            setUser(response.data); // 유저 정보를 상태에 저장
            sessionStorage.setItem("user", JSON.stringify(response.data)); // 세션에 저장
            navigate("/"); // 메인 화면으로 리디렉션
          });
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
        <form onSubmit={login}>
          <div className="login-section" onSubmit={login}>
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
              <a href="/signup" className="top-link">
                회원가입
              </a>
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
