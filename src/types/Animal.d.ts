// src/types/Animal.d.ts
export interface Animal {
  id: number;
  name: string;
  imageUrl?: string;
  providerShelterName?: string;
  providerShelterId?: number; // 백엔드가 주는 필드
  neuteredStatus?: string;
  characteristics?: string[];
  // 필요하면 추가 필드...
}
