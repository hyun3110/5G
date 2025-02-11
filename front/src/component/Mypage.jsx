import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Mypagestyle.css';
import RecommendedStyles from './Recommended';
import Favorites from './Favorites';
import CodiRecommend from './Codirecommend';
import { useUser } from "../context/UserContext";
import "../css/modal.css";

//다 수정하고 괄호에 user 넣기
const MyPage = () => {
  const [activeContent, setActiveContent] = useState('추천 받은 스타일'); // 현재 활성화된 콘텐츠 상태
  const [favorites, setFavorites] = useState([]); // 즐겨찾기한 스타일 리스트 상태
  const { user } = useUser();  // user 정보 가져오기
  const [isCodiVisible, setIsCodiVisible] = useState(false); // 코디 추천 결과 표시 여부
  const [recommendedCodi, setRecommendedCodi] = useState([]); // 추천된 코디 데이터 상태

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // 페이지 로드 시 배경색을 설정
  useEffect(() => {
    document.body.style.backgroundColor = 'white'; // 배경색을 흰색으로 설정
    return () => {
      document.body.style.backgroundColor = ''; // 컴포넌트 언마운트 시 배경색 초기화
    };
  }, []);

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

  if (!user) {
    return <div>Loading...</div>;  // 유저 데이터가 로딩되지 않았을 때 "Loading..." 표시
  }

  return (
    <div className="mypage-container">
      <main className="mypage-main">
        <h2>마이페이지</h2>
        <hr className="divider" />

        <section className="profile-section">
          <div className="profile-card">
            <img
              src={"/img/profile-icon.png"}
              alt="프로필 사진"
              className="profile-image"
              />
              <h2>{user.name} 님</h2>
            <div className="btn-container">
              <button className="btn edit-btn" onClick={handleEditProfile}>회원정보 수정</button> {/* 회원정보 수정 버튼 */}
              {/* <button className="btn" onClick={handleModalToggle}>코디 추천</button> */}
            </div>
            <ul>
              <li onClick={() => handleItemClick('옷 장')}>옷 장</li> {/* 옷 장 항목 */}
              <li onClick={() => handleItemClick('추천 받은 스타일')}>추천 받은 스타일</li> {/* 추천 받은 스타일 항목 */}
              <li onClick={() => handleItemClick('즐겨찾기')}>즐겨찾기</li> {/* 즐겨찾기 항목 */}
            </ul>
          </div>
        </section>
        <section className="favorites-section">{renderContent()}</section> {/* 활성화된 콘텐츠 */}
      </main>
    </div>
  );
};

export default MyPage;
