// User
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// API Key
export interface ApiKey {
  id: string;
  key: string;
  name: string;
  websiteUrl?: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  lastUsedAt?: string;
}

// Analytics
export interface AnalyticsOverview {
  totalVisits: number;
  uniqueVisitors: number;
  totalPageViews: number;
  avgPageViewsPerVisitor: number;
  topCountry: string;
  topBrowser: string;
  topDevice: string;
}

export interface PageStats {
  url: string;
  views: number;
  uniqueVisitors: number;
}

export interface ReferrerStats {
  referrer: string;
  visits: number;
  percentage: number;
}

export interface CountryStats {
  country: string;
  countryCode: string;
  visitors: number;
  percentage: number;
}

export interface DeviceStats {
  device: string;
  visitors: number;
  percentage: number;
}

export interface BrowserStats {
  browser: string;
  visitors: number;
  percentage: number;
}

export interface Visitor {
  id: string;
  ipAddress: string;
  country: string;
  city: string;
  browser: string;
  device: string;
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}