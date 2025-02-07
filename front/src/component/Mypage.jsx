import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Mypagestyle.css';
import RecommendedStyles from './Recommended';
import Favorites from './Favorites';
import CodiRecommend from './Codirecommend';
import KakaoMap from './Kakaomap'; // KakaoMap 컴포넌트 import
import { useUser } from "../context/UserContext";
import "../css/modal.css";
import axios from 'axios';

const MyPage = () => {
  const [profileImage, setProfileImage] = useState('/path/to/default-profile.png'); // 프로필 이미지 상태
  const [activeContent, setActiveContent] = useState('추천 받은 스타일'); // 현재 활성화된 콘텐츠 상태
  const [favorites, setFavorites] = useState([]); // 즐겨찾기한 스타일 리스트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 활성화 상태
  const { user } = useUser();  // user 정보 가져오기
  const [isCodiVisible, setIsCodiVisible] = useState(false); // 코디 추천 결과 표시 여부
  const [recommendedCodi, setRecommendedCodi] = useState([]); // 추천된 코디 데이터 상태
  const [schedule, setSchedule] = useState({
    name: '', // 일정명
    type: '', // 일정 유형 (결혼식, 데이트, 출퇴근 등)
    location: '', // 일정 장소
    date: '', // 일정 날짜
    weather: '', // 날씨 상태
    description: '', // 상세한 날씨 설명
    temp: '', // 기온
    feelsLike: '', // 체감 온도
  });

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // 페이지 로드 시 배경색을 설정
  useEffect(() => {
    document.body.style.backgroundColor = 'white'; // 배경색을 흰색으로 설정
    return () => {
      document.body.style.backgroundColor = ''; // 컴포넌트 언마운트 시 배경색 초기화
    };
  }, []);

  const handleSelectStyle = () => {
    navigate("/look"); // 스타일 선택 페이지로 이동
  };

  // 회원정보 수정 버튼 클릭 시 비밀번호 확인 페이지로 이동
  const handleEditProfile = () => {
    navigate("/pwconfirm"); // 비밀번호 확인 페이지로 이동
  };

  // 즐겨찾기 상태 업데이트 함수
  const handleFavoriteToggle = (style) => {
    setFavorites((prevFavorites) => {
      if (style.isFavorite) { // 스타일이 즐겨찾기 상태일 경우 추가
        return [...prevFavorites, style];
      } else { // 즐겨찾기 상태가 아닐 경우 제거
        return prevFavorites.filter((item) => item.id !== style.id);
      }
    });
  };

  // Activity 카드 항목 클릭 시 처리
  const handleItemClick = (item) => {
    if (item === '옷 장') {
      navigate('/mywardrobe'); // "옷 장" 선택 시 해당 페이지로 이동
    } else {
      setActiveContent(item); // 추천 받은 스타일 또는 즐겨찾기로 콘텐츠 변경
    }
  };


  const fetchCodiRecommendations = async () => {
    // ✅ schedule 데이터가 존재하는지 확인
    if (!schedule || !schedule.type || !schedule.feelsLike || !schedule.weather) {
      console.warn("⚠️ 코디 추천을 위한 데이터가 부족합니다.", schedule);
      return;
    }

    console.log("📌 코디 추천 요청 데이터:", schedule);

    try {
      const response = await axios.post('http://localhost:8081/api/auth', {
        type: schedule.type,
        feelsLike: schedule.feelsLike,
        weather: schedule.weather,
      });

      if (!response.data || response.data.length === 0) {
        console.warn("⚠️ 추천된 코디가 없습니다.");
        setIsCodiVisible(false);
        return;
      }

      setRecommendedCodi(response.data);
      setIsCodiVisible(true);
    } catch (error) {
      console.error('❌ 코디 추천 데이터를 불러오는 중 오류 발생:', error);
      setIsCodiVisible(false);
    }
  };

  const handleConfirmCodi = () => {
    if (!schedule || !schedule.type || !schedule.feelsLike || !schedule.weather) {
      alert("일정을 입력한 후 코디 추천을 받을 수 있습니다!");
      return;
    }

    fetchCodiRecommendations(); // 코디 추천 데이터 가져오기
    setIsModalOpen(false); // 모달 닫기
    setIsCodiVisible(true); // 코디 추천 이미지 표시
  };

  const renderContent = () => {
    if (isCodiVisible) {
      return <CodiRecommend recommendedCodi={recommendedCodi} />;
    }
    switch (activeContent) {
      case '추천 받은 스타일':
        return <RecommendedStyles onFavorite={handleFavoriteToggle} />; // 추천 받은 스타일 컴포넌트
      case '즐겨찾기':
        return <Favorites favorites={favorites} />; // 즐겨찾기한 스타일 리스트 컴포넌트
      default:
        return null; // 기본적으로 아무것도 표시하지 않음
    }
  };


  // 선택한 날짜의 날씨를 찾아서 schedule 상태 업데이트
  const updateWeatherForSelectedDate = (weatherData) => {
    if (!schedule.date) {
      console.warn("⚠️ 일정 날짜가 선택되지 않았습니다!");
      return;
    }

    const selectedDate = new Date(schedule.date);
    const selectedTimestamp = Math.floor(selectedDate.getTime() / 1000); // 선택한 날짜를 Unix Timestamp로 변환

    // ✅ API에서 받아온 list 데이터에서 가장 가까운 날짜 찾기
    const closestWeather = weatherData.list.find((day) =>
      Math.abs(day.dt - selectedTimestamp) < 43200 // ±12시간 차이 내 데이터 선택
    );

    if (closestWeather) {
      console.log("📌 선택한 날짜의 날씨 데이터:", closestWeather);

      setSchedule((prev) => ({
        ...prev,
        locationName: weatherData.city.name, // 지역명
        weather: closestWeather.weather[0].main, // 날씨 상태
        description: closestWeather.weather[0].description, // 상세한 날씨 설명
        temp: closestWeather.temp.day, // 기온
        feelsLike: closestWeather.feels_like.day, // 체감 온도
      }));
    } else {
      console.warn("⚠️ 해당 날짜의 날씨 데이터를 찾을 수 없습니다.");
      setSchedule((prev) => ({
        ...prev,
        weather: "데이터 없음",
        description: "-",
        temp: "-",
        feelsLike: "-",
        locationName: "-"
      }));
    }
  };

  // 모달 열기/닫기 토글 함수
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // 모달 상태 변경
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));

    // ✅ 일정 날짜 변경 시 날씨 다시 불러오기
    if (name === "date" && schedule.lat && schedule.lon) {
      updateWeatherForSelectedDate(schedule.weatherData);
    }
  };

  // 장소 선택 처리 함수 (KakaoMap에서 호출)
  const handleLocationSelect = async (location, lat, lon) => {
    setSchedule((prev) => ({ ...prev, location, lat, lon, temp: "-", feelsLike: "-", weather: "-" }));

    const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
    console.log("📌 OpenWeatherMap API 키 확인:", API_KEY);

    if (!API_KEY) {
      console.error("❌ API 키가 설정되지 않았습니다!");
      setSchedule((prev) => ({ ...prev, weather: "API 키 오류", temp: "-", feelsLike: "-" }));
      return;
    }

    try {
      // ✅ lat, lon을 사용자 선택값으로 반영하도록 수정!
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=14&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }

      const data = await response.json();
      console.log("📌 OpenWeatherMap 14일 예보 응답 데이터:", data);

      updateWeatherForSelectedDate(data);

    } catch (error) {
      console.error("❌ 날씨 데이터를 불러오는 중 오류 발생:", error);
      setSchedule((prev) => ({
        ...prev,
        weather: "오류 발생",
        description: "-",
        temp: "-",
        feelsLike: "-",
        locationName: "-"
      }));
    }
  };

  if (!user) {
    return <div>Loading...</div>;  // 유저 데이터가 로딩되지 않았을 때 "Loading..." 표시
  }

  return (
    <div className="mypage-container">
      <main className="mypage-main">
        <section className="profile-section">
          <div className="profile-card">
            <img
              src={user.profileImage || "/img/profile-icon.png"}
              alt="프로필 사진"
              className="profile-image"
              />
              <h2>{user.name}</h2>
            <div className="btn-container">
              <button className="btn" onClick={handleEditProfile}>회원정보 수정</button> {/* 회원정보 수정 버튼 */}
              <button className="btn" onClick={handleModalToggle}>코디 추천</button> {/* 모달 열기 버튼 */}
            </div>
            {/* 선호하는 스타일 수정 버튼 */}
            <button className="btn style-btn" onClick={handleSelectStyle}>선호하는 스타일 고르기</button>

          </div>

          <div className="activity-card">
            <h3>Activity</h3>
            <ul>
              <li onClick={() => handleItemClick('옷 장')}>옷 장</li> {/* 옷 장 항목 */}
              <li onClick={() => handleItemClick('추천 받은 스타일')}>추천 받은 스타일</li> {/* 추천 받은 스타일 항목 */}
              <li onClick={() => handleItemClick('즐겨찾기')}>즐겨찾기</li> {/* 즐겨찾기 항목 */}
            </ul>
          </div>
        </section>

        <section className="favorites-section">{renderContent()}</section> {/* 활성화된 콘텐츠 */}
      </main>

      {isModalOpen && (
        <div className="codi-modal-overlay"> {/* 모달 오버레이 */}
          <div className="codi-modal-content"> {/* 모달 콘텐츠 */}
            <h3>코디 추천</h3>

            <div className="codi-modal-form">
              <div className="codi-input-a-group">
                <label>일정명:</label>
                <input
                  type="text"
                  name="name"
                  value={schedule.name}
                  onChange={handleInputChange}
                />
              </div>


              <div className="codi-input-group">
                <label>일정 유형:</label>
                <select name="type" value={schedule.type} onChange={handleInputChange}>
                  <option value="">유형 선택</option>
                  <option value="결혼식">결혼식</option>
                  <option value="데이트">데이트</option>
                  <option value="출퇴근">출퇴근</option>
                </select>
              </div>


              <div className="codi-input-group">
                <label>일정 날짜:</label>
                <input
                  type="date"
                  name="date"
                  value={schedule.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <KakaoMap onSelectLocation={handleLocationSelect} /> {/* KakaoMap을 통한 장소 선택 */}

            <div className="codi-modal-buttons"> {/* 모달 하단 버튼 */}
              <button onClick={handleConfirmCodi}>확인</button>
              <button onClick={handleModalToggle}>취소</button> {/* 모달 닫기 버튼 */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
