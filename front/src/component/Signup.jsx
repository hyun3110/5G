import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate 훅 임포트
import "../css/Signupstyle.css";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation();

  // 기존 입력 필드 유지
  const [userId, setUserId] = useState(location.state?.userId || ""); // 아아디
  const [pw, setPw] = useState(location.state?.pw || ""); // 비밀번호
  const [name, setName] = useState(location.state?.name || ""); // 이름
  const [confirmPassword, setConfirmPassword] = useState(
    location.state?.confirmPassword || ""
  );
  // 주민등록번호 입력 핸들러 (앞자리, 뒷자리 분리)
  const [rrnFirst, setRrnFirst] = useState(location.state?.rnnFirst || "");
  const [rrnSecond, setRrnSecond] = useState(location.state?.rnnSecond || "");
  const [phone, setPhone] = useState(location.state?.phone || ""); // 전화번호
  const [email, setEmail] = useState(location.state?.email || ""); // e메일
  const [emailDomain, setEmailDomain] = useState(
    location.state?.emailDomain || "naver.com"
  ); // e메일 도메인
  const [preferredStyle, setPreferredStyle] = useState(
    location.state?.preferredStyle || []
  ); // 선호 스타일

  // 유효성 검사
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rrnError, setRrnError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Look 페이지에서 돌아왔을 때 preferredStyle 유지
  useEffect(() => {
    if (location.state?.preferredStyle) {
      setPreferredStyle(location.state.preferredStyle);
      setRrnFirst(location.state.rrnFirst || "");
      setRrnSecond(location.state.rrnSecond || "");
    }
  }, [location.state?.preferredStyle]);

  // 아이디 유효성 검사
  const validateUserId = (id) => {
    const userIdPattern = /^[a-z0-9]{6,20}$/;
    if (!userIdPattern.test(id)) {
      setUserIdError("유효하지 않은 아이디입니다.");
      setIsUsernameValid(false);
    } else {
      setUserIdError("");
      setIsUsernameValid(true);
    }
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("유효하지 않은 비밀번호입니다.");
      setIsPasswordValid(false);
    } else {
      setPasswordError("");
      setIsPasswordValid(true);
    }
  };

  // 아이디 중복 체크
  const handleUserIdCheck = async () => {
    if (userId === "") {
      setUserIdError("아이디를 입력하세요");
      setIsUsernameValid(false);
      return;
    }

    try {
      // 서버에 아이디 중복 확인 요청
      const response = await axios.get(
        "http://localhost:8081/api/auth/userIdCheck",
        {
          params: { userId },
        }
      );

      if (response.data) {
        setUserIdError("이미 존재하는 아이디입니다.");
        setIsUsernameValid(false);
      } else {
        setUserIdError("사용 가능한 아이디입니다.");
        setIsUsernameValid(true);
      }
    } catch (error) {
      console.error("아이디 중복 확인 오류:", error);
    }
  };

  useEffect(() => {
    if (confirmPassword.length > 0) {
      validatePasswords();
    }
  }, [pw, confirmPassword]);

  const validatePasswords = () => {
    if (pw !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다");
    } else {
      setPasswordError("");
    }
  };

  // 주민등록번호 입력 핸들러
  const handleRrnFirstChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능
    if (value.length > 6) value = value.slice(0, 6); // 6자리까지만 허용
    setRrnFirst(value);
  };

  const handleRrnSecondChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능
    if (value.length > 7) value = value.slice(0, 7); // 7자리까지만 허용
    setRrnSecond(value);
  };

  // 주민등록번호 유효성 검사
  const validateRrn = () => {
    const rrnPattern = /^\d{6}-\d{7}$/; // 000000-0000000 형식
    const fullRrn = `${rrnFirst}-${rrnSecond}`;

    if (!rrnPattern.test(fullRrn)) {
      setRrnError("유효한 주민등록번호를 입력하세요.");
      return false;
    }

    // 생년월일 유효성 검사 (앞 6자리)
    const birthMonth = parseInt(rrnFirst.substring(2, 4), 10);
    const birthDay = parseInt(rrnFirst.substring(4, 6), 10);

    if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
      setRrnError("유효한 생년월일을 입력하세요.");
      return false;
    }

    setRrnError("");
    return true;
  };

  // 전화번호 자동 하이픈 추가 기능
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능하도록
    if (value.length >= 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d+)/, "$1-$2");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    }
    setPhone(value);
  };

  // 전화번호 유효성 검사
  const validatePhone = () => {
    const phonePattern = /^01[0-9]-\d{3,4}-\d{4}$/; // 010-1234-5678 형식
    if (!phonePattern.test(phone)) {
      setPhoneError("유효한 전화번호를 입력하세요.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleCancel = () => {
    navigate("/login"); // 로그인 화면으로 이동
  };

  // 선호 스타일 선택 페이지 이동 (현재 입력 데이터 유지)
  const handleStyleSelection = () => {
    navigate("/look", {
      state: {
        userId,
        pw,
        confirmPassword,
        name,
        rrnFirst,
        rrnSecond,
        phone,
        email,
        emailDomain,
        preferredStyle,
      },
    });
  };

  const signup = async (e) => {
    e.preventDefault();

    // 아이디 중복 체크
    if (!isUsernameValid) {
      alert("아이디 중복 체크를 먼저 해주세요.");
      return;
    }

    // 주민등록번호 검사 추가
    if (!validateRrn()) {
      alert("유효한 주민등록번호를 입력하세요.");
      return;
    }

    try {
      // 회원가입 요청
      const response = await axios.post(
        "http://localhost:8081/api/auth/signup",
        {
          userId: userId,
          pw: pw,
          name: name,
          phone: phone,
          email: `${email}@${emailDomain}`,
          residentRegNum: `${rrnFirst}-${rrnSecond}`,
          preferredStyle,
        }
      );

      if (response.status) {
        alert("회원가입 성공");
        navigate("/login");
      } else {
        alert("실패");
      }
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <h1>회원가입</h1>
        <form onSubmit={signup}>
          <div className="form-group">
            <div class="form-group id-group">
              <label for="userId">아이디</label>
              <input
                type="text"
                id="userId"
                placeholder="아이디 입력(6~20자)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onBlur={validateUserId}
                required
              />
              <button type="button">중복 확인</button>
            </div>
            {userIdError && <div className="error-message">{userIdError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="pw">비밀번호</label>
            <input
              type="password"
              id="pw"
              placeholder="대소문자, 특수기호, 숫자 포함"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onBlur={validatePassword}
              required
            />
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="pw-confirm">비밀번호 확인</label>
            <input
              type="password"
              id="pw-confirm"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div class="form-group">
              <label for="rrn">주민등록번호</label>
              <div class="rrn-group">
                <input
                  type="text"
                  id="rrn-first"
                  placeholder="앞 6자리"
                  maxlength="6"
                />
                <span>-</span>
                <input
                  type="text"
                  id="rrn-second"
                  placeholder="뒤 7자리"
                  maxlength="7"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={validatePhone}
              placeholder="010-1234-5678"
              maxLength="13"
              required
            />
            {phoneError && <p className="error-message">{phoneError}</p>}
          </div>

          <div className="form-group">
            <div className="form-group email-group">
              <label htmlFor="email">이메일 주소</label>
              <div className="email-group">
                <input
                  type="text"
                  id="email"
                  value={email}
                  className="email-id"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="아이디 입력"
                />
                <span>@</span>
                <select
                  id="email-domain"
                  value={emailDomain}
                  className="email-domain"
                  onChange={(e) => setEmailDomain(e.target.value)}
                  required
                >
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="kakao.com">kakao.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="hanmail.net">hanmail.net</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">
              선호 스타일
              <button
                type="button"
                className="style-button"
                onClick={handleStyleSelection}
              >
                선호하는 스타일 선택
              </button>
            </label>
          </div>

          <div className="btn-group">
            <button
              type="submit"
              className="btn-submit"
              disabled={!isUsernameValid}
            >
              가입하기
            </button>
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
