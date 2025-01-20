import React, { useEffect, useState } from "react";
import '../css/styles.css';


const Slider = () => {
  const largeImages = [
    "/img/test1.png",
    "/img/test2.png",
    "/img/test3.png",
    "/img/test4.png",
    "/img/test5.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % largeImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [largeImages.length]);

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
        <div className="small-slider">
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
