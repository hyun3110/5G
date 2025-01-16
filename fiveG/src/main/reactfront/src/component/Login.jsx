import React, {useState} from 'react';
import './Loginstyle.css';
import axios from 'axios';

const Login = () => {

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    
    // 입력값 체크
    if(!userId || !password){
      setError('아이디 비밀번호를 입력해주세요')
      return;
    }

    try {
      // 로그인 요청
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        userid:userId,
        password:password
      });

      if (response.data) {
        alert('로그인 성공');
      } else {
        setError('로그인 실패!');
      }
    } catch (err) {
      setError('요청 실패!');
    }
  };


  return (
    <div className="container">
      <div className="welcome-section">
        <h1>Welcome!</h1>
      </div>
      <div className="login-section">
        <form onSubmit={login}>
          <h2>Login Your Account</h2>
          <input type="text" placeholder="ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type='submit'>로그인</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="additional-links">
            <a href="/signup" className="top-link">Create Account</a>
            <a href="/searchid">Forgot ID?</a>
            <a href="/searchpassword">Forgot Password?</a>
          </div>
      </div>
    </div>
  );
};

export default Login;
