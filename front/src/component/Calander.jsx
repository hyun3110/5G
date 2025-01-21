import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Modal from 'react-modal';

// 모달 스타일 설정 (root div 설정)
Modal.setAppElement('#root');

export default function Buttonclick() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    id: null,
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    image: null,
  });
  const [events, setEvents] = useState([]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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

    if (eventDetails.id) {
      setEvents(events.map((event) =>
        event.id === eventDetails.id
          ? { ...event, ...eventDetails, end: adjustedEndDate.toISOString().slice(0, 10) }
          : event
      ));
    } else {
      setEvents([
        ...events,
        {
          id: Date.now(),
          title: eventDetails.title,
          start: eventDetails.startDate,
          end: adjustedEndDate.toISOString().slice(0, 10),
          description: eventDetails.description,
          extendedProps: { image: eventDetails.image },
        },
      ]);
    }
    closeModal();
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
