import React, { useState, useEffect, useRef } from "react";
import "../css/MyWardrobe.css";
import { useUser } from "../context/UserContext";
import { getClosets, upload } from "../api/closetsService";
import axios from "axios";

const MyWardrobe = ({ user }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("상의"); // 선택된 카테고리
  const { user } = useUser();  // user 정보 가져오기
  const [visibleCounts, setVisibleCounts] = useState({
    "전체": 12,
    "외투": 12,
    "상의": 12,
    "하의": 12,
    "신발": 12,
  });
  const fileInputRef = useRef();
  const sectionsRef = useRef({
    전체: null,
    외투: null,
    상의: null,
    하의: null,
    신발: null,
  });

  const currentPage = "내 옷장";

  useEffect(() => {
    if (!user) return;

    axios
      .get(`/api/closets/${user.id}`, { withCredentials: true })
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([data]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("옷장 데이터를 가져오는 데 실패했습니다.", error);
        setLoading(false);
      });
  }, [user]);

  const getRecentItems = () => {
    const today = new Date();
    return items.filter((item) => {
      const uploadDate = new Date(item.uploadedAt);
      const diffDays = (today - uploadDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    });
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
      const response = upload(formData);

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

  const renderItems = (category) => {
    const filteredItems =
      category === "최근 등록" ? getRecentItems() : items.filter((item) => item.category === category || category === "전체");

    if (filteredItems.length === 0) {
      return <p className="no-items">등록된 옷이 없습니다.</p>;
    }

    const visibleItems = filteredItems.slice(0, visibleCounts[category]);

    return (
      <div className="grid">
        {visibleItems.map((item) => (
          <div key={item.closetIdx} className="grid-item">
            {/* 서버에서 반환한 이미지 URL을 사용하여 이미지 표시 */}
            <img src={`/api/closets/download/${item.file}`} alt={`Item ${item.closetIdx}`} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    );
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
              <li key={category} onClick={() => sectionsRef.current[category]?.scrollIntoView({ behavior: "smooth" })}>
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
            <a href="/Mypage" className="breadcrumb">My Page</a> &gt;
            <span className="current">{currentPage}</span>
          </div>
        </div>

        <div className="top-action-bar">
          <button className="add-clothing-button" onClick={() => setShowModal(true)}>
            내 옷 등록
          </button>
        </div>

        <hr className="category-divider" />
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

        <hr className="category-divider" />
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>이미지 업로드</h2>
            <div className="image-preview-container">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="image-preview" />
              ) : (
                <div className="empty-preview">이미지 미리보기가 여기에 표시됩니다.</div>
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

            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="상의">상의</option>
              <option value="하의">하의</option>
              <option value="외투">외투</option>
              <option value="신발">신발</option>
            </select>

            <button className="upload-button" onClick={handleUpload}>
              업로드
            </button>
            <button className="cancel-button" onClick={() => setShowModal(false)}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWardrobe;
