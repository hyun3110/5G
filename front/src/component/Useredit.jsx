import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 페이지 이동을 위한 Hook
import "../css/Usereditstyle.css";
import { useUser } from "../context/UserContext";
import { userEdit } from "../api/authService";

const Useredit = () => {
  const navigate = useNavigate(); // 페이지 이동 함수
  const location = useLocation();
  const { user, setUser } = useUser();  // user 정보 가져오기

  // 사용자 정보 상태값 (초기값 null)
  // 기존 입력 필드 유지 (location.state에 기존 데이터가 있으면 유지)
  const [password, setPassword] = useState(location.state?.password || ""); 
  const [phone, setPhone] = useState(location.state?.phone || user?.phone || ""); 
  const [email, setEmail] = useState(location.state?.email || user?.email || ""); 
  const [preferredStyle, setPreferredStyle] = useState(location.state?.preferredStyle || user?.preferredStyle || []); const [styles, setStyles] = useState({
    casual: user?.casual || false,
    chic: user?.chic || false,
    classic: user?.classic || false,
    minimal: user?.minimal || false,
    street: user?.street || false,
    sporty: user?.sporty || false,
  });

  const [newUser, setNewUser] = useState(null);

  useEffect(() => {
    if (location.state?.preferredStyle) {
      setPreferredStyle(location.state.preferredStyle);
      setStyles({
        casual: location.state.preferredStyle.includes("casual"),
        chic: location.state.preferredStyle.includes("chic"),
        classic: location.state.preferredStyle.includes("classic"),
        minimal: location.state.preferredStyle.includes("minimal"),
        street: location.state.preferredStyle.includes("street"),
        sporty: location.state.preferredStyle.includes("spoty"),
      });
    }
  }, [location.state?.preferredStyle]);

  const handleStyleSelection = () => {
    navigate("/look", {
      state: {
        from: "useredit", // 회원정보 수정 페이지에서 접근
        password,
        phone,
        email,
        preferredStyle,
        styles,
      },
    });
  };

  // 회원 정보 수정 요청 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 이벤트(페이지 새로고침) 방지
    if (!user) return; // 사용자 정보가 없으면 실행하지 않음

    const updatedUser = {
      ...user, // 기존 사용자 정보 유지
      pw: password || user.pw, // 비밀번호 입력이 없으면 기존 값 유지
      phone: phone || user.phone, // 입력된 전화번호 값
      email: email || user.email, // 입력된 이메일 값
      casual: styles.casual,
      chic: styles.chic,
      classic: styles.classic,
      minimal: styles.minimal,
      street: styles.street,
      sporty: styles.sporty
    };
    console.log(updatedUser)

    try {
      const newUserResponse = await userEdit(updatedUser);
      setNewUser(newUserResponse);
    } catch (error) {
      alert("수정 실패: " + error.message);
    }
  };
  
  useEffect(() => {
    // 상태가 변경될 때마다 관련된 작업을 처리
    if (newUser) {
      setUser(newUser);
      alert("회원 정보가 수정되었습니다."); // 성공 메시지
      navigate("/mypage"); // 수정 완료 후 마이페이지로 이동
    }
  }, [newUser]);
  
  return (
    <div className="member-edit-container">
      <h2>회원정보 수정</h2>
      {user ? ( // user 정보가 있으면 폼을 표시
        <form className="member-form" onSubmit={handleSubmit}>
          <label>아이디</label>
          <input type="text" value={user.userId} disabled /> {/* 아이디는 수정 불가 */}

          <label>신규 비밀번호</label>
          <input
            type="password"
            placeholder="새 비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>전화번호</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>이메일 주소</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* 선호 스타일 선택 버튼 추가 */}
          <label>선호 스타일</label>
          <div className="style-selection">
            <button type="button" className="style-btn" onClick={handleStyleSelection}>
              선호하는 스타일 선택
            </button>
          </div>

          <div className="button-group">
            <button type="submit" className="update-btn">
              수정하기
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/Mypage")}>
              취소
            </button>
          </div>
        </form>
      ) : (
        <p>로딩 중...</p> // user 정보가 없으면 로딩 메시지 표시
      )}
    </div>
  );
};

export default Useredit;
