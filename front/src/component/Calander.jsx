import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';  // FullCalendar에서 그리드 레이아웃을 위한 플러그인 임포트
import Modal from 'react-modal';  // 모달 라이브러리 임포트

// 모달 스타일 설정 (root div 설정)
Modal.setAppElement('#root');

export default function Buttonclick() {
  // 모달의 열고 닫힘 상태를 관리하는 상태값
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    id: null,  // 일정 고유 ID (수정 시 사용)
    title: '',  // 일정명
    startDate: '',  // 시작 날짜
    endDate: '',  // 종료 날짜
    description: '',  // 일정 내용
    image: null,  // 업로드된 이미지
  });
  const [events, setEvents] = useState([]);  // 캘린더에 표시할 이벤트 목록 상태

  // 모달을 열 때 호출되는 함수
  const openModal = () => setModalIsOpen(true);
  // 모달을 닫을 때 호출되는 함수
  const closeModal = () => setModalIsOpen(false);

  // 입력 값 변경 시 이벤트 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 이미지 파일 업로드 처리 함수
  const handleImageChange = (e) => {
    setEventDetails((prev) => ({
      ...prev,
      image: e.target.files[0],  // 업로드된 첫 번째 파일만 처리
    }));
  };

  // 일정 저장 함수 (새로운 일정 추가 또는 기존 일정 수정)
  const handleSaveEvent = () => {
    if (eventDetails.id) {
      // 이미 존재하는 이벤트라면 수정
      setEvents(events.map(event =>
        event.id === eventDetails.id
          ? { ...event, ...eventDetails }  // 기존 이벤트 수정
          : event
      ));
    } else {
      // 새로운 이벤트 추가
      setEvents([
        ...events,
        {
          id: Date.now(),  // 고유 ID 생성 (현재 시간 기반)
          title: eventDetails.title,
          start: eventDetails.startDate,
          end: eventDetails.endDate,
          description: eventDetails.description,
          extendedProps: { image: eventDetails.image },  // 이미지 파일 추가
        }
      ]);
    }
    closeModal();  // 일정 저장 후 모달 닫기
  };

  // 일정 클릭 시 해당 이벤트의 세부 정보가 모달에 로드되는 함수
  const handleEventClick = (info) => {
    const event = info.event;
    setEventDetails({
      id: event.id,
      title: event.title,
      startDate: event.start.toISOString().slice(0, 10),  // 날짜 형식을 yyyy-mm-dd로 변환
      endDate: event.end.toISOString().slice(0, 10),
      description: event.extendedProps.description || '',
      image: event.extendedProps.image || null,
    });
    openModal();  // 모달 열기
  };

  return (
    <div>
      {/* FullCalendar 컴포넌트 */}
      <FullCalendar
        plugins={[dayGridPlugin]}  // dayGridPlugin을 플러그인으로 사용
        initialView="dayGridMonth"  // 초기 캘린더 뷰 설정
        events={events}  // 캘린더에 표시할 이벤트들
        eventClick={handleEventClick}  // 일정 클릭 시 수정 모달 열기
        customButtons={{
          addEventButton: {
            text: '일정 추가',  // 일정 추가 버튼 텍스트
            click: openModal,  // 버튼 클릭 시 모달 열기
          },
        }}
        headerToolbar={{
          start: 'dayGridMonth,timeGridWeek,timeGridDay',  // 왼쪽 툴바 설정 (달력 보기 옵션)
          center: 'title',  // 가운데는 캘린더 제목
          end: 'addEventButton today prev,next',  // 오른쪽 툴바 설정 (일정 추가, 이전, 다음 버튼)
        }}
      />

      {/* 일정 추가/수정 모달 창 */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="일정 추가">
        <h2>{eventDetails.id ? '일정 수정' : '일정 추가'}</h2>
        <form>
          {/* 일정명 입력 */}
          <div>
            <label>일정명:</label>
            <input
              type="text"
              name="title"
              value={eventDetails.title}
              onChange={handleInputChange}  // 일정명 변경 시 상태 업데이트
              placeholder="일정명을 입력하세요"
            />
          </div>
          
          {/* 시작일자 입력 */}
          <div>
            <label>시작일자:</label>
            <input
              type="date"
              name="startDate"
              value={eventDetails.startDate}
              onChange={handleInputChange}  // 시작일자 변경 시 상태 업데이트
            />
          </div>
          
          {/* 종료일자 입력 */}
          <div>
            <label>종료일자:</label>
            <input
              type="date"
              name="endDate"
              value={eventDetails.endDate}
              onChange={handleInputChange}  // 종료일자 변경 시 상태 업데이트
            />
          </div>

          {/* 일정 내용 입력 */}
          <div>
            <label>일정 내용:</label>
            <textarea
              name="description"
              value={eventDetails.description}
              onChange={handleInputChange}  // 일정 내용 변경 시 상태 업데이트
              placeholder="일정 내용을 입력하세요"
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label>이미지 업로드:</label>
            <input type="file" onChange={handleImageChange} />  {/* 이미지 선택 시 상태 업데이트 */}
          </div>

          {/* 저장 및 취소 버튼 */}
          <div>
            <button type="button" onClick={handleSaveEvent}>일정 {eventDetails.id ? '수정' : '등록'}</button>
            <button type="button" onClick={closeModal}>취소</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
