import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";
import axios from "axios";
import "../css/styles.css";

// 모달 스타일 설정
Modal.setAppElement("#root");

export default function Buttonclick() {
  const [user, setUser] = useState(null); // 유저 정보
  const [addModalIsOpen, setAddModalIsOpen] = useState(false); // 일정 추가 모달 상태
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); // 일정 수정 모달 상태
  const [events, setEvents] = useState([]); // 일정 상태
  const [eventDetails, setEventDetails] = useState({
    id: null,
    title: "",
    type: "", // 일정 유형
    startDate: "",
    endDate: "",
    description: "",
    color: "#ADD8E6", // 기본 색상 (연한 파란색)
  });
  const [error, setError] = useState(""); // 에러 메시지 상태
  const colors = ["#FFB6C1", "#FFD700", "#90EE90", "#87CEFA", "#FFA07A", "#9370DB", "#FF6347"];

  // 일정 유형 옵션
  const eventTypes = ["결혼식", "출퇴근", "데이트"];

  // 유저 정보 가져오기
  useEffect(() => {
    axios
      .get("/api/auth/userinfo", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("서버에서 회원정보 가져오기 실패", error);
      });
  }, []);

  // 일정 데이터 가져오기
  useEffect(() => {
    if (user) {
      axios
        .get(`/api/schedules/${user.id}`, {
          withCredentials: true,
        })
        .then((response) => {
          if (Array.isArray(response.data)) {
            const calendarEvents = response.data.map((event) => {
              let endDate = new Date(event.endDate);
              const startDate = new Date(event.startDate);

              // 시작일과 종료일이 다르면 종료일에 하루를 추가
              if (startDate.getTime() !== endDate.getTime()) {
                endDate.setDate(endDate.getDate() + 1); // 종료일 하루 추가
              }

              return {
                id: event.scheIdx,
                title: event.scheTitle,
                type: event.scheType,
                start: event.startDate,
                end: endDate.toISOString().split("T")[0], // 종료일을 ISO 형식으로 설정 (하루 더한 날짜)
                originalEndDate: event.endDate, // 원본 종료일 추가
                color: event.color || "#ADD8E6",
                description: event.scheContent || "",
                cordiimg: event.cordiimg || null, // 코디 이미지
              };
            });
            setEvents(calendarEvents); // 수정된 events로 상태 업데이트
          }
        })
        .catch((error) => {
          console.error("일정 정보를 가져오는 데 실패했습니다.", error);
        });
    }
  }, [user]);

  // 필수 입력값 체크 함수
  const validateForm = () => {
    if (!eventDetails.title || !eventDetails.type || !eventDetails.startDate || !eventDetails.endDate) {
      setError("모든 내용을 입력해주세요.");
      return false;
    }
    setError(""); // 에러 메시지 초기화
    return true;
  };

  // 일정 추가
  const handleSaveAddEvent = () => {
    if (!validateForm()) {
      return; // 유효성 검사를 통과하지 못하면 추가되지 않음
    }

    const addEvent = {
      scheTitle: eventDetails.title,
      scheType: eventDetails.type,
      startDate: eventDetails.startDate,
      endDate: eventDetails.endDate,
      scheContent: eventDetails.description,
      color: eventDetails.color,
      originalEndDate: eventDetails.endDate, // 원본 종료일도 저장
    };

    axios
      .post("/api/schedules/add", addEvent, { withCredentials: true })
      .then((response) => {
        const newEvent = response.data; // 여기서 받아온 데이터를 newEvent에 할당

        // 종료일에 하루 더하기
        let adjustedEndDate = newEvent.endDate;
        if (newEvent.startDate !== newEvent.endDate) {
          const endDate = new Date(newEvent.endDate);
          endDate.setDate(endDate.getDate() + 1); // 종료일에 하루 더하기
          adjustedEndDate = endDate.toISOString().split("T")[0]; // ISO 형식으로 다시 변환
        }

        // 새로운 일정을 상태에 추가
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: newEvent.scheIdx,
            title: newEvent.scheTitle,
            type: newEvent.scheType,
            start: newEvent.startDate,
            end: adjustedEndDate, // 수정된 종료일
            color: newEvent.color || "#ADD8E6",
            description: newEvent.scheContent || "",
            originalEndDate: newEvent.endDate, // 원본 종료일 저장
          },
        ]);
        closeAddModal(); // 추가 모달 닫기
      })
      .catch((error) => {
        console.error("일정 저장 실패:", error);
      });
  };

  // 일정 수정
  const handleSaveChanges = () => {
    if (!validateForm()) {
      return; // 유효성 검사를 통과하지 못하면 수정되지 않음
    }

    const updatedEvent = {
      scheId: eventDetails.id,
      scheType: eventDetails.type,
      scheTitle: eventDetails.title,
      startDate: eventDetails.startDate,
      endDate: eventDetails.endDate,
      scheContent: eventDetails.description,
      color: eventDetails.color,
    };

    axios
      .put(`/api/schedules/${updatedEvent.scheId}`, updatedEvent, {
        withCredentials: true,
      })
      .then((response) => {
        const updatedEventFromServer = response.data; // 서버에서 업데이트된 일정 데이터 받아오기

        // 종료일에 하루 더해주기
        let adjustedEndDate = updatedEventFromServer.endDate;
        if (updatedEventFromServer.startDate !== updatedEventFromServer.endDate) {
          const endDate = new Date(updatedEventFromServer.endDate);
          endDate.setDate(endDate.getDate() + 1); // 종료일에 하루 더하기
          adjustedEndDate = endDate.toISOString().split('T')[0]; // ISO 형식으로 다시 변환
        }

        // 상태 업데이트 (수정된 일정 반영)
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEventFromServer.scheIdx
              ? {
                ...event,
                title: updatedEventFromServer.scheTitle,
                type: updatedEventFromServer.scheType,
                start: updatedEventFromServer.startDate,
                end: adjustedEndDate, // 수정된 종료일 반영
                color: updatedEventFromServer.color || "#ADD8E6",
                description: updatedEventFromServer.scheContent || "",
                originalEndDate: updatedEventFromServer.endDate, // 원본 종료일도 업데이트
              }
              : event
          )
        );
        setEventDetails((prev) => ({
          ...prev,
          endDate: adjustedEndDate, // 수정된 종료일을 저장
        }));
        closeEditModal(); // 수정 모달 닫기
      })
      .catch((error) => {
        console.error("일정 저장 실패:", error);
      });
  };

  // 일정 삭제
  const handleDeleteEvent = () => {
    const confirmDelete = window.confirm("정말로 이 일정을 삭제하시겠습니까?");

    if (confirmDelete && eventDetails.id) {
      axios
        .delete(`/api/schedules/${eventDetails.id}`, { withCredentials: true })
        .then((response) => {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventDetails.id)
          );
          closeEditModal(); // 수정 모달 닫기
        })
        .catch((error) => {
          console.error("일정 삭제 실패:", error);
        });
    } else {
      console.log("삭제가 취소되었습니다.");
    }
  };

  // 일정 추가 모달 열기
  const openAddModal = () => {
    setEventDetails({
      id: null,
      title: "",
      type: "",
      startDate: "",
      endDate: "",
      description: "",
      color: "#ADD8E6",
    });
    setError(""); // 에러 메시지 초기화
    setAddModalIsOpen(true);
  };

  // 일정 수정 모달 열기
  const openEditModal = (info) => {
    const eventId = info.event.id;
    const eventToEdit = events.find((event) => String(event.id) === String(eventId)); // ID를 String으로 변환하여 비교

    if (eventToEdit) {
      setEventDetails({
        id: eventToEdit.id,
        title: eventToEdit.title,
        type: eventToEdit.type,
        startDate: eventToEdit.start,
        endDate: eventToEdit.originalEndDate, // 원본 종료일 사용
        description: eventToEdit.description || "",
        color: eventToEdit.color || "#ADD8E6",
      });
      setError(""); // 에러 메시지 초기화
      setEditModalIsOpen(true); // 수정 모달 열기
    } else {
      console.log("Event not found");
    }
  };

  // 모달 닫기
  const closeAddModal = () => setAddModalIsOpen(false);
  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setEventDetails({
      id: null,
      title: "",
      type: "",
      startDate: "",
      endDate: "",
      description: "",
      color: "#ADD8E6",
    });
  };

  return (
    <div>
      <button onClick={openAddModal}>일정 추가</button>

      {/* 캘린더 */}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={openEditModal} // 일정 클릭 시 수정 모달 열기
      />

      {/* 일정 추가 모달 */}
      <Modal isOpen={addModalIsOpen} onRequestClose={closeAddModal}>
        <h2>일정 추가</h2>
        <label>제목</label>
        <input
          type="text"
          value={eventDetails.title}
          onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
        />
        <br />
        <label>일정 유형</label>
        <div>
          {eventTypes.map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="type"
                value={type}
                checked={eventDetails.type === type}
                onChange={(e) =>
                  setEventDetails((prev) => ({ ...prev, type: e.target.value }))
                }
              />
              {type}
            </label>
          ))}
        </div>
        <br />
        <label>시작일</label>
        <input
          type="date"
          value={eventDetails.startDate}
          onChange={(e) => setEventDetails({ ...eventDetails, startDate: e.target.value })}
        />
        <br />
        <label>종료일</label>
        <input
          type="date"
          value={eventDetails.endDate}
          onChange={(e) => setEventDetails({ ...eventDetails, endDate: e.target.value })}
        />
        <br />
        <label>설명</label>
        <textarea
          value={eventDetails.description}
          onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
        />
        <br />
        <label>색상 선택:</label>
        <div>
          {colors.map((color) => (
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
          ))}
        </div>
        <br />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSaveAddEvent}>저장</button>
        <button onClick={closeAddModal}>취소</button>
      </Modal>

      {/* 일정 수정 모달 */}
      <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal}>
        <h2>일정 수정</h2>
        <label>제목</label>
        <input
          type="text"
          value={eventDetails.title}
          onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
        />
        <br />
        <div>
          {eventTypes.map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="type"
                value={type}
                checked={eventDetails.type === type}
                onChange={(e) =>
                  setEventDetails((prev) => ({ ...prev, type: e.target.value }))
                }
              />
              {type}
            </label>
          ))}
        </div>
        <br />
        <label>시작일</label>
        <input
          type="date"
          value={eventDetails.startDate}
          onChange={(e) => setEventDetails({ ...eventDetails, startDate: e.target.value })}
        />
        <br />
        <label>종료일</label>
        <input
          type="date"
          value={eventDetails.endDate}
          onChange={(e) => setEventDetails({ ...eventDetails, endDate: e.target.value })}
        />
        <br />
        <label>설명</label>
        <textarea
          value={eventDetails.description}
          onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
        />
        <br />
        <label>색상 선택:</label>
        <div>
          {colors.map((color) => (
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
          ))}
        </div>
        <br />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSaveChanges}>저장</button>
        <button type="button" onClick={handleDeleteEvent} style={{ color: "red" }}>
          삭제
        </button>
        <button onClick={closeEditModal}>취소</button>
      </Modal>
    </div>
  );
}
