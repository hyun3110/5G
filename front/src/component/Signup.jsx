import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate 훅 임포트
import "../css/Signupstyle.css";
import { idCheck, userSignup } from "../api/authService";

const Signup = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation();

  // 기존 입력 필드 유지
  const [userId, setUserId] = useState(location.state?.userId || ""); // 아아디
  const [pw, setPw] = useState(location.state?.pw || ""); // 비밀번호
  const [name, setName] = useState(location.state?.name || ""); // 이름
  const [confirmPassword, setConfirmPassword] = useState(
    location.state?.confirmPassword || "");
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
  const [casual, setCasual] = useState(location.state?.casual || false);
  const [chic, setChic] = useState(location.state?.chic || false);
  const [classic, setClassic] = useState(location.state?.classic || false);
  const [minimal, setMinimal] = useState(location.state?.minimal || false);
  const [street, setStreet] = useState(location.state?.street || false);
  const [sporty, setSporty] = useState(location.state?.sporty || false);
  
  // 유효성 검사
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rrnError, setRrnError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Look 페이지에서 돌아왔을 때 preferredStyle 유지
  useEffect(() => {
    if (location.state?.preferredStyle) {
      setPreferredStyle(location.state.preferredStyle);
      setRrnFirst(location.state.rrnFirst || "");
      setRrnSecond(location.state.rrnSecond || "");
      setCasual(preferredStyle.includes("casual"));
      setChic(preferredStyle.includes("chic"));
      setClassic(preferredStyle.includes("classic"));
      setMinimal(preferredStyle.includes("minimal"));
      setStreet(preferredStyle.includes("street"));
      setSporty(preferredStyle.includes("spoty"));
    }
  }, [location.state?.preferredStyle]);

  // 아이디 유효성 검사
  const validateUserId = (id) => {
    const userIdPattern = /^(?=.*[a-z])(?=.*\d)[a-z0-9]{6,20}$/;

    if (!id) {
      setUserIdError("아이디를 입력하세요.");
      setIsUsernameValid(false);
      return false;
    }

    if (!userIdPattern.test(id)) {
      setUserIdError("소문자, 숫자를 조합하여 6~20자로 입력하세요.");
      setIsUsernameValid(false);
      return false;
    }

    setUserIdError(""); // 형식이 맞으면 오류 메시지 초기화
    return true;
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("문자, 숫자, 특수문자를 조합하여 8자 이상으로 입력하세요");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // 비밀번호 확인 (불일치 검사만 수행)
  const validatePasswordsMatch = () => {
    if (!confirmPassword) {
      setConfirmPasswordError(""); //] 비밀번호 확인 칸이 비어 있으면 오류 메시지 삭제
      return false;
    }

    if (pw !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다."); // 비밀번호 확인 칸에서만 오류 표시
      return false;
    }

    setConfirmPasswordError(""); // 비밀번호가 일치하면 오류 메시지 삭제
    return true;
  };

  // ✅ **비밀번호 & 비밀번호 확인 입력 시 실시간 검사**
  useEffect(() => {
    if (confirmPassword) validatePasswordsMatch();
  }, [pw, confirmPassword]);

  // 아이디 중복 체크
  const handleUserIdCheck = async () => {
    // 아이디 형식이 유효하지 않으면 중복 체크를 하지 않음
    if (!validateUserId(userId)) return;

    try {
      const response = await idCheck(userId);
      if (response) {
        setUserIdError("이미 존재하는 아이디입니다.");
        setIsUsernameValid(false);
      } else {
        setUserIdError("사용 가능한 아이디입니다.");
        setIsUsernameValid(true);
      }
    } catch (error) {
      console.error("아이디 중복 확인 오류:", error);
      setUserIdError("서버 오류 발생");
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
        from: "signup",
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
    console.log("🚀 가입하기 버튼이 클릭됨!");

    // 아이디 중복 체크
    if (!isUsernameValid) {
      alert("아이디 중복 체크를 먼저 해주세요.");
      return;
    }

    if (!validatePassword(pw)) {
      alert("비밀번호를 올바르게 입력하세요.");
      return;
    }
    if (!validatePasswordsMatch()) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!validateRrn()) {
      alert("유효한 주민등록번호를 입력하세요.");
      return;
    }
    if (!validatePhone()) {
      alert("유효한 전화번호를 입력하세요.");
      return;
    }

    console.log("✅ 모든 유효성 검사 통과!");

    try {
      // 회원가입 요청
      const signupData = {
        userId: userId,
        pw: pw,
        name: name,
        phone: phone,
        email: `${email}@${emailDomain}`,
        residentNum: `${rrnFirst}-${rrnSecond}`,
        casual: casual,
        chic: chic,
        classic: classic,
        minimal: minimal,
        street: street,
        sporty: sporty
      };
      const response = await userSignup(signupData);

      console.log("📨 서버 응답:", response);

      // ✅ 3. 회원가입 성공 처리
      if (response.status === 200 || response.status === 201) {
        alert("🎉 회원가입이 완료되었습니다!");
        navigate("/login"); // 로그인 페이지로 이동
      } else {
        alert("❌ 회원가입 실패! 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("❌ 회원가입 오류:", err);
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <h1>회원가입</h1>
        <form onSubmit={signup}>
          <div className="form-group">
            <div className="form-group id-group">
              <label htmlFor="userId">아이디</label>
              <input
                type="text"
                id="userId"
                placeholder="아이디 입력(6~20자)"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  validateUserId(e.target.value);
                }}
                onBlur={validateUserId}
                required
              />
              <button type="button" onClick={handleUserIdCheck}>중복 확인</button>
            </div>
            {userIdError && <div className="error-message">{userIdError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="pw">비밀번호</label>
            <input
              type="password"
              id="pw"
              placeholder="대소문자, 특수기호, 숫자 포함"
              className="password-input"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="pw-confirm">비밀번호 확인</label>
            <input
              type="password"
              id="pw-confirm"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validatePasswordsMatch();
              }}
              required
            />
            {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
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
            <div className="form-group">
              <label htmlFor="rrn">주민등록번호</label>
              <div className="rrn-group">
                <input
                  type="text"
                  id="rrn-first"
                  onChange={handleRrnFirstChange}
                  onBlur={validateRrn}
                  placeholder="앞 6자리"
                  maxLength="6"
                />
                <span>-</span>
                <input
                  type="password"
                  id="rrn-second"
                  onChange={handleRrnSecondChange}
                  onBlur={validateRrn}
                  placeholder="뒤 7자리"
                  maxLength="7"
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
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>선호 스타일</label>
            <div className="preferred-style">
              {preferredStyle.length > 0 ? (
                <span>{preferredStyle.join(", ")}</span>
              ) : (
                <span className="placeholder-text">선택된 스타일이 없습니다.</span>
              )}
            </div>
            <button
              type="button"
              className="style-button"
              onClick={handleStyleSelection}
            >
              선호하는 스타일 선택
            </button>
          </div>

          <div className="btn-group">
            <button
              type="submit"
              className="btn-submit"
              onClick={signup}
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
