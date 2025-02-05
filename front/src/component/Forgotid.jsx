import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../css/Forgotidstyle.css';

// 이름, 주민번호로 아이디 찾기
const ForgotId = () => {
  const [name, setName] = useState("");
  const [rrnFirst, setRrnFirst] = useState("");
  const [rrnSecond, setRrnSecond] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [foundId, setFoundId] = useState("");
  const navigate = useNavigate();

  
  // 주민등록번호 입력 핸들러 (숫자만 입력 가능)
  const handleRrnFirstChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 6) value = value.slice(0, 6); // 6자리 제한
    setRrnFirst(value);
  };

  const handleRrnSecondChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 7) value = value.slice(0, 7); // 7자리 제한
    setRrnSecond(value);
  };

  // 아이디 찾기 요청
  const handleRetrieveId = async () => {
    if (!name.trim() || rrnFirst.length !== 6 || rrnSecond.length !== 7) {
      setMessage({ text: "이름과 주민등록번호를 올바르게 입력하세요.", type: "error" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/auth/find-id", {
        name,
        residentRegNum: `${rrnFirst}-${rrnSecond}`,
      });

      if (response.data.userId) {
        setFoundId(response.data.userId);
        setMessage({ text: `회원님의 아이디는 "${response.data.userId}" 입니다.`, type: "success" });
      } else {
        setMessage({ text: "입력한 정보와 일치하는 아이디가 없습니다.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "서버 오류가 발생했습니다. 다시 시도해주세요.", type: "error" });
    }
  };

  // Enter 키 입력 시 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRetrieveId();
    }
  };

  return (
    <div className="forgot-id-container">
      <div className="forgot-id-box">
        <h1>아이디 찾기</h1>
        <p>이름과 주민등록번호를 입력하면 아이디를 찾을 수 있습니다.</p>

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
            onChange={handleRrnFirstChange}
            maxLength="6"
            onKeyDown={handleKeyDown}
          />
          <span>-</span>
          <input
            type="text"
            placeholder="주민등록번호 뒤 7자리"
            value={rrnSecond}
            onChange={handleRrnSecondChange}
            maxLength="7"
            onKeyDown={handleKeyDown}
          />
        </div>

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        {foundId && (
          <div className="found-id">
            <p>회원님의 아이디: <strong>{foundId}</strong></p>
          </div>
        )}

        <button onClick={handleRetrieveId}>ID 전송</button>
        <a onClick={() => navigate('/Login')}>로그인</a>
      </div>
    </div>
  );
};

export default ForgotId;