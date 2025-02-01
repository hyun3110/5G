import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import '../css/Signupstyle.css';
import axios from 'axios';

const Signup = () => {
  const [userId, setUserId] = useState(''); // 아아디
  const [pw, setPw] = useState(''); // 비밀번호
  const [name, setName] = useState(''); // 이름
  const [phone, setPhone] = useState(''); // 전화번호
  const [email, setEmail] = useState(''); // e메일
  const [preferredStyle, setPreferredStyle] = useState('') // 선호 스타일
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [userIdError, setUserIdError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(true);

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleStyleSelection = () => {
    navigate('/Look');
  };

  // 아이디 중복 체크
  const handleUserIdCheck = async () => {
    if (userId === '') {
      setUserIdError('아이디를 입력하세요');
      setIsUsernameValid(false);
      return;
    }

    try {
      // 서버에 아이디 중복 확인 요청
      const response = await axios.get('http://localhost:8081/api/auth/userIdCheck', {
        params: { userId }
      });

      if (response.data) {
        setUserIdError('이미 존재하는 아이디입니다.');
        setIsUsernameValid(false);
      } else {
        setUserIdError('사용 가능한 아이디입니다.');
        setIsUsernameValid(true);
      }
    } catch (error) {
      console.error('아이디 중복 확인 오류:', error);
    }

  }

  useEffect(() => {
    if (confirmPassword.length > 0) {
      validatePasswords();
    }
  }, [pw, confirmPassword]);

  const validatePasswords = () => {
    if (pw !== confirmPassword) {
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

  const signup = async (e) => {
    e.preventDefault();

    // 아이디 중복 체크
    if (!isUsernameValid) {
      alert('아이디 중복 체크를 먼저 해주세요.');
      return;
    }

    try {
      // 회원가입 요청
      const response = await axios.post('http://localhost:8081/api/auth/signup', {
        userId: userId,
        pw: pw,
        name: name,
        phone: phone,
        email: email + '@' + emailDomain,
        preferredStyle: preferredStyle
      });

      if (response.status) {
        alert('회원가입 성공')
        navigate('/login');
      } else {
        alert('실패')
      }

    } catch (err) {

    }

  }

  return (
    <div className="signup-container">
      <div className="form-container">
        <h1>회원가입</h1>
        <form onSubmit={signup}>
          <div className="form-group">
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              placeholder="아이디 입력(6~20자)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <button type="button" className="verification-button" onClick={handleUserIdCheck}>중복 확인</button>
            <p style={{ color: isUsernameValid ? 'green' : 'red' }}>{userIdError}</p>
          </div>

          <div className="form-group">
            <label htmlFor="pw">비밀번호</label>
            <input
              type="password"
              id="pw"
              placeholder="대소문자, 특수기호, 숫자 포함"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pw-confirm">비밀번호 확인</label>
            <input
              type="password"
              id="pw-confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일 주소</label>
            <div className="email-group">
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span>@</span>
              <input
                type="text"
                id="email-domain-input"
                value={emailDomain}
                disabled={!isCustomDomain}
                onChange={(e) => setEmailDomain(e.target.value)}
                required
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

          <div className="form-group">
            <button type="button" className="style-button" onClick={handleStyleSelection}>
              선호하는 스타일 선택
            </button>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn-submit" disabled={!isUsernameValid}>가입하기</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
