import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // axios 추가
import "../css/MyWardrobe.css";

const MyWardrobe = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCounts, setVisibleCounts] = useState({
    "전체": 12,
    "외투": 12,
    "상의": 12,
    "하의": 12,
    "신발": 12,
  });

  // 각 섹션을 참조하기 위한 useRef 추가
  const sectionsRef = useRef({
    전체: null,
    외투: null,
    상의: null,
    하의: null,
    신발: null,
  });

  const currentPage = "내 옷장"; // 현재 페이지 이름

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("백엔드_데이터_불러오는_경로"); // 백엔드 API 경로 입력
        setItems(response.data); // 백엔드에서 받아온 데이터를 상태로 저장
        setLoading(false);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const loadMoreItems = (category) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [category]: prev[category] + 12,
    }));
  };

  // 클릭 시 해당 카테고리 섹션으로 스크롤 이동하는 함수
  const scrollToSection = (category) => {
    const targetSection = sectionsRef.current[category];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderItems = (category) => {
    const filteredItems = items.filter((item) => item.category === category || category === "전체");
    const visibleItems = filteredItems.slice(0, visibleCounts[category]);

    return (
      <>
        <div className="grid">
          {visibleItems.map((item) => (
            <div key={item.id} className="grid-item">
              <img src={item.image} alt={`Item ${item.id}`} />
            </div>
          ))}
        </div>
        {filteredItems.length > visibleCounts[category] && (
          <button className="load-more" onClick={() => loadMoreItems(category)}>
            더 보기
          </button>
        )}
      </>
    );
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="wardrobe-container">
      {/* 사이드바 */}
      <div className="sidebar">
        <div className="sidebar-inner">
          <h2>내 의류</h2>
          <ul>
            {["전체", "외투", "상의", "하의", "신발"].map((category) => (
              <li key={category} onClick={() => scrollToSection(category)}>
                {category}
                <hr />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        <div className="navigation-bar">
          {/* Flexbox로 배치 */}
          <h1 className="left-text">My Wardrobe</h1>
          <div className="right-text">
            <a href="/my-page" className="breadcrumb">My Page</a> &gt;
            <span className="current">{currentPage}</span>
          </div>
        </div>

        <hr />
        {/* 최근 등록 섹션 */}
        <section ref={(el) => (sectionsRef.current["전체"] = el)}>
          <h2 className="category-title">최근 등록</h2>
          {renderItems("전체")}
        </section>
        <div className="section-divider"></div>

        {/* 전체, 외투, 상의, 하의, 신발 섹션 */}
        {["전체", "외투", "상의", "하의", "신발"].map((category) => (
          <section key={category} ref={(el) => (sectionsRef.current[category] = el)}>
            <h2 className="category-title">{category}</h2>
            {renderItems(category)}
            <div className="section-divider"></div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default MyWardrobe;
