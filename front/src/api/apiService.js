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

// KakaoMap에서 좌표를 주소로 변환하는 함수
export const getAddressFromCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json`, {
      params: { x: lon, y: lat },
      headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}` },
    });

    if (response.data.documents.length > 0) {
      return response.data.documents[0].address.address_name;
    } else {
      return "주소 정보를 찾을 수 없습니다.";
    }
  } catch (error) {
    console.error("카카오 API 주소 변환 오류:", error);
    return "주소 정보를 불러올 수 없습니다.";
  }
};

// OpenWeather API를 통해 날씨 정보 가져오기
export const getWeatherData = async (lat, lon) => {
  try {
    const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (response.data) {
      return {
        weather: response.data.weather[0].main,
        temp: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
      };
    }
  } catch (error) {
    console.error("날씨 데이터 가져오기 오류:", error);
    return null;
  }
};

// 코디 추천 API 호출
export const fetchCodiRecommendations = async (type, feelsLike, weather) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth`, {
      type,
      feelsLike,
      weather,
    });

    if (!response.data || response.data.length === 0) {
      console.warn("⚠️ 추천된 코디가 없습니다.");
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("코디 추천 오류:", error);
    return [];
  }
};