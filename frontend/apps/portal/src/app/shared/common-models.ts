export interface UserProfileModel {
  Id: string | number;   // depending on your backend type
  FirstName: string;
  LastName: string;
  MailingAddress: string;
  AlternativeAddress?: string;
  PhoneNumber: string;
  AlternativePhone?: string;
  DateOfBirth: string;   // ISO string: YYYY-MM-DD
  GstNumber?: string;
  Gender: string;        // "Male" | "Female" | "Other"
  
  // Account Settings
  Email?: string;        // User email address
  Password?: string;     // Password (optional, only sent when updating)
  Role?: string;         // User role (e.g., "CompanyAdmin")
  
  // My Preferences
  EnableWebNotification?: string;      // "yes" | "no"
  EnableEmailNotification?: string;    // "yes" | "no"
  Language?: string;                   // "english" | "hindi"
  HiddenTopbarMenus?: string;          // Comma-separated list of hidden menu items
  DisableKeyboardShortcuts?: string;    // "yes" | "no"
}