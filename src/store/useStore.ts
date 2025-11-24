import { create } from 'zustand'
import { Score, Marker, PracticeSettings, PracticeMode } from '../types'
import { getDefaultScores } from '../utils/defaultScores'

interface AppState {
  scores: Score[]
  currentScore: Score | null
  markers: Marker[]
  practiceSettings: PracticeSettings
  currentPage: number
  totalPages: number
  isPlaying: boolean
  autoErrorTracking: boolean
  
  // Actions
  setScores: (scores: Score[]) => void
  addScore: (score: Score) => void
  setCurrentScore: (score: Score | null) => void
  addMarker: (marker: Marker) => void
  removeMarker: (id: string) => void
  setPracticeMode: (mode: PracticeMode) => void
  setPracticeSettings: (settings: Partial<PracticeSettings>) => void
  setCurrentPage: (page: number) => void
  setTotalPages: (pages: number) => void
  setIsPlaying: (playing: boolean) => void
  setLoopRange: (start?: number, end?: number) => void
  setAutoErrorTracking: (enabled: boolean) => void
  initializeDefaultScores: () => void
}

// Check if default scores have been initialized
let defaultScoresInitialized = false

export const useStore = create<AppState>((set, get) => ({
  scores: [],
  currentScore: null,
  markers: [],
  practiceSettings: {
    mode: 'practice',
    autoTurnPage: false,
    pageTurnDelay: 3,
    voiceControlEnabled: false,
  },
  currentPage: 1,
  totalPages: 1,
  isPlaying: false,
  autoErrorTracking: true,

  setScores: (scores) => set({ scores }),
  addScore: (score) => set((state) => ({ scores: [...state.scores, score] })),
  setCurrentScore: (score) => set({ currentScore: score }),
  addMarker: (marker) => set((state) => ({ markers: [...state.markers, marker] })),
  removeMarker: (id) => set((state) => ({ 
    markers: state.markers.filter(m => m.id !== id) 
  })),
  setPracticeMode: (mode) => set((state) => ({
    practiceSettings: { ...state.practiceSettings, mode }
  })),
  setPracticeSettings: (settings) => set((state) => ({
    practiceSettings: { ...state.practiceSettings, ...settings }
  })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setLoopRange: (start, end) => set((state) => ({
    practiceSettings: {
      ...state.practiceSettings,
      loopStart: start,
      loopEnd: end,
    }
  })),
  setAutoErrorTracking: (enabled) => set({ autoErrorTracking: enabled }),
  initializeDefaultScores: () => {
    if (!defaultScoresInitialized) {
      const defaultScores = getDefaultScores()
      const currentScores = get().scores
      // Only add scores that don't exist
      const newScores = defaultScores.filter(
        ds => !currentScores.some(cs => cs.id === ds.id)
      )
      if (newScores.length > 0) {
        set((state) => ({ scores: [...state.scores, ...newScores] }))
      }
      defaultScoresInitialized = true
    }
  },
}))

