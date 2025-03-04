/** 한 마리 동물 데이터 타입 */
export interface Animal {
    desertionNo: string;
    filename?: string;
    happenDt?: string;
    happenPlace?: string;
    kindCd: string;
    colorCd?: string;
    age: string;
    weight?: string;
    noticeNo?: string;
    noticeSdt?: string;
    noticeEdt: string;
    popfile?: string;
    processState?: string;
    sexCd: "M" | "F" | "Q";
    neuterYn?: string;
    specialMark?: string;
    careNm?: string;
    careTel?: string;
    careAddr?: string;
    orgNm?: string;
    chargeNm?: string;
    officetel?: string;
}
/** API가 반환하는 응답 구조 */
export interface AnimalsResponse {
    response?: {
        header?: {
            reqNo?: number;
            resultCode?: string;
            resultMsg?: string;
        };
        body?: {
            totalCount?: string;
            items?: {
                item?: Animal[];
            };
        };
    };
}
/** API 호출 파라미터 */
export interface FetchAnimalsParams {
    pageNo: number;
    numOfRows: number;
    signal?: AbortSignal;
}
export default function fetchAnimals({ pageNo, numOfRows, signal, }: FetchAnimalsParams): Promise<AnimalsResponse>;
