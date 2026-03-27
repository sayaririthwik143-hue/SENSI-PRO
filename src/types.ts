export type DeviceTier = 'A' | 'B' | 'C' | 'D';

export interface DeviceSpecs {
  brand: string;
  model: string;
  ram: number;
  refreshRate: number;
  processor: string;
  gyroscope: boolean;
  screenSize: string;
}

export interface UserPreferences {
  playStyle: 'aggressive' | 'balanced' | 'long-range';
  aimType: 'drag' | 'gyro';
  focus: 'headshots' | 'stability';
  deviceFeel: 'smooth' | 'average' | 'laggy';
  controls: 'claw' | 'thumb';
  aimProblem?: 'none' | 'crosshair-too-high' | 'drag-too-hard' | 'overshooting' | 'weak-headshot-pull' | 'shaky-red-dot' | 'stiff-movement';
  dragResponse?: 'slow' | 'fast' | 'perfect';
  scopeStability?: 'shaking' | 'stiff' | 'perfect';
}

export interface SensitivitySettings {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniper: number;
  freeLook: number;
  dpi: number;
  gyro?: number;
}

export interface OptimizationResult {
  deviceTier: DeviceTier;
  performanceType: string;
  settings: SensitivitySettings;
  coachAdvice: string;
  hudRecommendation: {
    layout: string;
    buttons: { name: string; size: string; position: string; description: string }[];
  };
  trainingPlan: {
    weapon: string;
    drill: string;
    practice: string;
  };
}
