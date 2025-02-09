import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/Lookstyle.css";

const outfits = [
  { id: 1, image: "/img/casual.jpg", style: "casual" },
  { id: 2, image: "/img/chic.jpg", style: "chic" },
  { id: 3, image: "/img/classic.jpg", style: "classic" },
  { id: 4, image: "/img/minimal.jpg", style: "minimal" },
  { id: 5, image: "/img/spoty.jpg", style: "spoty" },
  { id: 6, image: "/img/street.jpg", style: "street" }
];

const FashionRecommendation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedOutfits, setSelectedOutfits] = useState([]); // 선택된 스타일 저장 (기존 스타일 자동 반영 X)

  const handleSelect = (outfit) => {
    setSelectedOutfits((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === outfit.id);

      if (isAlreadySelected) {
        return prev.filter((item) => item.id !== outfit.id); // 선택 해제
      } else {
        return [...prev, { id: outfit.id, style: outfit.style }]; // 스타일 정보 추가
      }
    });
  };

  const handleConfirm = async () => {
    const selectedStyles = selectedOutfits.map((item) => item.style); // 변수 선언 추가
    console.log("선택된 스타일:", selectedOutfits.map((item) => item.style));
    
    if (location.state?.from === "signup") {
      // 회원가입에서 온 경우 → Signup 페이지로 스타일 데이터 전달
      alert("선택한 스타일이 저장되었습니다!");
      navigate("/signup", {
        state: { ...location.state, preferredStyle: selectedStyles }
      });
    } else if (location.state?.from === "useredit") {
      // 회원정보 수정에서 온 경우 → 서버에 수정 요청
      try {
        const response = await axios.post("http://localhost:8081/api/auth/update-style", {
          userId: location.state.userId,
          preferredStyle: selectedStyles
        });

        if (response.status === 200) {
          alert("스타일이 성공적으로 업데이트되었습니다!");
          navigate("/useredit", {
            state: { ...location.state, preferredStyle: selectedStyles }
          });
        }
      } catch (error) {
        console.error("스타일 업데이트 실패:", error);
        alert("스타일 업데이트에 실패했습니다.");
      }
    }
  };

  return (
    <div className="look-container">
      <div className="content-box">
        <h2 className="title">선호하는 스타일을 골라보세요!</h2>
        <div className="grid-container">
          {outfits.map((outfit) => (
            <div
              key={outfit.id}
              className={`look-item ${selectedOutfits.some((item) => item.id === outfit.id) ? "selected" : ""}`}
              onClick={() => handleSelect(outfit)}
            >
              <img src={outfit.image} alt={outfit.style} className="outfit-image" />
            </div>
          ))}
        </div>
        <div className="button-container">
          <button className="confirm-button" onClick={handleConfirm}>
            스타일 저장
          </button>
          <button className="back-button" onClick={() => navigate(-1)}>
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FashionRecommendation;
