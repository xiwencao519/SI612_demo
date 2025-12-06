export interface Score {
  id: string
  name: string
  url: string // Single page image URL or first page URL
  urls?: string[] // Array of URLs for multi-page images (optional)
  type: 'pdf' | 'image'
  uploadedAt: Date
}

export interface Marker {
  id: string
  x: number
  y: number
  page: number
  note?: string
  type?: 'correct' | 'error' | 'manual' // Marker type
  createdAt: Date
}

// Note data interface
export interface NoteData {
  noteName: string // Simple note name, e.g., 'do', 're', 'mi'
  x: number // X coordinate on score (percentage)
  y: number // Y coordinate on score (percentage)
  staffIndex: number // Which staff it belongs to (0-based)
  noteIndex: number // Position in staff (0-based)
  page?: number // Page number (optional, default is 1)
}

// Score note data
export interface ScoreNoteData {
  scoreId: string
  notes: NoteData[] // List of all notes
  notesByStaff: NoteData[][] // Notes grouped by staff
}

export type PracticeMode = 'practice' | 'performance'

export interface PracticeSettings {
  mode: PracticeMode
  loopStart?: number
  loopEnd?: number
  autoTurnPage: boolean
  pageTurnDelay: number // Seconds
  voiceControlEnabled: boolean
}

// Practice record interface
export interface PracticeRecord {
  id: string
  scoreId: string
  scoreName: string
  timestamp: Date
  markers: Marker[] // All markers at the time of recording
  totalMarkers: number
  autoDetectedMarkers: number
  manualMarkers: number
  practiceMode: PracticeMode
  currentPage: number
  totalPages: number
}



