import { API_URL } from '../config/config';
import axios from "axios";

// 일정 가져오기
export const getEvents = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/schedules/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error("일정 정보를 가져오는 데 실패했습니다.");
  }
};

// 일정 추가
export const addEvent = async (eventDetails) => {
  try {
    const addEvent = {
      scheTitle: eventDetails.title,
      scheType: eventDetails.type,
      startDate: eventDetails.startDate,
      endDate: eventDetails.endDate,
      scheContent: eventDetails.description,
      color: eventDetails.color,
      feelsLike: eventDetails.feelsLike,
      lat: eventDetails.lat,
      lon: eventDetails.lon
    };
    const response = await axios.post(`${API_URL}/api/schedules/add`, addEvent, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("일정을 추가하는 데 실패했습니다.");
  }
};

// 일정 수정
export const updateEvent = async (eventDetails) => {
  try {
    const updateEvent = {
      scheIdx: eventDetails.id,
      scheTitle: eventDetails.title,
      scheType: eventDetails.type,
      startDate: eventDetails.startDate,
      endDate: eventDetails.endDate,
      scheContent: eventDetails.description,
      color: eventDetails.color,
      feelsLike: eventDetails.feelsLike,
      lat: eventDetails.lat,
      lon: eventDetails.lon
    };
    const response = await axios.put(`${API_URL}/api/schedules/update`, updateEvent, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("일정을 수정하는 데 실패했습니다.");
  }
};

// 일정 삭제
export const deleteEvent = async (eventId) => {
  try {
    await axios.delete(`${API_URL}/api/schedules/${eventId}`, { withCredentials: true });
  } catch (error) {
    throw new Error("일정을 삭제하는 데 실패했습니다.");
  }
};
