export const Roles = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT'
} as const

export const Tracks = {
  WEB: 'WEB',
  ANDROID: 'ANDROID',
  UI_UX: 'UI_UX',
  DEVOPS: 'DEVOPS',
  IOT: 'IOT',
  QUALITY_ASSURANCE: 'QUALITY_ASSURANCE'
} as const

export type Role = typeof Roles[keyof typeof Roles]
export type Track = typeof Tracks[keyof typeof Tracks] 