import React, { useEffect, useState } from "react";
import "../css/styles.css";
import Calendar from "./Calender";
import axios from "axios";

const Header = () => {
  const [location, setLocation] = useState("서울"); // 기본 위치: 서울
  const [weatherData, setWeatherData] = useState({
    description: "", // 날씨 설명
    temp: "", // 실제 온도
    feelsLike: "", // 체감 온도
  });

  const translateDescription = (description) => {
    const translations = {
      "clear sky": "맑음",
      "few clouds": "구름 조금",
      "scattered clouds": "흩어진 구름",
      "broken clouds": "구름 많음",
      "overcast clouds": "흐림",
      "light rain": "약한 비",
      "moderate rain": "보통 비",
      "heavy intensity rain": "강한 비",
      "light snow": "약한 눈",
      "snow": "눈",
      "heavy snow": "강한 눈",
      "thunderstorm": "천둥번개",
      "mist": "안개",
      "haze": "연무",
      "smoke": "스모그",
    };
    return translations[description] || description;
  };

  useEffect(() => {
    // 사용자 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
          fetchLocationName(latitude, longitude);
        },
        () => {
          // 위치 권한 거부 시 서울로 기본 설정
          fetchWeatherData(37.5665, 126.9780);
          setLocation("서울");
        }
      );
    } else {
      // 브라우저에서 위치 정보를 지원하지 않는 경우
      fetchWeatherData(37.5665, 126.9780);
      setLocation("서울");
    }
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=7f73dbaec9d25feec1469628225d26eb&units=metric`
      );
      const { description } = response.data.weather[0];
      const { temp, feels_like } = response.data.main;
      setWeatherData({
        description: translateDescription(description),
        temp: `${Math.round(temp)}°C`,
        feelsLike: `${Math.round(feels_like)}°C`,
      });
    } catch (error) {
      console.error("날씨 데이터를 가져오는 데 실패했습니다.", error);
    }
  };

  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
        {
          headers: { Authorization: `KakaoAK 0740abf08a218ffa3bf2f92aac526f1e` },
        }
      );
      const address = response.data.documents[0]?.address;
      const formattedLocation = `${address?.region_1depth_name} ${address?.region_2depth_name}` || "서울"; // 시, 구만 표시
      setLocation(formattedLocation);
    } catch (error) {
      console.error("위치 정보를 가져오는 데 실패했습니다.", error);
    }
  };

  return (
    <header>
      <div className="nav">
        <a href="#">Calendar</a>
        <a href="#">My Profile</a>
        <span>{location}</span> {/* 현재 위치 */}
      </div>
      <div className="weather">
        날씨: {weatherData.description || "정보 없음"} 온도: {weatherData.temp || "N/A"} 체감 온도: {weatherData.feelsLike || "N/A"}
      </div>
    </header>
  );
};

export default Header;
