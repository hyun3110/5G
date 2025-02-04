import React, { useState, useEffect, useRef } from "react";
import "../css/MyWardrobe.css";
import axios from "axios";

const MyWardrobe = ({ user }) => {
  const [items, setItems] = useState([]); // 아이템 목록
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [uploadedImage, setUploadedImage] = useState(null); // 업로드 이미지
  const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기
  const [selectedCategory, setSelectedCategory] = useState("상의"); // 선택된 카테고리
  const [visibleCounts, setVisibleCounts] = useState({
    전체: 12,
    외투: 12,
    상의: 12,
    하의: 12,
    신발: 12,
  }); // 각 카테고리별 보여질 항목 수

  const fileInputRef = useRef(); // 파일 입력 Ref
  const currentPage = "내 옷장"; // 이 변수는 상수로 사용 가능

  useEffect(() => {
    if (!user) return; // user가 없으면 API 호출하지 않음
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/closets/${user.id}`, {
          withCredentials: true,
        });
        const data = response.data;
        setItems(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("옷장 데이터를 가져오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user]); // useEffect에 비동기 호출 래핑

  // 나머지 함수와 JSX 코드는 그대로 유지합니다.


  const handleLoadMore = (category) => {
    const filteredItems = items.filter(
      (item) => item.category === category || category === "전체"
    );

    setVisibleCounts((prevCounts) => ({
      ...prevCounts,
      [category]: visibleCounts[category] === 12 ? filteredItems.length : 12,
    }));
  };

  const handleCheckboxChange = (closetIdx) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(closetIdx)
        ? prevSelected.filter((id) => id !== closetIdx)
        : [...prevSelected, closetIdx]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      alert("삭제할 아이템을 선택하세요.");
      return;
    }

    try {
      console.log("Deleting items:", selectedItems); // 디버깅용 콘솔 출력
      const response = await axios.post(
        `/api/closets/delete`,
        { ids: selectedItems },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 204) {
        setItems((prevItems) =>
          prevItems.filter((item) => !selectedItems.includes(item.closetIdx))
        );
        setSelectedItems([]);
        alert("선택한 아이템이 삭제되었습니다.");
      } else {
        console.error("Unexpected response:", response);
        alert("삭제 요청이 실패했습니다.");
      }
    } catch (error) {
      console.error("아이템 삭제 중 오류 발생:", error);
      alert("아이템 삭제에 실패했습니다.");
    }
  };

  const renderItems = (category) => {
    const filteredItems =
      category === "최근 등록"
        ? items.filter((item) => {
            const today = new Date();
            const uploadDate = new Date(item.uploadDate);
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
            <div
              key={item.closetIdx}
              className={`grid-item ${
                selectedItems.includes(item.closetIdx) ? "selected" : ""
              }`}
            >
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  className="item-checkbox"
                  checked={selectedItems.includes(item.closetIdx)}
                  onChange={() => handleCheckboxChange(item.closetIdx)}
                />
              </div>
              <img
                src={`/api/closets/download/${item.file}`}
                alt={`Item ${item.closetIdx}`}
              />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        {showLoadMoreButton && (
          <button
            className="load-more-button"
            onClick={() => handleLoadMore(category)}
          >
            {visibleCounts[category] === 12 ? "더 보기" : "접기"}
          </button>
        )}
      </div>
    );
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
      const response = await axios.post("/api/closets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("이미지가 성공적으로 업로드되었습니다!");
        setShowModal(false);
        setUploadedImage(null);
        setPreviewImage(null);
        setSelectedCategory("상의");
        setItems((prevItems) => [...prevItems, response.data]);
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="wardrobe-container">
      <div className="sidebar">
        <div className="sidebar-inner">
          <h2>내 의류</h2>
          <ul>
            {["전체", "외투", "상의", "하의", "신발"].map((category) => (
              <li key={category}>
                {category}
                <hr />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="main-content">
        <div className="navigation-bar">
          <h1 className="left-text">My Wardrobe</h1>
          <div className="right-text">
            <a href="/Mypage" className="breadcrumb">
              My Page
            </a>{" "}
            &gt; <span className="current">{currentPage}</span>
          </div>
        </div>

        <div className="top-action-bar">
          <button
            className="add-clothing-button"
            onClick={() => setShowModal(true)}
          >
            내 옷 등록
          </button>
          <button
            className="Wardrobe-delete-button"
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
          >
            삭제하기
          </button>
        </div>

        <hr className="category-divider" />
        <section>
          <h2 className="category-title">최근 등록</h2>
          {renderItems("최근 등록")}
        </section>

        {["전체", "외투", "상의", "하의", "신발"].map((category) => (
          <React.Fragment key={category}>
            <hr className="category-divider" />
            <section>
              <h2 className="category-title">{category}</h2>
              {renderItems(category)}
            </section>
          </React.Fragment>
        ))}

        <hr className="category-divider" />
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>이미지 업로드</h2>
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
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileChange}
            >
              <p>이미지를 드래그하거나 클릭하여 업로드하세요.</p>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button className="upload-button" onClick={handleUpload}>
              업로드
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWardrobe;
