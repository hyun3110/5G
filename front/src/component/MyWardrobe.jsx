import React, { useState, useEffect, useRef } from "react";
import "../css/MyWardrobe.css";
import { useUser } from "../context/UserContext";
import {
  getClosets,
  upload,
  getImg,
  deleteClosets,
} from "../api/closetsService";

const MyWardrobe = () => {
  const [items, setItems] = useState([]); // 아이템 목록
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템 저장
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [uploadedImage, setUploadedImage] = useState(null); // 업로드 이미지
  const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기
  const [selectedCategory, setSelectedCategory] = useState("상의"); // 선택된 카테고리
  const { user } = useUser(); // user 정보 가져오기
  const [visibleCounts, setVisibleCounts] = useState({
    전체: 12,
    외투: 12,
    상의: 12,
    하의: 12,
    신발: 12,
  });
  const [imageSrcs, setImageSrcs] = useState({}); // 각 아이템의 이미지 URL을 저장할 상태
  const fileInputRef = useRef();
  const [scrollY, setScrollY] = useState(0); // 스크롤 Y 좌표 상태 추가
  const sectionsRef = useRef({
    전체: null,
    외투: null,
    상의: null,
    하의: null,
    신발: null,
  });

  const currentPage = "내 옷장";

  useEffect(() => {
    if (!user) return; // user가 없으면 API 호출하지 않음
    const fetchItems = async () => {
      try {
        const data = await getClosets(user.id);
        // 데이터가 배열 형식으로 들어오는지 확인 후 상태 설정
        console.log(data);
        setItems(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("아이템을 가져오는 중 오류 발생:", error);
      }
    };
    fetchItems();
  }, [user]); // useEffect에 비동기 호출 래핑

   // 🔥 스크롤 감지하여 scrollY 상태 업데이트
   useEffect(() => {
    const handleScroll = () => {
      const yOffset = window.scrollY * 0.3; // 스크롤 속도를 30%만 반영하여 부드럽게 이동
      setScrollY(Math.min(yOffset, 150)); // 최대 150px까지만 이동하도록 제한
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 이미지 로딩
  useEffect(() => {
    const fetchImages = async () => {
      const newImageSrcs = {}; // 새로 이미지 URL을 저장할 객체
      for (let item of items) {
        try {
          const image = await getImg(item.file); // 이미지 불러오기
          if (image && image.data) {
            // Blob 데이터를 반환하는 경우
            const imageBlob = image.data;
            const imageUrl = URL.createObjectURL(imageBlob); // Blob을 URL로 변환
            newImageSrcs[item.closetIdx] = imageUrl; // 아이템의 closetIdx를 키로 저장
          } else if (image && typeof image === "string") {
            // 이미 URL을 직접 반환하는 경우
            newImageSrcs[item.closetIdx] = image; // 아이템의 closetIdx를 키로 저장
          } else {
            console.error(`알 수 없는 데이터 형식: ${item.closetIdx}`);
          }
        } catch (error) {
          console.error("이미지 로드 실패:", error);
        }
      }
      setImageSrcs(newImageSrcs); // 상태 업데이트
    };

    if (items.length > 0) {
      fetchImages(); // 아이템이 있으면 이미지 가져오기
    }
  }, [items]); // items 배열이 변경될 때마다 실행

  const handleCheckboxChange = (closetIdx) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(closetIdx)
        ? prevSelected.filter((id) => id !== closetIdx)
        : [...prevSelected, closetIdx]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      alert("삭제할 의류를 선택하세요.");
      return;
    }

    const confirmDelete = window.confirm("선택한 의류를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      // 삭제 API 호출
      const response = await deleteClosets(selectedItems);
      if (response.status === 200 || response.status === 204) {
        alert("선택한 의류가 삭제되었습니다.");
        setItems((prevItems) =>
          prevItems.filter((item) => !selectedItems.includes(item.closetIdx))
        );
        setSelectedItems([]); // 선택된 목록 초기화
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("의류 삭제 중 오류 발생:", error);
      alert("의류 삭제에 실패했습니다.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하이어야 합니다.");
        return;
      }
      setUploadedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!uploadedImage || !user) {
      alert("이미지를 선택하고 로그인 상태를 확인하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedImage);
    formData.append("userId", user.id);
    formData.append("category", selectedCategory);

    try {
      const response = await upload(formData);
      if (response.status === 200 || response.status === 201) {
        alert("이미지가 성공적으로 업로드되었습니다!");
        setShowModal(false); // 모달 닫기
        setUploadedImage(null); // 이미지 초기화
        setPreviewImage(null); // 미리보기 초기화
        setSelectedCategory("상의"); // 카테고리 초기화
        // 새로 업로드된 아이템을 서버에서 받아와서 추가할 수 있습니다.
        setItems((prevItems) => [...prevItems, response.data]);
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleLoadMore = (category) => {
    const filteredItems = items.filter(
      (item) => item.category === category || category === "전체"
    );

    setVisibleCounts((prevCounts) => ({
      ...prevCounts,
      [category]: visibleCounts[category] === 12 ? filteredItems.length : 12,
    }));
  };

  const renderItems = (category) => {
    const filteredItems =
      category === "최근 등록"
        ? items.filter((item) => {
            const today = new Date();
            const uploadDate = new Date(item.uploadedAt);
            const diffDays = (today - uploadDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 7;
          })
        : items.filter(
            (item) => item.category === category || category === "전체"
          );

    if (filteredItems.length === 0) {
      return <p className="no-items">등록된 옷이 없습니다.</p>;
    }

    const visibleItems = filteredItems.slice(0, visibleCounts[category]);
    const showLoadMoreButton = filteredItems.length > 12;

    return (
      <div>
        <div className="grid">
          {visibleItems.map((item) => (
            <div key={item.closetIdx} className="grid-item styled-grid-item">
              {/* 체크박스 추가 */}
              <input
                id={`checkbox-${item.closetIdx}`}
                type="checkbox"
                className="item-checkbox"
                checked={selectedItems.includes(item.closetIdx)}
                onChange={() => handleCheckboxChange(item.closetIdx)}
              />
              <label
                htmlFor={`checkbox-${item.closetIdx}`}
                className="checkbox-wrapper"
              ></label>
              {/* 아이템 이미지 */}
              <img
                src={imageSrcs[item.closetIdx]}
                alt={`Item ${item.closetIdx}`}
                className="item-image"
              />

              {/* 아이템 이름 */}
              <p className="item-name">{item.name}</p>
            </div>
          ))}
        </div>

        {/* 더 보기 버튼 */}
        {showLoadMoreButton && (
          <div className="load-more-container">
            <button
              className="load-more-button"
              onClick={() => handleLoadMore(category)}
            >
              {visibleCounts[category] === 12 ? "더 보기" : "접기"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="wardrobe-container">
      <div className="sidebar" style={{ transform: `translateY(${scrollY}px)`, }}>
        <div className="sidebar-inner">
          <h2>내 의류</h2>
          <ul>
            {["전체", "외투", "상의", "하의", "신발"].map((category) => (
              <li
                key={category}
                onClick={() =>
                  sectionsRef.current[category]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start", // 섹션의 상단이 뷰포트 상단에 위치
                    inline: "nearest", // 가로 스크롤은 가장 가까운 위치로 이동
                  })
                }
              >
                {category}
                <hr />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="main-content">
        <div className="fixed-header">
          <div className="navigation-bar">
            <div className="right-text">
              <a href="/Mypage" className="breadcrumb">
                My Page
              </a>{" "}
              &gt;
              <span className="current">{currentPage}</span>
            </div>
          </div>

          <div className="top-action-bar">
            <h1 className="left-text">My Wardrobe</h1>
            <button
              className="add-clothing-button"
              onClick={() => setShowModal(true)}
            >
              내 옷 등록
            </button>
            {/* 삭제하기 버튼 */}
            <button
              className="Wardrobe-delete-button"
              onClick={handleDeleteSelected}
            >
              삭제하기
            </button>
          </div>
          <hr className="category-divider" />
        </div>
        <div className="scrollable-content">
          <section ref={(el) => (sectionsRef.current["최근 등록"] = el)}>
            <h2 className="category-title">최근 등록</h2>
            {renderItems("최근 등록")}
          </section>

          {["전체", "외투", "상의", "하의", "신발"].map((category) => (
            <React.Fragment key={category}>
              <hr className="category-divider" />
              <section ref={(el) => (sectionsRef.current[category] = el)}>
                <h2 className="category-title">{category}</h2>
                {renderItems(category)}
              </section>
            </React.Fragment>
          ))}
        </div>
        <hr className="category-divider" />
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="Wardrobe-modal-header">
              <h2>이미지 업로드</h2>
              <button
                className="modal-close-button"
                onClick={() => setShowModal(false)}
                aria-label="닫기"
              >
                &times;
              </button>
            </div>
            <div className="image-preview-container">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <div className="empty-preview">
                  이미지 미리보기가 여기에 표시됩니다.
                </div>
              )}
            </div>
            <div
              className="drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <p>이미지를 드래그하거나 클릭하여 업로드하세요.</p>
              {uploadedImage && <p>업로드된 파일: {uploadedImage.name}</p>}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="modal-category-container">
              <label htmlFor="category" className="modal-category-label">
                의류 분류:
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="modal-category-select"
              >
                <option value="상의">상의</option>
                <option value="하의">하의</option>
                <option value="외투">외투</option>
                <option value="신발">신발</option>
              </select>
            </div>
            <hr></hr>
            <div className="category-button-container">
              <button className="category-upload-button" onClick={handleUpload}>
                업로드
              </button>
              <button
                className="category-cancel-button"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWardrobe;
