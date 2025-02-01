import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Forgotpwstyle.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const validEmailDomains = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net', 'hanmail.net']; // 유효한 도메인 리스트

  const handleResetLink = () => {
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleResetLink();
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1>비밀번호를 잊으셨나요?</h1>
        <p>아래에 이메일 주소를 입력하시면</p>
        <p>비밀번호 재설정 지침을 보내드립니다.</p>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
        />
        {/* 메시지를 버튼 위로 이동 */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        <button className="re-link" onClick={handleResetLink}>재설정 링크 보내기</button>
        <a className="other-button" onClick={() => navigate('/Login')}>로그인</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
