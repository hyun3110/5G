import React, { useEffect, useState } from "react";
import '../css/header.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = ({ user, setUser }) => {
  const [location, setLocation] = useState("서울"); // 기본 위치: 서울
  const navigate = useNavigate();
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
      snow: "눈",
      "heavy snow": "강한 눈",
      thunderstorm: "천둥번개",
      mist: "안개",
      haze: "연무",
      smoke: "스모그",
    };
    return translations[description] || description;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
          fetchLocationName(latitude, longitude);
        },
        () => {
          fetchWeatherData(37.5665, 126.978); // 서울 좌표
          setLocation("서울");
        }
      );
    } else {
      fetchWeatherData(37.5665, 126.978); // 서울 좌표
      setLocation("서울");
    }
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {

      const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY; // 환경 변수에서 API 키 불러오기

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
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
          headers: {
            Authorization: `KakaoAK 0740abf08a218ffa3bf2f92aac526f1e`,
          },
        }
      );
      const address = response.data.documents[0]?.address;
      const formattedLocation =
        `${address?.region_1depth_name} ${address?.region_2depth_name}` ||
        "서울";
      setLocation(formattedLocation);
    } catch (error) {
      console.error("위치 정보를 가져오는 데 실패했습니다.", error);
    }
  };

  // 프로필 아이콘 클릭 시 동작
  const handleProfileClick = () => {
    if (user) {
      navigate("/mypage"); // 로그인 상태라면 마이페이지로 이동
    } else {
      navigate("/login"); // 로그인 상태가 아니라면 로그인 페이지로 이동
    }
  };

  const logout = async () => {
    try {
      // 로그아웃 API 호출 (세션 무효화)
      const response = await axios.post(
        "http://localhost:8081/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        // 로그아웃 성공 후 클라이언트에서 세션 데이터 제거
        sessionStorage.removeItem("user"); // sessionStorage에서 유저 정보 삭제
        localStorage.removeItem("events");
        setUser(null); // 유저 상태 초기화
        navigate("/");
      }
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  return (
    <header>
      <div className="header-container">
        {/* 로고 */}
        <div className="header-logo">
          <a href="/">
            <img src="/img/logo.png" alt="DLC Logo" />
          </a>
        </div>

        {/* 내비게이션 */}
        <nav className="header-nav">
          <a href="/">
            <img src="/img/calendar.png" alt="Calendar" />
            Calendars
          </a>

          <span>
            <img src="/img/location.png" alt="Location" />
            {location}
          </span>
          <div className="weather-info">
            <div className="weather-detail">
              <span className="label">날씨:</span>
              <span className="value">
                {weatherData.description || "정보 없음"}
              </span>
            </div>
            <div className="weather-detail">
              <span className="label">온도:</span>
              <span className="value">{weatherData.temp || "N/A"}</span>
            </div>
            <div className="weather-detail">
              <span className="label">체감 온도:</span>
              <span className="value">{weatherData.feelsLike || "N/A"}</span>
            </div>
          </div>
        </nav>

        {/* 알림 및 프로필 */}
        <div
          className="header-mypage"
          onClick={handleProfileClick} // 로그인 상태에 따라 페이지 이동
          style={{ cursor: "pointer" }}
        >
          마이페이지
        </div>
        <div>
          {user ? (
            <>
              <span>{`${user.name}님`}</span>
              <button onClick={logout}>로그아웃</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>로그인</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
