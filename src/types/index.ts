export interface Score {
  id: string
  name: string
  url: string
  type: 'pdf' | 'image'
  uploadedAt: Date
}

export interface Marker {
  id: string
  x: number
  y: number
  page: number
  note?: string
  createdAt: Date
}

export type PracticeMode = 'practice' | 'performance'

export interface PracticeSettings {
  mode: PracticeMode
  loopStart?: number
  loopEnd?: number
  autoTurnPage: boolean
  pageTurnDelay: number // 秒
  voiceControlEnabled: boolean
}

