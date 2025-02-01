import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Lookstyle.css";

const outfits = [
  { id: 1, image: "/images/outfit1.jpg", style: "스타일1" },
  { id: 2, image: "/images/outfit2.jpg", style: "스타일2" },
  { id: 3, image: "/images/outfit3.jpg", style: "스타일3" },
  { id: 4, image: "/images/outfit4.jpg", style: "스타일4" },
  { id: 5, image: "/images/outfit5.jpg", style: "스타일5" },
  { id: 6, image: "/images/outfit6.jpg", style: "스타일6" },
  { id: 7, image: "/images/outfit7.jpg", style: "스타일7" },
  { id: 8, image: "/images/outfit8.jpg", style: "스타일8" }
];

const FashionRecommendation = () => {
  const [selectedOutfits, setSelectedOutfits] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelectedOutfits((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    console.log("선택된 코디:", selectedOutfits);
    alert("선택한 스타일이 저장되었습니다!");
    navigate("/signup", { state: { preferredStyle: selectedOutfits } });
  };

  return (
    <div className="look-container">
      <div className="content-box">
        <h2 className="title">선호하는 스타일을 골라보세요!</h2>
        <div className="grid-container">
          {outfits.map((outfit) => (
            <div
              key={outfit.id}
              className={`grid-item ${selectedOutfits.includes(outfit.id) ? "selected" : ""}`}
              onClick={() => handleSelect(outfit.id)}
            >
              <img src={outfit.image} alt={outfit.style} className="outfit-image" />
            </div>
          ))}
        </div>
        <div className="button-container">
          <button className="confirm-button" onClick={handleConfirm}>
            취향 확인
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
