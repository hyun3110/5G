import React, { useState, useEffect } from "react";
import { useEvents } from "../context/eventsContext";
import "../css/Codirecmainstyle.css"; 

const CodiRecommendmain = () => {
  const { events } = useEvents();
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedClothes, setSelectedClothes] = useState([]);
  const [generatedCodi, setGeneratedCodi] = useState(null);

  useEffect(() => {
    console.log("불러온 일정 데이터:", events); // 디버깅용 로그
  }, [events]);

  const clothes = ["코트", "청바지", "셔츠", "운동화", "니트"];

  const handleGenerateCodi = () => {
    if (!selectedSchedule || selectedClothes.length === 0) {
      alert("일정과 보유 의류를 선택해주세요!");
      return;
    }
    
    setGeneratedCodi({
      schedule: selectedSchedule,
      items: selectedClothes,
      image: "/img/me.png" // 실제 이미지 경로로 변경 가능
    });
  };

  return (
    <div className="codi-container">
      {/* 왼쪽: 일정 선택 */}
      <div className="codi-section codi-left">
        <h2>일정 선택</h2>
        <div className="schedule-list">
          {events.length > 0 ? (
            events.map((event) => (
              <button
                key={event.id}
                className={`schedule-btn ${selectedSchedule === event.title ? "selected" : ""}`}
                onClick={() => setSelectedSchedule(event.title)}
              >
                {event.title}
              </button>
            ))
          ) : (
            <p>저장된 일정이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 가운데: 보유 의류 선택 */}
      <div className="codi-section codi-middle">
        <h2>보유 의류</h2>
        <ul>
          {clothes.map((item) => (
            <li key={item}>
              <input
                type="checkbox"
                value={item}
                onChange={(e) =>
                  setSelectedClothes((prev) =>
                    e.target.checked
                      ? [...prev, item]
                      : prev.filter((c) => c !== item)
                  )
                }
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      
      {/* 오른쪽: 코디 이미지 출력 */}
      <div className="codi-section codi-right">
        <h2>코디</h2>
        {generatedCodi ? (
          <div>
            <p>📅 일정: {generatedCodi.schedule}</p>
            <p>👕 착용 의류: {generatedCodi.items.join(", ")}</p>
            <img src={generatedCodi.image} alt="코디 이미지" />
          </div>
        ) : (
          <p>코디를 생성해주세요!</p>
        )}
        <button onClick={handleGenerateCodi}>코디 생성</button>
      </div>
    </div>
  );
};

export default CodiRecommendmain;
