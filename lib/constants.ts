export const Role = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
} as const;

export const Track = {
  WEB: 'WEB',
  ANDROID: 'ANDROID',
  UIUX: 'UI/UX',
  DEVOPS: 'DEVOPS',
  IOT: 'IoT',
  QA: 'QUALITY ASSURANCE',
} as const;

export type Role = typeof Role[keyof typeof Role];
export type Track = typeof Track[keyof typeof Track];