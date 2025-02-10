import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";
import AddEventForm from "./AddEventForm.jsx";
import EditEventForm from "./EditEventForm.jsx";
import { getEvents, addEvent, updateEvent, deleteEvent } from "../api/apiService"; // API 호출
import { useUser } from "../context/UserContext"; // UserContext
import { useEvents } from "../context/eventsContext";
import axios from "axios"; // 코디 추천 API 호출
import CodiRecommend from "./Codirecommend"; // 코디 추천 컴포넌트 추가
import KakaoMap from "./Kakaomap"; // KakaoMap에서 장소 선택 기능 추가

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
    location: "",
    weather: "",
    temp: "",
    feelsLike: "",
    description: "",
    color: "#ADD8E6",
  });
  const [error, setError] = useState("");

  const [weatherDescription, setWeatherDescription] = useState(""); // 날씨 API의 설명만 저장
  const [recommendedCodi, setRecommendedCodi] = useState([]); // 추천 코디 상태
  const [isCodiVisible, setIsCodiVisible] = useState(false); // 코디 추천 결과 표시 여부

  const calendarRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isAddMode) {
      console.log("📌 일정 수정 모달 열림, KakaoMap 다시 로드");

      // ✅ 기존에 저장된 위치가 있으면 그대로 유지
      setEventDetails((prev) => ({
        ...prev,
        location: prev.location ?? "",  // 기존 위치 유지
        lat: prev.lat ?? null,
        lon: prev.lon ?? null
      }));
    }
  }, [isOpen]);

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
          location: event.scheLocation || "",
          lat: event.lat || null,
          lon: event.lon || null,
          weather: event.weather || "",
          temp: event.temp || "",
          feelsLike: event.feelsLike || "",
          description: event.scheContent || "",
          color: event.color || "#ADD8E6",
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
  }, [user, events]);

  // 일정 추가 모달 열기
  const openAddModal = () => {
    setIsAddMode(true);
    setEventDetails({
      id: null,
      title: "",
      type: "",
      startDate: "",
      endDate: "",
      location: "",
      weather: "",
      temp: "",
      feelsLike: "",
      description: "",
      color: "#ADD8E6",
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
        location: eventToEdit.location || "",
        weather: eventToEdit.weather || "",
        temp: eventToEdit.temp || "",
        feelsLike: eventToEdit.feelsLike || "",
        description: eventToEdit.description || "",
        color: eventToEdit.color || "#ADD8E6",
      });
      setIsOpen(true);  // 모달 열기
    }
  };

  const updateEventHandler = async () => {
    // 현재 수정된 일정 데이터 가져오기
    const updatedEvent = {
      id: eventDetails.id,
      title: eventDetails.title,
      type: eventDetails.type,
      startDate: eventDetails.startDate,
      endDate: eventDetails.endDate,
      description: eventDetails.description,
      color: eventDetails.color,
    };

    try {
      console.log("📌 업데이트할 일정 데이터:", updatedEvent);

      // ✅ DB에 일정 업데이트 요청
      await updateEvent(updatedEvent);

      // ✅ 상태 업데이트 (캘린더에 반영)
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
        )
      );

      // ✅ 캘린더 강제 업데이트
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents(); // 변경된 이벤트 다시 불러오기
        calendarApi.render();
      }

      // ✅ 모달 닫기
      closeModal();
    } catch (error) {
      console.error("❌ 일정 업데이트 오류:", error);
      alert("일정 업데이트 중 오류가 발생했습니다.");
    }
  };


  // 모달 닫기
  const closeModal = () => {
    setIsOpen(false);
    setIsCodiVisible(false); // 코디 추천 닫기

    // ✅ 이전에 선택했던 위치를 유지
    setEventDetails((prev) => ({
      ...prev,
      location: prev.location ?? "",  // 기존 값 유지
      lat: prev.lat ?? null,
      lon: prev.lon ?? null,
    }));

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.refetchEvents();  // 모달 닫을 때 이벤트 다시 로드
      calendarApi.render();  // 캘린더 강제 렌더링
    }
  };

  // 장소 선택 처리 (KakaoMap API 사용)
  const handleLocationSelect = async (location, lat, lon) => {
    console.log("📌 선택된 위치:", location, lat, lon);
    setEventDetails((prev) => ({ ...prev, location, lat, lon }));

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
        weather: data.weather?.[0]?.main || "정보 없음", // 안전한 접근 방식
        temp: data.main?.temp || "정보 없음",
        feelsLike: data.main?.feels_like || "정보 없음",
      }));

      console.log("📌 현재 날씨 데이터:", data);
    } catch (error) {
      console.error("날씨 데이터 가져오기 오류:", error);
    }
  };

  // 코디 추천 API 요청
  const fetchCodiRecommendations = async () => {
    if (!eventDetails.type || !eventDetails.weather || !eventDetails.feelsLike) {
      alert("일정 유형과 날씨 정보를 입력해야 코디 추천을 받을 수 있습니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/auth", {
        type: eventDetails.type,
        feelsLike: eventDetails.feelsLike,
        weather: eventDetails.weather,
      });

      if (!response.data || response.data.length === 0) {
        alert("추천된 코디가 없습니다.");
        setIsCodiVisible(false);
        return;
      }

      setRecommendedCodi(response.data);
      setIsCodiVisible(true);
    } catch (error) {
      console.error("코디 추천 오류:", error);
      alert("코디 추천을 불러오는 중 오류가 발생했습니다.");
      setIsCodiVisible(false);
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
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경을 어두운 색으로
        },
        content: {
          backgroundColor: "white", // 모달 배경 색
          padding: "20px", // 내부 여백
          borderRadius: "8px", // 모서리 둥글게
          width: "1000px", // 모달 전체 너비 (좌우 배치 고려)
          height: "850px", // 모달 높이 조정
          margin: "auto", // 가운데 정렬
          display: "flex", // 좌우 컬럼 배치
          flexDirection: "row", // 가로 정렬
          gap: "20px", // 두 컬럼 사이 여백
        },
      }}>
        {/* 왼쪽 컬럼: 일정 수정 폼 */}
        <div style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // ✅ 세로 중앙 정렬
          alignItems: "center", // ✅ 가로 중앙 정렬 (선택적)
          borderRight: "1px solid #ddd",
          paddingRight: "20px",
        }}>

          {/* ✅ 추가된 '일정 수정' 제목 */}
          <h2 style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginRight: "280px",
            marginBottom: "20px", // 제목 아래 여백 추가
          }}>
            일정 수정
          </h2>

          {isAddMode ? (
            <AddEventForm eventDetails={eventDetails} setEventDetails={setEventDetails} closeModal={() => setIsOpen(false)} />
          ) : (

            <EditEventForm
              eventDetails={eventDetails}
              setEventDetails={setEventDetails}
              events={events} // ✅ 기존 이벤트 배열 전달
              setEvents={setEvents} // ✅ 이벤트 상태 업데이트 함수 전달
              closeModal={() => setIsOpen(false)}
              updateEventInCalendar={updateEventHandler} // 수정된 일정 반영
            />
          )}
        </div>
        {/* 오른쪽 컬럼: 장소 선택, 날씨 정보, 코디 추천 */}
        {!isAddMode && (
          <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* KakaoMap 위치 선택 */}
            <div>
              <h3>📍 장소 선택</h3>
              <KakaoMap onSelectLocation={handleLocationSelect} />
            </div>

            {/* 날씨 정보 */}
            <div>
              <h3>🌤 날씨 정보</h3>
              {eventDetails.weather ? (
                <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "8px" }}>
                  <p><strong>날씨:</strong> {eventDetails.weather}</p>
                  <p><strong>기온:</strong> {eventDetails.temp}°C</p>
                  <p><strong>체감 온도:</strong> {eventDetails.feelsLike}°C</p>
                  {/* <p><strong>설명:</strong> {weatherDescription}</p> */}
                </div>
              ) : (
                <p>날씨 정보를 불러오는 중...</p>
              )}
            </div>

            {/* 코디 추천 버튼 */}
            <div>
              <button
                onClick={fetchCodiRecommendations}
                style={{
                  padding: "10px",
                  backgroundColor: "#ff5722",
                  color: "white",
                  borderRadius: "5px",
                  width: "100%",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                코디 추천 받기
              </button>
            </div>

            {/* 추천된 코디 표시 */}
            {isCodiVisible && <CodiRecommend recommendedCodi={recommendedCodi} />}
          </div>
        )}
      </Modal>
    </div>
  );
}
