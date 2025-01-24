import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Modal from 'react-modal';
import axios from 'axios';

// 모달 스타일 설정 (root div 설정)
Modal.setAppElement('#root');

export default function Buttonclick() {

  const [user, setUser] = useState(null); // 유저 정보
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [events, setEvents] = useState([]); // 일정을 저장하는 상태
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const [eventDetails, setEventDetails] = useState({
    id: '',
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    image: null,
  });

  useEffect(() => { // 세션에서 유저정보 가져오기

    axios.get('http://localhost:8081/api/auth/userinfo', { withCredentials: true })
      .then(response => {
        setUser(response.data);  // 서버에서 반환한 유저 정보
      })
      .catch(error => {
        console.error('서버에서 회원정보 가져오기 실패', error);
      });
  }, []);

  useEffect(() => { // 유저 정보로 일정 정보 가져오기

    if (user) {
      axios.get(`http://localhost:8081/api/schedules/${user.id}`, { withCredentials: true })
        .then(response => {
          console.log(response.data);  // 응답 데이터 확인

          // 서버에서 반환된 데이터가 배열인지 확인하고 처리
          if (Array.isArray(response.data)) {
            const calendarEvents = response.data.map(event => ({
              id: event.scheId,                // 일정 ID
              title: event.scheTitle,          // 일정 제목
              start: event.startDate,      // 시작 날짜
              end: event.endDate,          // 종료 날짜
              description: event.scheContent || '',  // 설명 (옵션)
            }));
            setEvents(calendarEvents); // 여러 일정이 배열로 반환된 경우
          } else {
            // 하나의 일정만 반환된 경우, 배열로 감싸서 처리
            const singleEvent = [{
              id: response.data.scheId,
              title: response.data.scheTitle,
              start: response.data.startDate,
              end: response.data.endDate,
              description: response.data.scheContent || '',
            }];
            setEvents(singleEvent);
          }
        })
        .catch(error => {
          console.error('일정 정보를 가져오는 데 실패했습니다.', error);
        });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'startDate') {
      const currentDate = new Date().toISOString().slice(0, 10);
      if (value < currentDate) {
        alert('시작 날짜는 현재 날짜 이후여야 합니다.');
        setEventDetails((prev) => ({
          ...prev,
          startDate: '',
        }));
        return;
      }
    }

    if (name === 'endDate') {
      if (eventDetails.startDate && value < eventDetails.startDate) {
        alert('종료 날짜는 시작 날짜 이후여야 합니다.');
        setEventDetails((prev) => ({
          ...prev,
          endDate: '',
        }));
        return;
      }
    }

    setEventDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setEventDetails((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSaveEvent = () => {
    const adjustedEndDate = new Date(eventDetails.endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

    // 서버로 일정 추가 요청 보내기
    const newEvent = {
      scheTitle: eventDetails.title,
      startDate: eventDetails.startDate,
      endDate: adjustedEndDate.toISOString().slice(0, 10),
      scheContent: eventDetails.description,
    };

    axios.post('http://localhost:8081/api/schedules/add', newEvent, { withCredentials: true })
    .then(response => {
      if (response.status === 200) {
        setEvents(prevEvents => [...prevEvents, response.data]); // 캘린더에 추가된 일정 반영
        closeModal();
      }
    })
    .catch(error => {
      console.error('일정 추가 실패:', error);
    });
  };

  const handleEventClick = (info) => {
    const event = info.event;
    setEventDetails({
      id: event.id,
      title: event.title,
      startDate: event.start.toISOString().slice(0, 10),
      endDate: new Date(event.end).toISOString().slice(0, 10),
      description: event.extendedProps.description || '',
      image: event.extendedProps.image || null,
    });
    openModal();
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        customButtons={{
          addEventButton: {
            text: '일정 추가',
            click: openModal,
          },
        }}
        headerToolbar={{
          start: 'dayGridMonth,timeGridWeek,timeGridDay',
          center: 'title',
          end: 'addEventButton today prev,next',
        }}
      />

      {/* 일정 추가/수정 모달 */}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              placeholder="시작 날짜를 선택하세요"
            />
          </div>

          {/* 종료일자 입력 */}
          <div>
            <label>종료일자:</label>
            <input
              type="date"
              name="endDate"
              value={eventDetails.endDate}
              min={eventDetails.startDate || new Date().toISOString().slice(0, 10)}
              onChange={handleInputChange}
              placeholder="종료 날짜를 선택하세요"
              disabled={!eventDetails.startDate}
            />
          </div>

          {/* 일정 내용 입력 */}
          <div>
            <label>일정 내용:</label>
            <textarea
              name="description"
              value={eventDetails.description}
              onChange={handleInputChange}
              placeholder="일정 내용을 입력하세요"
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label>이미지 업로드:</label>
            <input type="file" onChange={handleImageChange} />
          </div>

          {/* 버튼 컨테이너 */}
          <div className="button-container">
            <button type="button" onClick={handleSaveEvent}>
              일정 {eventDetails.id ? '수정' : '등록'}
            </button>
            <button type="button" onClick={closeModal}>
              취소
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
