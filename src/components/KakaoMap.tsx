import React, { useEffect, useRef } from "react";

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  width: string;
  height: string;
  latitude?: number;
  longitude?: number;
  level?: number;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  width,
  height,
  latitude = 37.5665, // 서울 중심부 기본값
  longitude = 126.978,
  level = 3,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // 카카오맵 스크립트 로드
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=9e765fbc58fd78f51fb3cf7f8e1c0969&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapContainerRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: level,
          };

          mapRef.current = new window.kakao.maps.Map(
            mapContainerRef.current,
            options
          );
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [latitude, longitude, level]);

  return (
    <div ref={mapContainerRef} style={{ width, height }} id="kakao-map"></div>
  );
};

export default KakaoMap;
