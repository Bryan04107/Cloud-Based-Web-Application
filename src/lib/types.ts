export type HotspotType = 'guide' | 'code' | 'mcq_single' | 'mcq_multi';

export interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  
  type: HotspotType;
  isBonus: boolean;
  points: number;
  lockedBy?: string;
  lockBehavior: 'hidden' | 'visible_locked';

  content: {
    question: string;
    solution: string;
    options?: string[];
  };
  
  isSolved?: boolean;
}

export interface EscapeRoomConfig {
  id?: string;
  title: string;
  timerMinutes: number;
  penaltySeconds: number;
  backgroundImage: string;
  hotspots: Hotspot[];
}