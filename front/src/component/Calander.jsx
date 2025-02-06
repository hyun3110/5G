import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";
import axios from "axios";
import "../css/styles.css";

// 모달 스타일 설정
Modal.setAppElement("#root");

export default function Buttonclick({ user, events, setEvents }) {
  const [addModalIsOpen, setAddModalIsOpen] = useState(false); // 일정 추가 모달 상태
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); // 일정 수정 모달 상태
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
  const colors = [
    "#FFB6C1",
    "#FFD700",
    "#90EE90",
    "#87CEFA",
    "#FFA07A",
    "#9370DB",
    "#FF6347",
  ];

  // 일정 유형 옵션
  const eventTypes = ["결혼식", "출퇴근", "데이트"];

  // 새로고침 시 로컬 스토리지에서 일정 불러오기
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents)); // 로컬 스토리지에서 일정을 불러와 상태에 설정
    }
  }, []);

  useEffect(() => {
    // events 상태가 바뀔 때마다 로컬스토리지에 저장
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]); // events 상태가 변할 때마다 실행

  // 필수 입력값 체크 함수
  const validateForm = () => {
    if (
      !eventDetails.title ||
      !eventDetails.type ||
      !eventDetails.startDate ||
      !eventDetails.endDate
    ) {
      setError("모든 내용을 입력해주세요.");
      return false;
    }
    setError(""); // 에러 메시지 초기화
    return true;
  };

  const validateEventForm = () => {
    const errors = [];

    if (!eventDetails.title) errors.push("제목");
    if (!eventDetails.type) errors.push("일정 유형");
    if (!eventDetails.startDate) errors.push("시작일");
    if (!eventDetails.endDate) errors.push("종료일");

    if (errors.length > 0) {
      setError(`${errors.join(", ")}을(를) 입력해주세요.`);
      return false;
    }

    setError(""); // 에러 메시지 초기화
    return true;
  };

  // 수정된 호출 부분
  const handleSaveAddEvent = () => {
    if (!validateEventForm()) {
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
        let adjustedEndDate = newEvent.endDate;
        if (newEvent.startDate !== newEvent.endDate) {
          const endDate = new Date(newEvent.endDate);
          endDate.setDate(endDate.getDate() + 1); // 종료일에 하루 더하기
          adjustedEndDate = endDate.toISOString().split("T")[0]; // ISO 형식으로 다시 변환
        }

        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: newEvent.scheIdx,
            title: newEvent.scheTitle,
            type: newEvent.scheType,
            start: newEvent.startDate,
            end: adjustedEndDate,
            color: newEvent.color || "#ADD8E6",
            description: newEvent.scheContent || "",
            originalEndDate: newEvent.endDate,
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
        if (
          updatedEventFromServer.startDate !== updatedEventFromServer.endDate
        ) {
          const endDate = new Date(updatedEventFromServer.endDate);
          endDate.setDate(endDate.getDate() + 1); // 종료일에 하루 더하기
          adjustedEndDate = endDate.toISOString().split("T")[0]; // ISO 형식으로 다시 변환
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
        localStorage.setItem("events", JSON.stringify(events)); // 로컬스토리지에 수정된 데이터 저장
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
          localStorage.setItem("events", JSON.stringify(events)); // 로컬스토리지에 수정된 데이터 저장
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
    const eventToEdit = events.find(
      (event) => String(event.id) === String(eventId)
    ); // ID를 String으로 변환하여 비교

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
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={openEditModal} // 일정 클릭 시 수정 모달 열기
        locale="ko"
        dayMaxEventRows={7} // 한 칸에 최대 7개의 이벤트 표시
        dayMaxEvents={true} // true로 설정하면 "더보기" 링크 활성화
        customButtons={{
          addEventButton: {
            text: "일정 추가",
            click: () => openAddModal(), // 일정 추가 버튼 클릭 시 실행될 함수
          },
        }}
        headerToolbar={{
          left: "title", // 버튼 배치 순서 정의
          center: "",
          right: "addEventButton today prev,next", // 버튼 그룹을 오른쪽 끝에 배치
        }}
        dayCellContent={(arg) => {
          const currentDate = new Date(arg.date).setHours(0, 0, 0, 0); // 현재 셀의 날짜 (시간 제거)

          // 해당 날짜에 포함되는 이벤트 필터링
          const eventsForDate = events.filter((event) => {
            const eventStartDate = new Date(event.start).setHours(0, 0, 0, 0);
            const eventEndDate = new Date(
              event.originalEndDate || event.end
            ).setHours(0, 0, 0, 0);

            // 종료일도 포함하여 비교
            return currentDate >= eventStartDate && currentDate <= eventEndDate;
          });

          const eventCount = eventsForDate.length; // 해당 날짜의 이벤트 수 계산

          return (
            <div style={{ position: "relative", padding: "5px" }}>
              {/* 날짜 */}
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                {arg.date.getDate()}
              </div>
              {/* 일정 수 표시 */}
              {eventCount > 0 && (
                <div
                  className="event-count-badge"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#ff5722",
                    color: "white",
                    fontSize: "10px",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontWeight: "bold",
                    zIndex: 10,
                  }}
                >
                  일정 수: {eventCount}
                </div>
              )}
            </div>
          );
        }}
      />
      {/* 일정 추가 모달 */}
      <Modal isOpen={addModalIsOpen} onRequestClose={closeAddModal}>
        <button className="calander-xclose-button" onClick={closeAddModal}>
          X
        </button>
        <h2>일정 추가</h2>
        {error && (
          <p className="error" style={{ color: "red" }}>
            {error}
          </p>
        )}
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
          {eventTypes.map((type) => (
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
          onChange={(e) =>
            setEventDetails({ ...eventDetails, startDate: e.target.value })
          }
        />
        <br />
        <label>종료일</label>
        <input
          type="date"
          value={eventDetails.endDate}
          onChange={(e) =>
            setEventDetails({ ...eventDetails, endDate: e.target.value })
          }
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
        <div className="button-wrapper">
          <button
            type="button"
            className="add-save-button"
            onClick={handleSaveAddEvent}
          >
            저장
          </button>
          <button className="add-cancel-button" onClick={closeAddModal}>
            취소
          </button>
        </div>
      </Modal>


      ;{/* 일정 수정 모달 */}
<Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal}>
  <button className="calander-xclose-button" onClick={closeEditModal}>
    X
  </button>
  <h2>일정 수정</h2>
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
    {eventTypes.map((type) => (
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
    onChange={(e) =>
      setEventDetails({ ...eventDetails, startDate: e.target.value })
    }
  />
  <br />
  <label>종료일</label>
  <input
    type="date"
    value={eventDetails.endDate}
    onChange={(e) =>
      setEventDetails({ ...eventDetails, endDate: e.target.value })
    }
  />
  <br />
  <label>내용</label>
  <textarea
    value={eventDetails.description}
    onChange={(e) =>
      setEventDetails({ ...eventDetails, description: e.target.value })
    }
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
  <div className="button-container">
    <div className="top-buttons">
      <button className="edit-button" onClick={handleSaveChanges}>
        수정
      </button>
      <button
        className="delete-button"
        type="button"
        onClick={handleDeleteEvent}
      >
        삭제
      </button>
    </div>
    <button className="cancel-button" onClick={closeEditModal}>
      취소
    </button>
  </div>
</Modal>
</div>
  );
}
