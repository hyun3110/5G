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
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    color: "#ADD8E6", // 기본 색상 (연한 파란색)
  });

  const colors = ["#FFB6C1", "#FFD700", "#90EE90", "#87CEFA", "#FFA07A", "#9370DB", "#FF6347"];

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
            const calendarEvents = response.data.map((event) => ({
              id: event.scheId,
              title: event.scheTitle,
              start: event.startDate,
              end: event.endDate,
              backgroundColor: event.color || "#ADD8E6",
              extendedProps: {
                type: event.type || "",
                description: event.scheContent || "",
                cordiimg: event.cordiimg || null, // 코디 이미지
              },
            }));
            setEvents(calendarEvents);
          }
        })
        .catch((error) => {
          console.error("일정 정보를 가져오는 데 실패했습니다.", error);
        });
    }
  }, [user]);

  // 일정 추가 모달 열기
  const openAddModal = () => {
    setEventDetails({
      id: null,
      type: "",
      startDate: "",
      endDate: "",
      description: "",
      color: "#ADD8E6",
    });
    setAddModalIsOpen(true);
  };

  // 일정 수정 모달 열기
  const openEditModal = (info) => {
    const event = info.event;
    setEventDetails({
      id: event.id,
      type: event.extendedProps.type || "",
      startDate: event.startStr,
      endDate: new Date(event.end).toISOString().slice(0, 10),
      description: event.extendedProps.description || "",
      color: event.backgroundColor || "#ADD8E6",
    });
    setEditModalIsOpen(true);
  };

  // 모달 닫기
  const closeAddModal = () => setAddModalIsOpen(false);
  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setEventDetails({
      id: null,
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
        eventClick={openEditModal}
        customButtons={{
          addEventButton: {
            text: "일정 추가",
            click: openAddModal,
          },
        }}
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "title",
          end: "addEventButton today prev,next",
        }}
      />

      {/* 일정 추가 모달 */}
      <Modal isOpen={addModalIsOpen} onRequestClose={closeAddModal} contentLabel="일정 추가">
        <h2>일정 추가</h2>
        <form>
          <div>
            <label>일정 유형:</label>
            <div>
              {["결혼식", "출퇴근", "데이트"].map((type) => (
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
          </div>
          <div>
            <label>시작일자:</label>
            <input
              type="date"
              name="startDate"
              value={eventDetails.startDate}
              onChange={(e) =>
                setEventDetails((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>
          <div>
            <label>종료일자:</label>
            <input
              type="date"
              name="endDate"
              value={eventDetails.endDate}
              onChange={(e) =>
                setEventDetails((prev) => ({ ...prev, endDate: e.target.value }))
              }
              min={eventDetails.startDate}
            />
          </div>
          <div>
            <label>일정 내용:</label>
            <textarea
              name="description"
              value={eventDetails.description}
              onChange={(e) =>
                setEventDetails((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="일정 내용을 입력하세요"
            />
          </div>
          <div>
            <label>색상 선택:</label>
            <div>
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  style={{ backgroundColor: color, border: "none", margin: "0 5px", cursor: "pointer" }}
                  onClick={() =>
                    setEventDetails((prev) => ({ ...prev, color: color }))
                  }
                >
                  {color === eventDetails.color ? "✔" : " "}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => console.log("일정 추가")}>추가</button>
          <button type="button" onClick={closeAddModal}>취소</button>
        </form>
      </Modal>
    </div>
  );
}
