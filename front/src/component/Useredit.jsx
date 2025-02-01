import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 Hook
import "../css/Usereditstyle.css";

const API_BASE_URL = "http://localhost:8081/api/auth"; // 백엔드 API 주소

const Useredit = ({user, setUser}) => {
  const navigate = useNavigate(); // 페이지 이동 함수
  
  // 사용자 정보 상태값 (초기값 null)
  const [password, setPassword] = useState(""); // 비밀번호 입력 필드
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // 회원 정보 수정 요청 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 이벤트(페이지 새로고침) 방지
    if (!user) return; // 사용자 정보가 없으면 실행하지 않음

    const updatedUser = {
      ...user, // 기존 사용자 정보 유지
      password: password || user.password, // 비밀번호 입력이 없으면 기존 값 유지
      phone, // 입력된 전화번호 값
      email, // 입력된 이메일 값
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/${user.id}`, updatedUser);
      alert("회원 정보가 수정되었습니다."); // 성공 메시지
      setUser(response.data); // 수정된 사용자 정보 업데이트
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
