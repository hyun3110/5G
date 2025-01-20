import React, { useState } from 'react';
import axios from 'axios';

function Login() {

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
        <div>
            <h2>로그인</h2>
            <form onSubmit={login}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;
