import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Loginstyle.css';

function Login() {

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    // 입력값 체크
    if (!userId || !password) {
      setError('아이디 비밀번호를 입력해주세요')
      return;
    }

    try {
      // 로그인 요청
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        userId: userId,
        pw: password
      }, { withCredentials: true });

      if (response.status === 200) {
        navigate('/');
      } else {
        setError('로그인 실패!');
      }
    } catch (err) {
      setError('요청 실패!');
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="welcome-section">
          <h1>Welcome!</h1>
        </div>
        <form onSubmit={login}>
        <div className="login-section" onSubmit={login}>
          <h2>로그인</h2>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">로그인</button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="additional-links">
            <a href="/signup" className="top-link">회원가입</a>
            <a href="/forgotid">아이디 찾기</a>
            <a href="/forgotpw">비밀번호 찾기</a>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
