import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";

// 모달 스타일 설정
Modal.setAppElement("#root");

export default function Buttonclick() {
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    id: null,
    type: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [events, setEvents] = useState([]);

  const openAddModal = () => {
    resetEventDetails();
    setAddModalIsOpen(true);
  };

  const openEditModal = (info) => {
    const event = info.event;
    setEventDetails({
      id: event.id,
      type: event.extendedProps.type || "",
      startDate: event.startStr,
      endDate: new Date(event.end).toISOString().slice(0, 10),
      description: event.extendedProps.description || "",
    });
    setEditModalIsOpen(true);
  };

  const closeAddModal = () => setAddModalIsOpen(false);
  const closeEditModal = () => setEditModalIsOpen(false);

  const resetEventDetails = () => {
    setEventDetails({
      id: null,
      type: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 시작 날짜 검증
    if (name === "startDate") {
      const currentDate = new Date().toISOString().slice(0, 10);
      if (value < currentDate) {
        alert("시작 날짜는 오늘 날짜 이후여야 합니다.");
        setEventDetails((prev) => ({ ...prev, startDate: "" }));
        return;
      }
    }

    // 종료 날짜 검증
    if (name === "endDate") {
      if (eventDetails.startDate && value < eventDetails.startDate) {
        alert("종료 날짜는 시작 날짜 이후여야 합니다.");
        setEventDetails((prev) => ({ ...prev, endDate: "" }));
        return;
      }
    }

    setEventDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    setEventDetails((prev) => ({
      ...prev,
      type: e.target.value,
    }));
  };

  const adjustEndDate = (endDate) => {
    const adjustedDate = new Date(endDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    return adjustedDate.toISOString().slice(0, 10);
  };

  const handleSaveAddEvent = () => {
    if (!eventDetails.type) {
      alert("일정 유형을 선택하세요.");
      return;
    }

    if (!eventDetails.startDate || !eventDetails.endDate) {
      alert("시작 날짜와 종료 날짜를 모두 선택하세요.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: eventDetails.type,
      start: eventDetails.startDate,
      end: adjustEndDate(eventDetails.endDate),
      extendedProps: {
        type: eventDetails.type,
        description: eventDetails.description,
      },
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    closeAddModal();
  };

  const handleSaveEditEvent = () => {
    if (!eventDetails.type) {
      alert("일정 유형을 선택하세요.");
      return;
    }

    if (!eventDetails.startDate || !eventDetails.endDate) {
      alert("시작 날짜와 종료 날짜를 모두 선택하세요.");
      return;
    }

    const adjustedEndDate = new Date(eventDetails.endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) =>
        event.id === eventDetails.id
          ? {
              ...event,
              title: eventDetails.type,
              start: eventDetails.startDate,
              end: adjustedEndDate.toISOString().slice(0, 10),
              extendedProps: {
                ...event.extendedProps,
                description: eventDetails.description,
              },
            }
          : event
      );

      console.log("Before update:", JSON.parse(JSON.stringify(prevEvents)));
      console.log("After update:", JSON.parse(JSON.stringify(updatedEvents)));

      return updatedEvents;
    });

    closeEditModal();
  };

  return (
    <div>
      <FullCalendar
        key={events.length}
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
              <input
                type="radio"
                name="type"
                value="결혼식"
                checked={eventDetails.type === "결혼식"}
                onChange={handleTypeChange}
              />
              결혼식
              <input
                type="radio"
                name="type"
                value="데이트"
                checked={eventDetails.type === "데이트"}
                onChange={handleTypeChange}
              />
              데이트
              <input
                type="radio"
                name="type"
                value="출퇴근"
                checked={eventDetails.type === "출퇴근"}
                onChange={handleTypeChange}
              />
              출퇴근
            </div>
          </div>

          <div>
            <label>시작일자:</label>
            <input
              type="date"
              name="startDate"
              value={eventDetails.startDate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>종료일자:</label>
            <input
              type="date"
              name="endDate"
              value={eventDetails.endDate}
              onChange={handleInputChange}
              min={eventDetails.startDate}
            />
          </div>

          <button type="button" onClick={handleSaveAddEvent}>
            추가
          </button>
        </form>
      </Modal>

      {/* 일정 수정 모달 */}
      <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal} contentLabel="일정 수정">
        <h2>일정 수정</h2>
        <form>
          <div>
            <label>일정 유형:</label>
            <div>
              <input
                type="radio"
                name="type"
                value="결혼식"
                checked={eventDetails.type === "결혼식"}
                onChange={handleTypeChange}
              />
              결혼식
              <input
                type="radio"
                name="type"
                value="데이트"
                checked={eventDetails.type === "데이트"}
                onChange={handleTypeChange}
              />
              데이트
              <input
                type="radio"
                name="type"
                value="출퇴근"
                checked={eventDetails.type === "출퇴근"}
                onChange={handleTypeChange}
              />
              출퇴근
            </div>
          </div>

          <div>
            <label>시작일자:</label>
            <input
              type="date"
              name="startDate"
              value={eventDetails.startDate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>종료일자:</label>
            <input
              type="date"
              name="endDate"
              value={eventDetails.endDate}
              onChange={handleInputChange}
              min={eventDetails.startDate}
            />
          </div>

          <button type="button" onClick={handleSaveEditEvent}>
            수정 완료
          </button>
        </form>
      </Modal>
    </div>
  );
}
