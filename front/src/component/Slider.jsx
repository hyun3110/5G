import React, { useEffect, useState } from "react";
import "../css/styles.css";

const Slider = () => {
  const largeImages = [
    "/img/test1.png",
    "/img/test2.png",
    "/img/test3.png",
    "/img/test4.png",
    "/img/test5.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleRange, setVisibleRange] = useState([0, 3]); // 화면에 보여질 이미지 범위

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToNextSlide = () => {
    const nextIndex = (currentIndex + 1) % largeImages.length;
    setCurrentIndex(nextIndex);
    adjustVisibleRange(nextIndex);
  };

  const goToPrevSlide = () => {
    const prevIndex =
      (currentIndex - 1 + largeImages.length) % largeImages.length;
    setCurrentIndex(prevIndex);
    adjustVisibleRange(prevIndex);
  };

  const adjustVisibleRange = (index) => {
    const itemsPerPage = 3; // 한번에 보여질 아이템 개수
    const start = Math.floor(index / itemsPerPage) * itemsPerPage;
    setVisibleRange([start, start + itemsPerPage]);
  };

  return (
    <div className="slider-container">
      {/* Large Slider */}
      <div className="large-slider-frame">
        <div
          className="large-slider"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {largeImages.map((src, index) => (
            <div className="large-slider-item" key={index}>
              <img src={src} alt={`Slide ${index + 1}`} className="large-pic" />
            </div>
          ))}
        </div>
      </div>

      {/* Small Slider */}
      <div className="small-slider-frame">
        <div
          className="small-slider"
          style={{
            transform: `translateX(-${visibleRange[0] * 90}px)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {largeImages.map((src, index) => (
            <div
              className={`small-slider-item ${
                index === currentIndex ? "active" : ""
              }`}
              key={index}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={src} alt={`Thumbnail ${index + 1}`} className="small-pic" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
