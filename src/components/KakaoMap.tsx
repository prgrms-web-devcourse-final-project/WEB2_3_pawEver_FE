import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Shelter {
  name: string;
  latitude: number;
  longitude: number;
  phone?: string;
  distance?: number;
}

interface KakaoMapProps {
  width: string;
  height: string;
  centerLat: number;
  centerLng: number;
  markers?: Shelter[];
  selectedShelter?: Shelter | null;
}

//거리 변환 함수
function formatDistance(distance?: number): string {
  if (distance === undefined) return "";
  if (distance >= 1000) {
    // 예: 1250 => 1.25km
    const km = (distance / 1000).toFixed(2);
    return `${km}km`;
  }
  return `${distance}m`;
}

// 이름 길이 제한 (15글자)
function shortenName(name: string, maxLength: number = 15): string {
  if (name.length > maxLength) {
    return name.substring(0, maxLength) + "...";
  }
  return name;
}

export default function KakaoMap({
  width,
  height,
  centerLat,
  centerLng,
  markers = [],
  selectedShelter,
}: KakaoMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 카카오맵 API 로드
  const loadKakaoMapAPI = () => {
    return new Promise<void>((resolve) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_API_KEY
      }&autoload=false&libraries=services`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          resolve();
        });
      };
      document.head.appendChild(script);
    });
  };

  // 지도 초기화
  const initializeMap = () => {
    if (!mapContainerRef.current) return;

    const mapOptions = {
      center: new window.kakao.maps.LatLng(centerLat, centerLng),
      level: 5, // 기본 줌 레벨
    };

    const map = new window.kakao.maps.Map(mapContainerRef.current, mapOptions);
    mapInstanceRef.current = map;
  };

  // 지도에 모든 마커 표시
  const displayMarkers = () => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    markers.forEach((oneShelter) => {
      const markerPosition = new window.kakao.maps.LatLng(
        oneShelter.latitude,
        oneShelter.longitude
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(mapInstanceRef.current);

      // 인포윈도우(툴팁)
      const infoWindowContent = `
        <div style="padding:5px; font-size:12px; max-width:200px;">
          <div 
            style="font-weight:bold;
                   white-space:nowrap;
                   overflow:hidden;
                   text-overflow:ellipsis;">
            ${shortenName(oneShelter.name, 25)}
          </div>
          ${
            oneShelter.phone
              ? `<div style="margin-top:3px;">전화: ${oneShelter.phone}</div>`
              : ""
          }
          ${
            oneShelter.distance !== undefined
              ? `<div style="margin-top:3px;">거리: ${formatDistance(
                  oneShelter.distance
                )}</div>`
              : ""
          }
        </div>
      `;
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: infoWindowContent,
      });

      // 툴팁 열기
      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });
      // 툴팁 닫기
      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infoWindow.close();
      });

      markersRef.current.push(marker);
    });
  };

  // 모든 마커가 보이도록 지도 범위 조정
  const fitBoundsToAllMarkers = () => {
    if (!mapInstanceRef.current || markers.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    markers.forEach((oneShelter) => {
      bounds.extend(
        new window.kakao.maps.LatLng(oneShelter.latitude, oneShelter.longitude)
      );
    });
    mapInstanceRef.current.setBounds(bounds);
  };

  // 최초 한번 지도 로드
  useEffect(() => {
    const setupMap = async () => {
      await loadKakaoMapAPI();
      initializeMap();
    };
    setupMap();

    return () => {
      mapInstanceRef.current = null;
    };
  }, []);

  // markers가 변경될 때마다 마커 다시 표시
  useEffect(() => {
    if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
      displayMarkers();

      // 아직 선택된 보호소가 없으면, 전체 마커 한 화면에 맞춤
      if (!selectedShelter) {
        fitBoundsToAllMarkers();
      }
    }
  }, [markers]);

  // selectedShelter가 바뀌면 해당 보호소 위치로 클로즈업
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedShelter) {
      const centerPosition = new window.kakao.maps.LatLng(
        selectedShelter.latitude,
        selectedShelter.longitude
      );
      mapInstanceRef.current.setCenter(centerPosition);
      // 원하는 만큼 확대 (숫자 작을수록 더 확대)
      mapInstanceRef.current.setLevel(4);
    } else {
      // 보호소를 선택 해제했거나 없으면? 전체 마커 보이게
      fitBoundsToAllMarkers();
    }
  }, [selectedShelter]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}
