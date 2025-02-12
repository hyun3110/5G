// EditEventForm.js
import React, { useState, useEffect } from 'react';
import { updateEvent, deleteEvent } from '../api/apiService'; // API 호출
import KakaoMap from "./Kakaomap";
import '../css/Codirecstyle.css';

const EditEventForm = ({
    eventDetails,
    setEventDetails,
    events,
    setEvents,
    error,
    setError,
    closeModal,
}) => {
    const [initialLat, setInitialLat] = useState(eventDetails.lat);
    const [initialLon, setInitialLon] = useState(eventDetails.lon);

    // 장소 선택 처리 (KakaoMap API 사용)
    const handleLocationSelect = async (lat, lon) => {
        console.log("📌 선택된 위치:", lat, lon);
        setEventDetails((prev) => ({ ...prev, lat, lon }));

        const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
            }

            const data = await response.json();

            // ✅ API 데이터 구조 확인 후 적용
            setEventDetails((prev) => ({
                ...prev,
                feelsLike: data.main?.feels_like || "정보 없음",
            }));

            console.log("📌 현재 날씨 데이터:", data);
        } catch (error) {
            console.error("날씨 데이터 가져오기 오류:", error);
        }
    };

    useEffect(() => {
        console.log(eventDetails)
        setInitialLat(eventDetails.lat);
        setInitialLon(eventDetails.lon);
    }, [eventDetails]);

    const today = new Date().toISOString().split("T")[0];

    const handleSaveEvent = () => {
        if (
            !eventDetails.title ||
            !eventDetails.type ||
            !eventDetails.startDate ||
            !eventDetails.endDate ||
            !eventDetails.feelsLike
        ) {
            setError("모든 내용을 입력해주세요.");
            return;
        }
        const newEvent = {
            id: eventDetails.id,
            title: eventDetails.title,
            type: eventDetails.type,
            startDate: eventDetails.startDate
                ? eventDetails.startDate.includes("T")
                    ? eventDetails.startDate  // 이미 T가 붙은 경우 그대로 사용
                    : `${eventDetails.startDate}T00:00:01`  // 수정된 경우 T 추가
                : eventDetails.startDate,  // 수정되지 않았다면 기존 값 그대로 사용

            endDate: eventDetails.endDate
                ? eventDetails.endDate.includes("T")
                    ? eventDetails.endDate  // 이미 T가 붙은 경우 그대로 사용
                    : `${eventDetails.endDate}T23:59:59`  // 수정된 경우 T 추가
                : eventDetails.endDate,  // 수정되지 않았다면 기존 값 그대로 사용

            description: eventDetails.description,
            color: eventDetails.color,
            feelsLike: eventDetails.feelsLike,
            lat: eventDetails.lat,
            lon: eventDetails.lon
        }

        updateEvent(newEvent)
            .then((updatedEvent) => {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === updatedEvent.id
                            ? {
                                ...event,
                                title: updatedEvent.scheTitle,
                                start: updatedEvent.startDate,
                                end: updatedEvent.endDate,
                                color: updatedEvent.color || "#ADD8E6",
                                description: updatedEvent.scheContent || "",
                                feelsLike: updatedEvent.feelsLike,
                                lat: updatedEvent.lat,
                                lon: updatedEvent.lon
                            }
                            : event
                    )
                );
                localStorage.setItem("events", JSON.stringify(events));
                closeModal();
            })
            .catch((err) => {
                console.error("일정 수정 실패:", err);
            });
    };

    const handleDeleteEvent = () => {
        const confirmDelete = window.confirm("정말로 이 일정을 삭제하시겠습니까?");
        if (confirmDelete && eventDetails.id) {
            deleteEvent(eventDetails.id)
                .then(() => {
                    setEvents((prevEvents) =>
                        prevEvents.filter((event) => event.id !== eventDetails.id)
                    );
                    localStorage.setItem("events", JSON.stringify(events));
                    closeModal();
                })
                .catch((err) => {
                    console.error("일정 삭제 실패:", err);
                });
        }
    };

    return (
        <div style={{ width: "95%", padding: "10px" }}>
            {/* 제목을 별도 div로 분리하여 세로 정렬 유지 */}
            <h3 style={{ marginBottom: "10px" }}>일정 수정</h3>

            {/* 메인 컨테이너 - 왼쪽 입력폼 + 오른쪽 지도 & 날씨 */}
            <div style={{ display: "flex", gap: "20px" }}>
                {/* 왼쪽 컬럼: 일정 입력 폼 */}
                <div style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "1px solid #ddd",
                    paddingRight: "20px",
                    gap: "8px" // 요소 간격 조정
                }}>
                    <label>제목</label>
                    <input
                        type="text"
                        value={eventDetails.title}
                        onChange={(e) =>
                            setEventDetails({ ...eventDetails, title: e.target.value })
                        }
                        style={{ marginBottom: "5px" }}
                    />

                    <label>일정 유형: </label>
                    <select
                        value={eventDetails.type}
                        onChange={(e) =>
                            setEventDetails({ ...eventDetails, type: e.target.value })
                        }
                        style={{
                            width: "150px",  // ✅ 너비 조절
                            marginBottom: "5px"
                        }}
                    >
                        <option value="">선택</option>
                        {["결혼식", "출퇴근", "데이트"].map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    <label>시작일</label>
                    <input
                        type="date"
                        value={eventDetails.startDate.split("T")[0]}
                        onChange={(e) =>
                            setEventDetails({ ...eventDetails, startDate: e.target.value })
                        }
                        min={today}
                        style={{ marginBottom: "5px" }}
                    />

                    <label>종료일</label>
                    <input
                        type="date"
                        value={eventDetails.endDate.split("T")[0]}
                        onChange={(e) =>
                            setEventDetails({ ...eventDetails, endDate: e.target.value })
                        }
                        min={eventDetails.startDate.split("T")[0]}
                        style={{ marginBottom: "5px" }}
                    />

                    <label>설명</label>
                    <textarea
                        value={eventDetails.description}
                        onChange={(e) =>
                            setEventDetails({ ...eventDetails, description: e.target.value })
                        }
                        style={{ marginBottom: "5px" }}
                    />

                    <label>색상 선택:</label>
                    <div>
                        {["#FFB6C1", "#FFD700", "#90EE90", "#87CEFA", "#FFA07A", "#9370DB", "#FF6347"].map(
                            (color) => (
                                <button
                                    key={color}
                                    type="button"
                                    style={{
                                        backgroundColor: color,
                                        border: "none",
                                        margin: "0 5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        setEventDetails((prev) => ({ ...prev, color: color }))
                                    }
                                >
                                    {color === eventDetails.color ? "✔" : " "}
                                </button>
                            )
                        )}
                    </div>

                    {error && <p className="error">{error}</p>}
                    <div>
                        <button onClick={handleSaveEvent} style={{ marginRight: "5px" }}>수정</button>
                        <button onClick={handleDeleteEvent} className="delete-button">삭제</button>
                        <button onClick={closeModal}>닫기</button>
                    </div>
                </div>

                {/* 오른쪽 컬럼: 장소 선택 & 날씨 정보 */}
                <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h3>📍 장소 선택</h3>
                    <KakaoMap onSelectLocation={handleLocationSelect} initialLat={initialLat} initialLon={initialLon} />

                    {/* 날씨 정보 */}
                    <div>
                        <h3>🌤 날씨 정보</h3>
                        {eventDetails.feelsLike ? (
                            <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "8px" }}>
                                <p><strong>체감 온도:</strong> {eventDetails.feelsLike}°C</p>
                            </div>
                        ) : (
                            <p>날씨 정보를 불러오는 중...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default EditEventForm;
