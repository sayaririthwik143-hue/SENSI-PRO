import { DeviceSpecs } from './types';

export const BRANDS = [
  'Redmi', 'Xiaomi', 'Poco', 'Vivo', 'iQOO', 'Realme', 'Samsung', 
  'Oppo', 'OnePlus', 'Infinix', 'Tecno', 'Motorola', 'Asus', 'Apple'
];

export const POPULAR_DEVICES: DeviceSpecs[] = [
  { brand: 'Redmi', model: 'Note 14 5G', ram: 8, refreshRate: 120, processor: 'Dimensity 7050', gyroscope: true, screenSize: '6.67"' },
  { brand: 'Poco', model: 'X6 Pro', ram: 12, refreshRate: 120, processor: 'Dimensity 8300 Ultra', gyroscope: true, screenSize: '6.67"' },
  { brand: 'Samsung', model: 'S24 Ultra', ram: 12, refreshRate: 120, processor: 'Snapdragon 8 Gen 3', gyroscope: true, screenSize: '6.8"' },
  { brand: 'iPhone', model: '15 Pro Max', ram: 8, refreshRate: 120, processor: 'A17 Pro', gyroscope: true, screenSize: '6.7"' },
  { brand: 'iQOO', model: '12', ram: 16, refreshRate: 144, processor: 'Snapdragon 8 Gen 3', gyroscope: true, screenSize: '6.78"' },
];

export const PLAY_STYLES = ['aggressive', 'balanced', 'long-range'];
export const AIM_TYPES = ['drag', 'gyro'];
export const FOCUS_MODES = ['headshots', 'stability'];
export const DEVICE_FEELS = ['smooth', 'average', 'laggy'];
export const CONTROL_TYPES = ['claw', 'thumb'];
export const AIM_PROBLEMS = [
  'none', 
  'crosshair-too-high', 
  'drag-too-hard', 
  'overshooting', 
  'weak-headshot-pull',
  'shaky-red-dot',
  'stiff-movement'
];

export const DRAG_RESPONSE = ['perfect', 'slow', 'fast'];
export const SCOPE_STABILITY = ['perfect', 'shaking', 'stiff'];
