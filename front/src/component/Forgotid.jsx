import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Forgotidstyle.css';

const ForgotId = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const validEmailDomains = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net', 'hanmail.net']; // 유효한 도메인 리스트

  const handleRetrieveId = () => {
    if (email.trim() === '') {
      setMessage({ text: '유효한 이메일 주소를 입력해주세요.', type: 'error' });
      return;
    }

    // 이메일 형식 및 도메인 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: '이메일 형식이 올바르지 않습니다.', type: 'error' });
      return;
    }

    // 이메일 도메인 검증
    const emailDomain = email.split('@')[1];
    if (!validEmailDomains.includes(emailDomain)) {
      setMessage({ text: `"${emailDomain}"는(은) 지원하지 않는 이메일입니다.`, type: 'error' });
      return;
    }

    // 성공 메시지
    setMessage({ text: `${email}로 링크를 보냈습니다.`, type: 'success' });
    setEmail(''); // 입력 필드 초기화
  };

  return (
    <div className="forgot-id-container">
      <div className="forgot-id-box">
        <h1>Forgot ID?</h1>
        <p>아래에 이메일 주소를 입력하시면 링크를 보내드립니다.</p>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleRetrieveId}>ID 전송</button>
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        <a onClick={() => navigate('/')}>로그인</a>
      </div>
    </div>
  );
};

export default ForgotId;
