import React, { useState, useEffect } from "react";
import { useEvents } from "../context/eventsContext";
import { useUser } from "../context/UserContext";
import { getClosets, getImg } from "../api/closetsService";
import "../css/Codirecmainstyle.css";

{/* 코디추천 페이지 */}
const CodiRecommendmain = () => {
    const { events } = useEvents();
    const { user } = useUser();
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [closetItems, setClosetItems] = useState([]);  // 사용자가 등록한 의류 데이터
    const [selectedClothes, setSelectedClothes] = useState([]);
    const [generatedCodi, setGeneratedCodi] = useState(null);

    useEffect(() => {
        console.log("불러온 일정 데이터:", events); // 디버깅용 로그
    }, [events]);

    // 사용자의 의류 데이터를 가져오기
    useEffect(() => {
        if (user?.id) {
            fetchClosetData();
        }
    }, [user?.id]);

    const fetchClosetData = async () => {
        try {
            const data = await getClosets(user.id);
            console.log("📦 불러온 옷장 데이터:", data);

            // 이미지 URL 변환
            const updatedClosetItems = await Promise.all(
                data.map(async (item) => ({
                    id: item.id,
                    name: item.name,
                    imageUrl: await getImg(item.file), // 이미지 파일 URL 가져오기
                }))
            );

            setClosetItems(updatedClosetItems);
        } catch (error) {
            console.error("🚨 옷장 데이터 로드 실패:", error);
        }
    };

    // 의류 선택 핸들러
    const handleSelectClothing = (item) => {
        setSelectedClothes((prev) =>
            prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
        );
    };

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
                <div className="closet-list">
                    {closetItems.length > 0 ? (
                        closetItems.map((item, index) => (
                            <div
                                key={item.id || index}  // ✅ 고유한 key 추가
                                className={`closet-item ${selectedClothes.includes(item) ? "selected" : ""}`}
                                onClick={() => handleSelectClothing(item)}
                            >
                                <img src={item.imageUrl} alt={item.name} />
                                <p>{item.name}</p>
                            </div>
                        ))
                    ) : (
                        <p>등록된 의류가 없습니다.</p>
                    )}
                </div>
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
                    <p></p>
                )}
                <button onClick={handleGenerateCodi}>코디 생성</button>
            </div>
        </div>
    );
};

export default CodiRecommendmain;
