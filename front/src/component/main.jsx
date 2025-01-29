import React, { useState, useEffect } from "react";
import Header from "./Header";
import Slider from "./Slider";
import EventSection from "./EventSection";
import Calandar from "./Calander";
import '../css/styles.css';
import axios from 'axios';

const Main = ({ user }) => {
  const [events, setEvents] = useState([]); // 일정 정보

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents)); // 로컬스토리지에서 일정을 불러오기
    }
  }, []);

  // 일정 정보 가져오기
  useEffect(() => {
    if (!user) return; // 유저 정보가 없으면 API 호출 안함

    // 로컬 스토리지에서 일정 데이터 불러오기
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents)); // 로컬 스토리지에서 일정을 불러옴
    }

    // 서버에서 일정 데이터 가져오기
    axios.get(`/api/schedules/${user.id}`, { withCredentials: true })
      .then((response) => {
        if (Array.isArray(response.data)) {
          const calendarEvents = response.data.map((event) => {
            let endDate = new Date(event.endDate);
            const startDate = new Date(event.startDate);

            if (startDate.getTime() !== endDate.getTime()) {
              endDate.setDate(endDate.getDate() + 1); // 종료일에 하루를 추가
            }

            return {
              id: event.scheIdx,
              title: event.scheTitle,
              type: event.scheType,
              start: event.startDate,
              end: endDate.toISOString().split("T")[0], // ISO 형식으로 종료일 처리
              originalEndDate: event.endDate, // 원본 종료일 추가
              color: event.color || "#ADD8E6",
              description: event.scheContent || "",
            };
          });
          setEvents(calendarEvents); // 서버에서 받은 일정 데이터로 상태 업데이트
          localStorage.setItem("events", JSON.stringify(calendarEvents)); // 로컬 스토리지에 저장
        }
      })
      .catch((error) => {
        console.error("일정 정보를 가져오는 데 실패했습니다.", error);
      });
  }, [user]);

  return (
    <div className="app-container">
      <div className="left-side">
        <Slider />
      </div>
      <div className="right-side">
        <Header />
        <EventSection user={user} events={events} setEvents={setEvents} />
        <Calandar user={user} events={events} setEvents={setEvents} />
      </div>
    </div>
  );
};

export default Main;
