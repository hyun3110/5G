import React, { useEffect, useState, useRef } from 'react';

const KakaoMap = ({ onSelectLocation }) => {
  const [keyword, setKeyword] = useState('');
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mapContainer = useRef(null);

  useEffect(() => {
    /**
     * 1. 카카오맵 스크립트를 동적으로 로드하는 함수
     */
    const loadKakaoMapScript = () => {
      return new Promise((resolve, reject) => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
          console.log('✅ 카카오맵 SDK 이미 로드됨');
          setScriptLoaded(true);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
          console.log('✅ 카카오맵 SDK 로드 완료');
          window.kakao.maps.load(() => {
            console.log('✅ 카카오맵 API 완전히 로드됨');
            setScriptLoaded(true);
            initializeMap();
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

    /**
     * 2. 카카오맵을 초기화하는 함수 (SDK 로드 후 실행)
     */
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
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3,
      };

      const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(kakaoMap);

      const places = new window.kakao.maps.services.Places();
      setPlacesService(places);

      console.log('✅ 지도 초기화 완료');
    };

    // 스크립트를 로드한 후, 초기화 실행
    loadKakaoMapScript().catch((error) =>
      console.error('❌ 카카오맵 로드 중 오류 발생:', error)
    );
  }, []);

  /**
   * 3. 장소 검색 함수
   */
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
            onSelectLocation(place.place_name, place.y, place.x);
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
      <div>
        <input
          type="text"
          placeholder="장소 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
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
