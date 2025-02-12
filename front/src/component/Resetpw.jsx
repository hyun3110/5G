import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/Resetpwstyle.css';
import { resetPw } from '../api/authService';

const Resetpw = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId; // 비밀번호 찾기 페이지에서 받아온 ID

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage({ text: '비밀번호를 입력해주세요.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: '비밀번호가 일치하지 않습니다.', type: 'error' });
      return;
    }

    // 비밀번호 유효성 검사 (8자 이상, 영문, 숫자, 특수문자 포함)
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      setMessage({ text: '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.', type: 'error' });
      return;
    }

    try {
      const response = await resetPw(userId, newPassword);

      if (response.data) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/login');
      } else {
        setMessage({ text: '비밀번호 변경에 실패했습니다.', type: 'error' });
      }
    } catch (error) {
      console.error('비밀번호 재설정 오류:', error);
      setMessage({ text: '서버 오류 발생. 다시 시도해주세요.', type: 'error' });
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h1>비밀번호 재설정</h1>
        <p>새로운 비밀번호를 입력해주세요.</p>

        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        <button className="reset-button" onClick={handleResetPassword}>비밀번호 변경</button>
        <a className="other-button" onClick={() => navigate('/login')}>로그인</a>
      </div>
    </div>
  );
};

export default Resetpw;
