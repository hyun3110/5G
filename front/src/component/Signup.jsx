import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import './Signupstyle.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(true);

  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    if (confirmPassword.length > 0) {
      validatePasswords();
    }
  }, [password, confirmPassword]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다');
    } else {
      setPasswordError('');
    }
  };

  const handleEmailDomainChange = (event) => {
    const value = event.target.value;
    if (value === 'type') {
      setEmailDomain('');
      setIsCustomDomain(true);
    } else {
      setEmailDomain(value);
      setIsCustomDomain(false);
    }
  };

  const handleCancel = () => {
    navigate('/'); // 로그인 화면으로 이동
  };

  return (
    <div className="form-container">
      <h1>회원가입</h1>
      <form>
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            placeholder="아이디 입력(6~20자)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="button" className="verification-button">중복 확인</button>
          {!isUsernameValid && <div className="error-message">{usernameError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="대소문자, 특수기호, 숫자 포함"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password-confirm">비밀번호 확인</label>
          <input
            type="password"
            id="password-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input type="text" id="name" />
        </div>

        <div className="form-group">
          <label htmlFor="phone">전화번호</label>
          <input type="tel" id="phone" />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일 주소</label>
          <div className="email-group">
            <input type="text" id="email" />
            <span>@</span>
            <input
              type="text"
              id="email-domain-input"
              value={emailDomain}
              disabled={!isCustomDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
            />
            <select id="email-domain" onChange={handleEmailDomainChange}>
              <option value="type">직접 입력</option>
              <option value="naver.com">naver.com</option>
              <option value="kakao.com">kakao.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
              <option value="hanmail.net">hanmail.net</option>
            </select>
            <button type="button" className="verification-button">인증코드 전송</button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="verification-code">인증코드</label>
          <input type="text" id="verification-code" />
        </div>

        <div className="style-choice">선호하는 스타일 선택</div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">가입하기</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
