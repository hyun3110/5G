import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Mypagestyle.css';
import RecommendedStyles from './Recommended';
import Favorites from './Favorites';
import KakaoMap from './Kakaomap'; // KakaoMap 컴포넌트 import
import "../css/modal.css";

const MyPage = () => {
  const [username, setUsername] = useState('사용자 이름'); // 사용자 이름 상태
  const [profileImage, setProfileImage] = useState('/path/to/default-profile.png'); // 프로필 이미지 상태
  const [activeContent, setActiveContent] = useState('추천 받은 스타일'); // 현재 활성화된 콘텐츠 상태
  const [favorites, setFavorites] = useState([]); // 즐겨찾기한 스타일 리스트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 활성화 상태
  const [schedule, setSchedule] = useState({
    name: '', // 일정명
    type: '', // 일정 유형 (결혼식, 데이트, 출퇴근 등)
    location: '', // 일정 장소
    date: '', // 일정 날짜
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

  // 사용자 데이터를 가져오는 함수
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user'); // 사용자 데이터 API 요청
        const data = await response.json();
        setUsername(data.username); // 사용자 이름 업데이트
        setProfileImage(data.profileImage); // 프로필 이미지 업데이트
      } catch (error) {
        console.error('Failed to fetch user data:', error); // 에러 발생 시 로그 출력
      }
    };

    fetchUserData(); // 사용자 데이터 가져오기 호출
  }, []);

  // 회원정보 수정 버튼 클릭 시 비밀번호 확인 페이지로 이동
  const handleEditProfile = () => {
    navigate("/Pwconfirm"); // 비밀번호 확인 페이지로 이동
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
      navigate('/closet'); // "옷 장" 선택 시 해당 페이지로 이동
    } else {
      setActiveContent(item); // 추천 받은 스타일 또는 즐겨찾기로 콘텐츠 변경
    }
  };

  // 모달 열기/닫기 토글 함수
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // 모달 상태 변경
  };

  // 입력 필드 변경 처리 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target; // 입력 필드의 이름과 값 가져오기
    setSchedule({ ...schedule, [name]: value }); // 상태 업데이트
  };

  // 장소 선택 처리 함수 (KakaoMap에서 호출)
  const handleLocationSelect = async (location, lat, lon) => {
    setSchedule({ ...schedule, location }); // 선택된 장소 업데이트

    // OpenWeatherMap API를 사용하여 날씨 데이터 가져오기
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=REACT_APP_WEATHER_API_KEY&units=metric` // 위도와 경도를 기반으로 날씨 데이터 요청
      );
      const data = await response.json();
      setSchedule((prev) => ({ ...prev, feelsLike: data.main.feels_like })); // 체감 온도 업데이트
    } catch (error) {
      console.error('Failed to fetch weather data:', error); // 에러 발생 시 로그 출력
    }
  };

  // 현재 활성화된 콘텐츠를 렌더링하는 함수
  const renderContent = () => {
    switch (activeContent) {
      case '추천 받은 스타일':
        return <RecommendedStyles onFavorite={handleFavoriteToggle} />; // 추천 받은 스타일 컴포넌트
      case '즐겨찾기':
        return <Favorites favorites={favorites} />; // 즐겨찾기 컴포넌트
      default:
        return null; // 기본값은 null 반환
    }
  };

  return (
    <div className="mypage-container">

      <main className="mypage-main">
        <section className="profile-section">
          <div className="profile-card">
            <img
              src={profileImage}
              alt="User Profile"
              className="profile-image"
            />
            <h2>{username}</h2>
            <div className="btn-container">
              <button className="btn" onClick={handleEditProfile}>회원정보 수정</button> {/* 회원정보 수정 버튼 */}
              <button className="btn" onClick={handleModalToggle}>코디 추천</button> {/* 모달 열기 버튼 */}
            </div>
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
        <div className="modal-overlay"> {/* 모달 오버레이 */}
          <div className="modal-content"> {/* 모달 콘텐츠 */}
            <h3>코디 추천</h3>

            <label>
              일정명:
              <input
                type="text"
                name="name"
                value={schedule.name}
                onChange={handleInputChange}
              />
            </label>

            <div>
              일정 유형:
              <label>
                <input
                  type="radio"
                  name="type"
                  value="결혼식"
                  onChange={handleInputChange}
                />
                결혼식
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="데이트"
                  onChange={handleInputChange}
                />
                데이트
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="출퇴근"
                  onChange={handleInputChange}
                />
                출퇴근
              </label>
            </div>

            <label>
              일정 날짜:
              <input
                type="date"
                name="date"
                value={schedule.date}
                onChange={handleInputChange}
              />
            </label>

            <KakaoMap onSelectLocation={handleLocationSelect} /> {/* KakaoMap을 통한 장소 선택 */}


            <div className="modal-buttons"> {/* 모달 하단 버튼 */}
              <button onClick={handleModalToggle}>취소</button> {/* 모달 닫기 버튼 */}
              <button onClick={() => {
                console.log('Schedule:', schedule); // 입력된 일정 데이터 콘솔 출력
                handleModalToggle(); // 모달 닫기
              }}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
