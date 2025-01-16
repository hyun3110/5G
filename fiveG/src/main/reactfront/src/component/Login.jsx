import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
    
        // 입력값 체크
        if (!username || !password) {
            setError('Username과 Password는 필수입니다.');
            return;
        }
    
        try {
            // 로그인 요청
            const response = await axios.post('http://localhost:8081/api/auth/login', { username, password });
    
            if (response.data) {
                alert('로그인 성공');
            } else {
                alert('아이디 또는 비밀번호가 틀렸습니다.');
            }
        } catch (err) {
            // AxiosError의 상세 정보 출력
            if (err.response) {
                // 서버가 응답을 보냈고 응답에 문제가 있을 때
                console.error('응답 에러:', err.response.data);
                console.error('응답 상태:', err.response.status);
                console.error('응답 헤더:', err.response.headers);
                setError(`서버 오류: ${err.response.data.message || '알 수 없는 오류'}`);
            } else if (err.request) {
                // 요청이 서버에 도달했지만 응답이 없는 경우
                console.error('요청 에러:', err.request);
                setError('서버 응답 없음');
            } else {
                // 설정이나 다른 이유로 에러가 발생한 경우
                console.error('AxiosError:', err.message);
                setError(`로그인 실패: ${err.message}`);
            }
        }
    };
    

    return (
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
