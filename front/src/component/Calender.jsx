import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";
import AddEventForm from "./AddEventForm.jsx";
import EditEventForm from "./EditEventForm.jsx";
import { getEvents } from "../api/apiService"; // API 호출
import { useUser } from "../context/UserContext"; // UserContext
import { useEvents } from "../context/eventsContext";

Modal.setAppElement("#root");

export default function Calendar() {
  const { user } = useUser();  // UserContext에서 유저 정보 가져오기
  const { events, setEvents } = useEvents();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [eventDetails, setEventDetails] = useState({
    id: null,
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    color: "#ADD8E6",
    feelsLike: "",
    lat: "",
    lon: ""
  });
  const [error, setError] = useState("");

  const calendarRef = useRef(null);

  // 일정 데이터를 가져오는 함수
  const fetchEvents = async () => {
    if (user && user.id) {  // user가 null이 아니고 user.id가 존재할 경우에만 API 호출
      try {
        const data = await getEvents(user.id);

        // 이벤트 형식이 FullCalendar에 맞도록 변환
        const formattedEvents = data.map((event) => ({
          id: event.scheIdx,
          title: event.scheTitle,
          type: event.scheType,
          start: event.startDate,
          end: event.endDate,
          description: event.scheContent || "",
          color: event.color || "#ADD8E6",
          feelsLike: event.feelsLike,
          lat: event.lat,
          lon: event.lon
        }));

        setEvents(formattedEvents);  // 변환된 이벤트 상태에 저장
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
  }, [user?.id, events]);

  // 일정 추가 모달 열기
  const openAddModal = () => {
    setIsAddMode(true);
    setEventDetails({
      id: null,
      title: "",
      type: "",
      startDate: "",
      endDate: "",
      description: "",
      color: "#ADD8E6",
      feelsLike: "",
      lat: "",
      lon: ""
    });
    setIsOpen(true);  // 모달 열기
  };

  // 일정 수정 모달 열기
  const openEditModal = (info) => {
    setIsAddMode(false);
    const eventId = info.event.id;
    const eventToEdit = events.find((event) => String(event.id) === String(eventId));

    if (eventToEdit) {
      setEventDetails({
        id: eventToEdit.id,
        title: eventToEdit.title,
        type: eventToEdit.type,
        startDate: eventToEdit.start,
        endDate: eventToEdit.end,
        description: eventToEdit.description || "",
        color: eventToEdit.color || "#ADD8E6",
        feelsLike: eventToEdit.feelsLike,
        lat: eventToEdit.lat,
        lon: eventToEdit.lon
      });
      setIsOpen(true);  // 모달 열기
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setIsOpen(false);

    if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents();  // 모달 닫을 때 이벤트 다시 로드
        calendarApi.render();  // 캘린더 강제 렌더링
    }
};

  // 일정 수정 후 이벤트 상태 업데이트
  const updateEventInCalendar = (updatedEvent) => {
    setEvents((prevEvents) =>
        prevEvents.map((event) =>
            event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
        )
    );

    // 캘린더의 refetchEvents() 및 render() 호출
    if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents();  // 변경된 이벤트를 다시 가져오도록 요청
        calendarApi.render();  // 강제로 캘린더 렌더링
    }
};

  return (
    <div>
      {/* 캘린더 표시 */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}  // events 상태에 따라 렌더링
        eventClick={openEditModal}
        locale="ko"
        dayMaxEventRows={7} // 한 칸에 최대 7개의 이벤트 표시
        dayMaxEvents={true} // true로 설정하면 "더보기" 링크 활성화
        displayEventTime={false}
        customButtons={{
          addEventButton: {
            text: "일정 추가",
            click: () => openAddModal(),
          },
        }}
        headerToolbar={{
          left: "title",
          center: "",
          right: "addEventButton today prev,next",
        }}
        dayCellContent={(arg) => {
          const currentDate = new Date(arg.date).setHours(0, 0, 0, 0); // 현재 셀의 날짜 (시간 제거)

          // 해당 날짜에 포함되는 이벤트 필터링
          const eventsForDate = events.filter((event) => {
            const eventStartDate = new Date(event.start).setHours(0, 0, 0, 0);

            // 종료 날짜를 하루 전날로 수정
            const eventEndDate = new Date(event.end).setHours(0, 0, 0, 0); // 1일(24시간)을 빼기

            // 종료일을 포함하도록 비교하면서, 일정 수 표시에서만 하루 줄이도록 함
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

      {/* AddEventForm 또는 EditEventForm을 조건부로 렌더링 */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경을 어두운 색으로
          },
          content: {
            backgroundColor: "white", // 모달 배경 색
            padding: "20px", // 내용 여백
            borderRadius: "8px", // 모달 둥근 모서리
            width: "400px", // 모달 폭
            margin: "auto", // 가운데 정렬
          },
        }}
      >
        {isAddMode ? (
          <AddEventForm
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            events={events}
            setEvents={setEvents}
            error={error}
            setError={setError}
            closeModal={closeModal}
          />
        ) : (
          <EditEventForm
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            events={events}
            setEvents={setEvents}
            error={error}
            setError={setError}
            closeModal={closeModal}
            updateEventInCalendar={updateEventInCalendar}  // 수정 후 이벤트 업데이트
          />
        )}
      </Modal>
    </div>
  );
}
