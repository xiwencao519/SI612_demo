import { create } from 'zustand'
import { Score, Marker, PracticeSettings, PracticeMode, ScoreNoteData, PracticeRecord } from '../types'
import { getDefaultScores, getTwinkleTwinkleNoteData, getTwinkleTwinkleNoteDataCopy } from '../utils/defaultScores'

interface AppState {
  scores: Score[]
  currentScore: Score | null
  markers: Marker[]
  practiceSettings: PracticeSettings
  currentPage: number
  totalPages: number
  isPlaying: boolean
  scoreNoteData: ScoreNoteData | null // Current score's note data
  currentNoteIndex: number // Index of note currently expected to be played
  sectionComplete: boolean // Whether the entire section is complete
  practiceRecords: PracticeRecord[] // All practice records
  
  // Actions
  setScores: (scores: Score[]) => void
  addScore: (score: Score) => void
  setCurrentScore: (score: Score | null) => void
  addMarker: (marker: Marker) => void
  removeMarker: (id: string) => void
  setMarkers: (markers: Marker[]) => void
  setPracticeMode: (mode: PracticeMode) => void
  setPracticeSettings: (settings: Partial<PracticeSettings>) => void
  setCurrentPage: (page: number) => void
  setTotalPages: (pages: number) => void
  setIsPlaying: (playing: boolean) => void
  setLoopRange: (start?: number, end?: number) => void
  initializeDefaultScores: () => void
  setScoreNoteData: (data: ScoreNoteData | null) => void
  setCurrentNoteIndex: (index: number) => void
  resetCurrentNoteIndex: () => void
  setSectionComplete: (complete: boolean) => void
  addPracticeRecord: (record: PracticeRecord) => void
  removePracticeRecord: (id: string) => void
  restorePracticeRecord: (recordId: string) => boolean
  clearAllMarkers: () => void
  resetPracticeState: () => void
  saveCurrentPracticeAndReset: () => void
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
  scoreNoteData: null,
  currentNoteIndex: 0,
  sectionComplete: false,
  practiceRecords: [],

  setScores: (scores) => set({ scores }),
  addScore: (score) => set((state) => ({ scores: [...state.scores, score] })),
  setCurrentScore: (score) => {
    set({ currentScore: score, sectionComplete: false })
    // If it's Twinkle Twinkle score, load note data
    if (score?.id === 'default-5') {
      set({ scoreNoteData: getTwinkleTwinkleNoteData(), currentNoteIndex: 0 })
    } else if (score?.id === 'default-6') {
      set({ scoreNoteData: getTwinkleTwinkleNoteDataCopy(), currentNoteIndex: 0 })
    } else {
      set({ scoreNoteData: null, currentNoteIndex: 0 })
    }
  },
  addMarker: (marker) => set((state) => ({ markers: [...state.markers, marker] })),
  removeMarker: (id) => set((state) => ({ 
    markers: state.markers.filter(m => m.id !== id) 
  })),
  setMarkers: (markers) => set({ markers }),
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
  setScoreNoteData: (data) => set({ scoreNoteData: data }),
  setCurrentNoteIndex: (index) => set({ currentNoteIndex: index }),
  resetCurrentNoteIndex: () => set({ currentNoteIndex: 0 }),
  setSectionComplete: (complete) => set({ sectionComplete: complete }),
  addPracticeRecord: (record) => set((state) => {
    // Keep only the latest 50 records
    const newRecords = [record, ...state.practiceRecords].slice(0, 50)
    return { practiceRecords: newRecords }
  }),
  removePracticeRecord: (id) => set((state) => ({
    practiceRecords: state.practiceRecords.filter(r => r.id !== id)
  })),
  restorePracticeRecord: (recordId) => {
    const state = get()
    const record = state.practiceRecords.find(r => r.id === recordId)
    if (!record) {
      return false
    }
    
    // Find the score
    const score = state.scores.find(s => s.id === record.scoreId)
    if (!score) {
      return false
    }
    
    // Filter out correct markers, only keep error and manual markers
    const errorMarkers = record.markers.filter(m => m.type !== 'correct')
    
    // Set the score
    state.setCurrentScore(score)
    
    // Set markers (only error markers)
    state.setMarkers([...errorMarkers])
    
    // Set page - always restore to page 1
    state.setCurrentPage(1)
    state.setTotalPages(record.totalPages)
    
    // Set practice mode
    state.setPracticeMode(record.practiceMode)
    
    // Reset practice state
    state.resetPracticeState()
    
    return true
  },
  clearAllMarkers: () => set({ markers: [] }),
  resetPracticeState: () => set((state) => ({
    isPlaying: false,
    currentNoteIndex: 0,
    sectionComplete: false,
    practiceSettings: {
      ...state.practiceSettings,
      loopStart: undefined,
      loopEnd: undefined,
    },
  })),
  saveCurrentPracticeAndReset: () => {
    const state = get()
    const { currentScore, markers, practiceSettings, currentPage, totalPages } = state
    
    if (currentScore && markers.length > 0) {
      // Filter out correct markers - only count error markers
      const errorMarkers = markers.filter(m => m.type !== 'correct')
      
      // Calculate marker statistics (only for error markers)
      const autoDetectedMarkers = errorMarkers.filter(m => m.id.startsWith('auto-')).length
      const manualMarkers = errorMarkers.length - autoDetectedMarkers
      
      // Create practice record
      const record: PracticeRecord = {
        id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        scoreId: currentScore.id,
        scoreName: currentScore.name,
        timestamp: new Date(),
        markers: [...markers], // Deep copy all markers (including correct ones for restore)
        totalMarkers: errorMarkers.length, // Only count error markers
        autoDetectedMarkers,
        manualMarkers,
        practiceMode: practiceSettings.mode,
        currentPage,
        totalPages,
      }
      
      // Save record
      state.addPracticeRecord(record)
    }
    
    // Clear markers and reset state
    state.clearAllMarkers()
    state.resetPracticeState()
  },
}))

