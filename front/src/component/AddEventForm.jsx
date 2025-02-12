import React, { useState, useRef } from 'react';
import '../css/Codirecstyle.css';
import { addEvent } from '../api/apiService'; // API 호출
import KakaoMap from "./Kakaomap";

const AddEventForm = ({
    eventDetails,
    setEventDetails,
    events,
    setEvents,
    error,
    setError,
    closeModal,
}) => {
    const today = new Date().toISOString().split("T")[0];
    const calendarRef = useRef(null);

    // 종료일이 시작일보다 이전일 경우 에러 메시지 설정
    const handleEndDateChange = (e) => {
        const endDate = e.target.value;
        setEventDetails({ ...eventDetails, endDate });

        if (new Date(endDate) < new Date(eventDetails.startDate)) {
            setError("종료일은 시작일보다 앞설 수 없습니다.");
        } else {
            setError(""); // 종료일이 유효하면 에러 메시지 초기화
        }
    };

    const handleStartDateChange = (e) => {
        const startDate = e.target.value;
        setEventDetails({ ...eventDetails, startDate });

        // 시작일이 설정되면 종료일의 최소값을 시작일로 설정
        if (new Date(eventDetails.endDate) < new Date(startDate)) {
            setError("시작일이 종료일보다 늦을 수 없습니다.");
        } else {
            setError(""); // 시작일이 유효하면 에러 메시지 초기화
        }
    };

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
            title: eventDetails.title,
            type: eventDetails.type,
            startDate: `${eventDetails.startDate}T00:00:01`,
            endDate: `${eventDetails.endDate}T23:59:59`,
            description: eventDetails.description,
            color: eventDetails.color,
            feelsLike: eventDetails.feelsLike,
            lat: eventDetails.lat,
            lon: eventDetails.lon
        }

        addEvent(newEvent)
            .then((newEvent) => {
                setEvents((prevEvents) => {
                    const updatedEvents = [
                        ...prevEvents,
                        {
                            id: newEvent.scheIdx,
                            title: newEvent.scheTitle,
                            startDate: newEvent.startDate,
                            endDate: newEvent.endDate,
                            color: newEvent.color || "#ADD8E6",
                            description: newEvent.scheContent || "",
                            feelsLike: newEvent.feelsLike,
                            lat: newEvent.lat,
                            lot: newEvent.lot
                        },
                    ];
                    localStorage.setItem("events", JSON.stringify(events));
                    return updatedEvents;
                });

                // 캘린더 업데이트
                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.refetchEvents();  // 변경된 이벤트를 다시 가져오도록 요청
                    calendarApi.render();  // 강제로 캘린더 렌더링
                }

                closeModal();
            })
            .catch((err) => {
                console.error("일정 저장 실패:", err);
            });
    };

    return (
        <div style={{ display: "flex", gap: "20px", width: "100%" }}>  {/* ✅ 가로 정렬 추가 */}
            
            {/* 왼쪽 컬럼: 일정 입력 폼 */}
            <div style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid #ddd", // ✅ 오른쪽에 구분선 추가
                paddingRight: "20px",
            }}>
                <h3>일정 추가</h3>
                <label>제목</label>
                <input
                    type="text"
                    value={eventDetails.title}
                    onChange={(e) =>
                        setEventDetails({ ...eventDetails, title: e.target.value })
                    }
                    style={{ marginBottom: "1px" }}
                />
                <br />
                <label>일정 유형: </label>
                <select
                    value={eventDetails.type}
                    onChange={(e) =>
                        setEventDetails({ ...eventDetails, type: e.target.value })
                    }
                    style={{
                        width: "150px",  // ✅ 너비 조절
                        marginBottom: "1px"
                    }}
                >
                    <option value="">선택</option>
                    {["결혼식", "출퇴근", "데이트"].map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <br />
                <label>시작일</label>
                <input
                    type="date"
                    value={eventDetails.startDate}
                    onChange={handleStartDateChange}
                    min={today}
                    style={{ marginBottom: "1px" }}
                />
                <br />
                <label>종료일</label>
                <input
                    type="date"
                    value={eventDetails.endDate}
                    onChange={handleEndDateChange}
                    min={eventDetails.startDate}
                    style={{ marginBottom: "1px" }}
                />
                <br />
                <label>설명</label>
                <textarea
                    value={eventDetails.description}
                    onChange={(e) =>
                        setEventDetails({ ...eventDetails, description: e.target.value })
                    }
                    style={{ marginBottom: "1px" }}
                />
                <br />
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
                <br />
                {error && <p className="error">{error}</p>}
                <button className="a-button" onClick={handleSaveEvent}>저장</button>
                <button className="b-button" onClick={closeModal}>닫기</button>
            </div>
    
            {/* ✅ 오른쪽 컬럼: 장소 선택 & 날씨 정보 */}
            <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "15px" }}>
                <h3>📍 장소 선택</h3>
                <KakaoMap onSelectLocation={handleLocationSelect} />
                
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
    );    
};

export default AddEventForm;
