import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Forgotpwstyle.css';
import { findPw } from '../api/authService';

// 아이디, 이름, 주민번호 확인 후 비밀번호 재설정
const ForgotPassword = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [rrnFirst, setRrnFirst] = useState('');
  const [rrnSecond, setRrnSecond] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleVerification = async () => {
    if (!userId || !name || !rrnFirst || !rrnSecond) {
      setMessage({ text: '모든 필드를 입력해주세요.', type: 'error' });
      return;
    }

    // 주민등록번호 유효성 검사
    const rrnPattern = /^\d{6}-\d{7}$/;
    const fullRrn = `${rrnFirst}-${rrnSecond}`;

    if (!rrnPattern.test(fullRrn)) {
      setMessage({ text: '유효한 주민등록번호를 입력하세요.', type: 'error' });
      return;
    }

    try {
      const response = await findPw(userId, name, fullRrn);

      if (response.data) {
        navigate('/resetpw', { state: { userId } }); // 비밀번호 재설정 페이지로 이동
      } else {
        setMessage({ text: '입력한 정보와 일치하는 사용자가 없습니다.', type: 'error' });
      }
    } catch (error) {
      console.error('본인 확인 오류:', error);
      setMessage({ text: '서버 오류 발생. 다시 시도해주세요.', type: 'error' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1>비밀번호 찾기</h1>
        <p>회원정보를 입력하면 본인 확인 후</p>
        <p>비밀번호를 재설정할 수 있습니다.</p>

        <input
          type="text"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="rrn-group">
          <input
            type="text"
            placeholder="주민등록번호 앞 6자리"
            value={rrnFirst}
            onChange={(e) => setRrnFirst(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            maxLength="6"
            onKeyDown={handleKeyDown}
          />
          <span>-</span>
          <input
            type="text"
            placeholder="주민등록번호 뒤 7자리"
            value={rrnSecond}
            onChange={(e) => setRrnSecond(e.target.value.replace(/[^0-9]/g, '').slice(0, 7))}
            maxLength="7"
            onKeyDown={handleKeyDown}
          />
        </div>

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}


        <button className="verify-button" onClick={handleVerification}>비밀번호 재설정</button>
        <a className="other-button" onClick={() => navigate('/Login')}>로그인</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
