import React, { useEffect, useState, useRef } from 'react';
import '../css/Mypagestyle.css';

const KakaoMap = ({ onSelectLocation, initialLat, initialLon }) => {
  const [keyword, setKeyword] = useState('');
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mapContainer = useRef(null);

  // 기본값 설정 (서울의 위도, 경도)
  const defaultLat = 37.5665;
  const defaultLon = 126.9780;

  // initialLat와 initialLon이 없을 경우 기본값을 사용
  const lat = initialLat || defaultLat;
  const lon = initialLon || defaultLon;

  // 카카오맵 스크립트를 로드하는 함수
  const loadKakaoMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
        console.log('✅ 카카오맵 SDK 이미 로드됨');
        setScriptLoaded(true);
        initializeMap(); // SDK가 이미 로드되었으므로 바로 지도 초기화
        resolve();
        return;
      }

      const API_KEY = process.env.REACT_APP_KAKAO_API_KEY; // 환경 변수에서 API 키 불러오기
      console.log("📌 카카오 API 키:", API_KEY);

      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => {
        console.log('✅ 카카오맵 SDK 로드 완료');
        window.kakao.maps.load(() => {
          console.log('✅ 카카오맵 API 완전히 로드됨');
          setScriptLoaded(true);
          initializeMap(); // 지도 초기화
          resolve();
        });
      };
      script.onerror = (err) => {
        console.error('❌ 카카오맵 SDK 로드 실패:', err);
        reject(err);
      };
      document.head.appendChild(script);
    });
  };

  // 지도 초기화 함수
  const initializeMap = () => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
      console.error('❌ 카카오맵 SDK가 아직 완전히 로드되지 않았습니다.');
      return;
    }

    if (!mapContainer.current) {
      console.error('❌ Map container가 존재하지 않습니다!');
      return;
    }

    console.log('✅ 지도 초기화 시작');
    const options = {
      center: new window.kakao.maps.LatLng(lat, lon), // lat, lon 값 사용
      level: 3,
    };

    const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
    setMap(kakaoMap);

    const places = new window.kakao.maps.services.Places();
    setPlacesService(places);

    console.log('✅ 지도 초기화 완료');
  };

  // useEffect에서 카카오맵 스크립트 로드 및 초기화 호출
  useEffect(() => {
    // 컴포넌트가 마운트될 때 스크립트 로드
    loadKakaoMapScript().catch((error) =>
      console.error('❌ 카카오맵 로드 중 오류 발생:', error)
    );
  }, []); // 한 번만 실행하도록 빈 배열 전달

  // 장소 검색 처리 함수
  const handleSearch = () => {
    if (!keyword || !placesService || !map) return;

    placesService.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();

        data.forEach((place) => {
          const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            onSelectLocation(place.y, place.x);
          });

          bounds.extend(marker.getPosition());
        });

        map.setBounds(bounds);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  return (
    <div>
      <div className="codi-search-container">
        <div className="codi-input-b-group">
          <label>장소:</label>
        </div>
        <input
          type="text"
          placeholder="장소 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch} disabled={!scriptLoaded}>
          {scriptLoaded ? '검색' : '로딩 중...'}
        </button>
      </div>

      {/* 지도 표시 영역 */}
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '400px', marginTop: '10px', backgroundColor: '#f0f0f0' }}
      ></div>
    </div>
  );
};

export default KakaoMap;
