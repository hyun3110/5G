import React, { useState } from 'react';
import { addEvent } from '../api/apiService'; // API 호출

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

    const handleSaveEvent = () => {
        if (
            !eventDetails.title ||
            !eventDetails.type ||
            !eventDetails.startDate ||
            !eventDetails.endDate
        ) {
            setError("모든 내용을 입력해주세요.");
            return;
        }

        addEvent(eventDetails)
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
                        },
                    ];
                    localStorage.setItem("events", JSON.stringify(updatedEvents));
                    return updatedEvents;
                });
                closeModal();
            })
            .catch((err) => {
                console.error("일정 저장 실패:", err);
            });
    };

    return (
        <div>
            <button className="calander-xclose-button" onClick={closeModal}>
                X
            </button>
            <br />
            <label>제목</label>
            <input
                type="text"
                value={eventDetails.title}
                onChange={(e) =>
                    setEventDetails({ ...eventDetails, title: e.target.value })
                }
            />
            <br />
            <label>일정 유형: </label>
            <select
                value={eventDetails.type}
                onChange={(e) =>
                    setEventDetails({ ...eventDetails, type: e.target.value })
                }
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
            />
            <br />
            <label>종료일</label>
            <input
                type="date"
                value={eventDetails.endDate}
                onChange={handleEndDateChange}
                min={eventDetails.startDate}
            />
            <br />
            <label>설명</label>
            <textarea
                value={eventDetails.description}
                onChange={(e) =>
                    setEventDetails({ ...eventDetails, description: e.target.value })
                }
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
            <button onClick={handleSaveEvent}>저장</button>
        </div>
    );
};

export default AddEventForm;
