import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // 페이지 이동을 위한 Hook
import "../css/Usereditstyle.css";
import { useUser } from "../context/UserContext";

const API_BASE_URL = "http://localhost:8081/api/auth"; // 백엔드 API 주소

const Useredit = () => {
  const navigate = useNavigate(); // 페이지 이동 함수
  const { user } = useUser();  // user 정보 가져오기
  const location = useLocation();

  // 사용자 정보 상태값 (초기값 null)
  const [password, setPassword] = useState(""); // 비밀번호 입력 필드
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredStyle, setPreferredStyle] = useState(user?.preferredStyle || []); // 선호 스타일 상태 추가
  const [styles, setStyles] = useState({
    casual: location.state?.preferredStyle?.includes("casual") || user.casual,
    chic: location.state?.preferredStyle?.includes("chic") || user.chic,
    classic: location.state?.preferredStyle?.includes("classic") || user.classic,
    minimal: location.state?.preferredStyle?.includes("minimal") || user.minimal,
    street: location.state?.preferredStyle?.includes("street") || user.street,
    sporty: location.state?.preferredStyle?.includes("sporty") || user.sporty
  });

  useEffect(() => {
    console.log(user);
    if (location.state?.preferredStyle) {
      setPreferredStyle(location.state.preferredStyle);
    }
  }, [location.state?.preferredStyle]);

  const handleStyleSelection = () => {
    navigate("/look", {
      state: {
        from: "useredit", // 회원정보 수정 페이지에서 접근
        userId: user.userId,
        phone: user.phone,
        email: user.email,
        casual: styles.casual,
        chic: styles.chic,
        classic: styles.classic,
        minimal: styles.minimal,
        street: styles.street,
        sporty: styles.sporty
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
      await axios.put(`${API_BASE_URL}/useredit`, updatedUser, { withCredentials: true });
      alert("회원 정보가 수정되었습니다."); // 성공 메시지
      navigate("/mypage"); // 수정 완료 후 마이페이지로 이동
    } catch (error) {
      alert("수정 실패: " + error.message);
    }
  };

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
