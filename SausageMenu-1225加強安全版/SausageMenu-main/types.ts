export enum TargetLanguage {
  ChineseTW = '繁體中文',
  English = 'English',
  Korean = '한국어',
  French = 'Français',
  Spanish = 'Español',
  Thai = 'ไทย',
  Filipino = 'Tagalog',
  Vietnamese = 'Tiếng Việt',
  Japanese = '日本語'
}

export interface MenuOption {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string; // Frontend generated ID
  originalName: string;
  translatedName: string;
  price: number; // Base price
  category?: string;
  options?: MenuOption[]; // For dual pricing (e.g. Small/Large)
  shortDescription?: string;
  allergy_warning?: boolean;
  dietary_tags?: string[];
  allergens?: string[]; // Specific detected allergens
}

export interface TokenUsage {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}

export interface MenuData {
  items: MenuItem[];
  originalCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  detectedLanguage: string;
  restaurantName?: string; // For navigation
  usageMetadata?: TokenUsage; // Feature: Token Usage Tracking
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type Cart = Record<string, CartItem>;

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface HistoryRecord {
  id: string;
  timestamp: number;
  items: CartItem[];
  totalOriginalPrice: number;
  currency: string;
  restaurantName?: string;
  paidBy?: string; // Who paid first
  location?: GeoLocation; // GPS Coordinates
  taxRate?: number;
  serviceRate?: number;
}

export interface AppSettings {
  apiKey: string;
  taxRate: number;
  serviceRate: number;
}

export type AppState = 'welcome' | 'processing' | 'ordering' | 'summary' | 'history';