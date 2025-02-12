import React, { useState, useEffect } from "react";
import { useEvents } from "../context/eventsContext";
import { useUser } from "../context/UserContext";
import { getClosets, getImg } from "../api/closetsService";
import "../css/Codirecmainstyle.css";

const CodiRecommendmain = () => {
    const { events } = useEvents(); // 캘린더에서 가져온 일정
    const { user } = useUser();
    const [selectedSchedule, setSelectedSchedule] = useState(""); // 선택한 일정
    const [closetItems, setClosetItems] = useState([]); // 사용자의 의류 데이터
    const [selectedClothes, setSelectedClothes] = useState([]); // 선택한 의류
    const [generatedCodi, setGeneratedCodi] = useState(null);

    // 일정 카테고리
    const scheduleCategories = ["결혼식", "데이트", "출퇴근"];

    useEffect(() => {
        console.log("📅 불러온 일정 데이터:", events);
    }, [events]);

    // 사용자 의류 데이터 가져오기
    useEffect(() => {
        if (user?.id) {
            fetchClosetData();
        }
    }, [user?.id]);

    const fetchClosetData = async () => {
        try {
            const data = await getClosets(user.id);
            console.log("📦 불러온 옷장 데이터:", data);

            // 이미지 URL 변환 및 카테고리 추가
            const updatedClosetItems = await Promise.all(
                data.map(async (item) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category, // 의류 카테고리 (상의, 하의, 아우터)
                    imageUrl: await getImg(item.file),
                }))
            );

            setClosetItems(updatedClosetItems);
        } catch (error) {
            console.error("🚨 옷장 데이터 로드 실패:", error);
        }
    };

    // ✅ 의류 선택 핸들러 (클릭하여 선택/해제)
    const handleSelectClothing = (item) => {
        setSelectedClothes((prev) =>
            prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
        );
        console.log("선택된 옷 데이터:", item);
    };

    // 코디 생성 버튼 핸들러
    const handleGenerateCodi = () => {
        if (!selectedSchedule || selectedClothes.length === 0) {
            alert("일정과 보유 의류를 선택해주세요!");
            return;
        }

        setGeneratedCodi({
            schedule: selectedSchedule,
            items: selectedClothes,
            image: "/img/street.jpg",
        });
    };

    return (
        <div className="codi-container">
            {/* 왼쪽: 일정 선택 */}
            <div className="codi-section codi-left">
                <h2>일정 선택</h2>
                {scheduleCategories.map((category) => (
                    <div key={category} className="schedule-category">
                        <h3>{category}</h3>
                        <div className="schedule-list">
                            {events
                                .filter((event) => event.type === category)
                                .map((event) => (
                                    <button
                                        key={event.id}
                                        className={`schedule-btn ${selectedSchedule === event.title ? "selected" : ""}`}
                                        onClick={() => setSelectedSchedule(event.title)}
                                        style={{ backgroundColor: event.color || "#4caf50", color: "#fff" }} // ✅ 색상 적용
                                    >
                                        {event.title}
                                    </button>
                                ))}
                        </div>

                    </div>
                ))}
            </div>

            {/* 가운데: 보유 의류 선택 */}
            <div className="codi-section codi-middle">
                <h2>보유 의류</h2>
                {["상의", "하의", "외투", "신발"].map((category) => (
                    <div key={category} className="clothing-category">
                        <h3>{category}</h3>
                        <div className="closet-list">
                            {closetItems
                                .filter((item) => item.category === category)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className={`closet-item ${selectedClothes.includes(item) ? "selected" : ""}`}
                                        onClick={() => handleSelectClothing(item)}
                                    >
                                        <img src={item.imageUrl} alt={item.name} />
                                        <p>{item.name}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 오른쪽: 코디 이미지 출력 */}
            <div className="codi-section codi-right">
                <h2>코디</h2>
                {generatedCodi ? (
                    <div>
                        <img src={generatedCodi.image} alt="코디 이미지" />
                    </div>
                ) : (
                    <p>코디를 추천해 드릴게요!</p>
                )}
                <button onClick={handleGenerateCodi}>코디 생성</button>
            </div>
        </div>
    );
};

export default CodiRecommendmain;
