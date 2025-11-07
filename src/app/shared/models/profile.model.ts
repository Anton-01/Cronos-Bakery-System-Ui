/**
 * User profile response
 */
export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  personalData: PersonalData;
  businessData?: BusinessData;
  preferences: UserPreferences;
  profilePictureUrl?: string;
  coverPictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Personal data
 */
export interface PersonalData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

/**
 * Personal data request
 */
export interface PersonalDataRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

/**
 * Business data
 */
export interface BusinessData {
  businessName: string;
  taxId?: string;
  businessType?: string;
  website?: string;
  businessAddress?: string;
  businessCity?: string;
  businessState?: string;
  businessCountry?: string;
  businessPostalCode?: string;
  businessPhone?: string;
  businessEmail?: string;
  socialMedia?: SocialMedia;
}

/**
 * Business data request
 */
export interface BusinessDataRequest {
  businessName: string;
  taxId?: string;
  businessType?: string;
  website?: string;
  businessAddress?: string;
  businessCity?: string;
  businessState?: string;
  businessCountry?: string;
  businessPostalCode?: string;
  businessPhone?: string;
  businessEmail?: string;
  socialMedia?: SocialMedia;
}

/**
 * Social media links
 */
export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  pushNotifications: boolean;
  lowStockAlerts: boolean;
  priceChangeAlerts: boolean;
}

/**
 * Preferences request
 */
export interface PreferencesRequest {
  language?: string;
  currency?: string;
  timezone?: string;
  dateFormat?: string;
  theme?: 'light' | 'dark' | 'auto';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  lowStockAlerts?: boolean;
  priceChangeAlerts?: boolean;
}

/**
 * User session response
 */
export interface UserSessionResponse {
  id: string;
  userId: number;
  username: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  location?: string;
  isCurrentSession: boolean;
  createdAt: string;
  lastAccessedAt: string;
  expiresAt: string;
}

/**
 * Device info
 */
export interface DeviceInfo {
  deviceType: string;
  browser: string;
  os: string;
  isTrusted: boolean;
}

/**
 * Device fingerprint response
 */
export interface DeviceFingerprintResponse {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  isTrusted: boolean;
  lastUsed: string;
  addedAt: string;
}
