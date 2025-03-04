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
export default function KakaoMap({ width, height, centerLat, centerLng, markers, selectedShelter, }: KakaoMapProps): import("react/jsx-runtime").JSX.Element;
export {};
