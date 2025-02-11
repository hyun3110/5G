import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Pwconfirm.css";
import { useUser } from "../context/UserContext";
import { pwCheck } from "../api/authService";

const Pwconfirm = () => {
  const [password, setPassword] = useState(""); // 사용자가 입력한 비밀번호
  const navigate = useNavigate();
  const { user } = useUser();  // user 정보 가져오기

  // 비밀번호 확인 요청
  const handleConfirm = async (e) => {
    e.preventDefault(); // 기본 이벤트 방지

    try {
      const response = await pwCheck(user.userId, password);
      if (response.data) {
        navigate("/Useredit"); // 비밀번호가 맞으면 회원정보 수정 페이지로 이동
      } else {
        alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요."); // 경고창 띄우기
        setPassword(""); // 입력 필드 초기화
      }
    } catch (error) {
      alert("서버 오류가 발생했습니다. 다시 시도해주세요."); // 서버 오류 처리
    }
  };

  return (
    <div className="password-confirm-container">
      <h2>회원정보 수정</h2>
      <form className="password-form" onSubmit={handleConfirm}>
        <label>본인 확인</label>
        <input
          type="password"
          placeholder="기존 비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-group">
          <button type="submit" className="confirm-btn">확인</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/Mypage")}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default Pwconfirm;
