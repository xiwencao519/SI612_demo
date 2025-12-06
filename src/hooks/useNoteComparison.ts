import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { usePitchDetection } from './usePitchDetection'
import { frequencyToNoteName, notesMatch } from '../utils/pitchUtils'
import { NoteData, Marker } from '../types'

// Note duration threshold (ms) - A note must last this long to be considered played
const NOTE_DURATION_THRESHOLD = 300

/**
 * Real-time note comparison Hook
 * When user plays, detects pitch and compares with expected note
 */
export function useNoteComparison() {
  const {
    currentScore,
    scoreNoteData,
    currentNoteIndex,
    setCurrentNoteIndex,
    resetCurrentNoteIndex,
    isPlaying,
    practiceSettings,
    addMarker,
    markers,
    currentPage,
    totalPages,
    setCurrentPage,
    setSectionComplete,
  } = useStore()

  // Track currently detected note and duration
  const detectedNoteRef = useRef<string | null>(null)
  const noteStartTimeRef = useRef<number | null>(null)
  const lastProcessedNoteIndexRef = useRef<number>(-1)
  const lastProcessedTimeRef = useRef<number>(0) // Record last processing time to avoid too fast duplicate processing
  const lastProcessedNoteNameRef = useRef<string | null>(null) // Record last processed note name
  const isWaitingForSilenceRef = useRef<boolean>(false) // Whether waiting for silence to avoid duplicate detection of same note
  const silenceStartTimeRef = useRef<number | null>(null) // Silence start time

  // Check if detection should be enabled
  const shouldEnableDetection = Boolean(
    isPlaying &&
    currentScore?.id === 'default-5' &&
    scoreNoteData !== null &&
    practiceSettings.voiceControlEnabled
  )

  // Handle detected pitch
  const handlePitchDetected = useCallback(
    (frequency: number | null) => {
      // Get latest state in real-time to avoid closure issues
      const currentState = useStore.getState()
      const latestScoreNoteData = currentState.scoreNoteData
      const latestCurrentNoteIndex = currentState.currentNoteIndex
      const latestIsPlaying = currentState.isPlaying
      const latestVoiceControlEnabled = currentState.practiceSettings.voiceControlEnabled
      
      // If detection not enabled, return immediately
      if (!latestIsPlaying || currentScore?.id !== 'default-5' || !latestScoreNoteData || !latestVoiceControlEnabled) {
        return
      }

      // Convert frequency to note name
      const detectedNote = frequency ? frequencyToNoteName(frequency) : null

      // Check if there is an expected note
      if (
        latestCurrentNoteIndex < 0 ||
        latestCurrentNoteIndex >= latestScoreNoteData.notes.length
      ) {
        return
      }
      
      const expectedNote = latestScoreNoteData.notes[latestCurrentNoteIndex]
      const currentPageState = currentState.currentPage
      
      // If expected note is not on current page, don't detect
      if ((expectedNote.page || 1) !== currentPageState) {
        return
      }

      // If waiting for silence, check if silence has lasted long enough or different note detected
      if (isWaitingForSilenceRef.current) {
        // If different new note detected, it must last for a certain duration to be considered valid
        if (detectedNote && detectedNote !== lastProcessedNoteNameRef.current) {
          // If detected note is different from currently tracked one, restart timing
          if (detectedNoteRef.current !== detectedNote) {
            detectedNoteRef.current = detectedNote
            noteStartTimeRef.current = Date.now()
            console.log(`[Note Comparison] Detected possible new note ${detectedNote}, starting validation...`)
            return
          }
          
          // If new note has lasted at least 150ms, consider it valid
          if (noteStartTimeRef.current && Date.now() - noteStartTimeRef.current >= 150) {
            isWaitingForSilenceRef.current = false
            silenceStartTimeRef.current = null
            lastProcessedNoteNameRef.current = null
            console.log(`[Note Comparison] New note ${detectedNote} validated successfully (lasted ${Date.now() - noteStartTimeRef.current}ms), allowing detection`)
            // Continue to subsequent logic, don't return
          } else {
            // New note duration not long enough, continue waiting
            return
          }
        } else if (!detectedNote) {
          // Silence detected, reset new note validation state
          if (detectedNoteRef.current) {
            detectedNoteRef.current = null
            noteStartTimeRef.current = null
          }
          // Silence detected
          if (!silenceStartTimeRef.current) {
            silenceStartTimeRef.current = Date.now()
          } else if (Date.now() - silenceStartTimeRef.current >= 200) {
            // Silence lasted over 200ms, can detect new note now
            isWaitingForSilenceRef.current = false
            silenceStartTimeRef.current = null
            lastProcessedNoteNameRef.current = null
            detectedNoteRef.current = null // Clear detection state
            noteStartTimeRef.current = null
            console.log('[Note Comparison] Silence detection complete, can detect new note')
          }
          return // Don't detect during silence waiting period
        } else {
          // Still detecting same note, reset silence timer
          silenceStartTimeRef.current = null
          return // Same note, wait for silence
        }
      }

      // If new note detected, reset timer
      if (detectedNote !== detectedNoteRef.current) {
        detectedNoteRef.current = detectedNote
        noteStartTimeRef.current = detectedNote ? Date.now() : null
        return
      }

      // If note lasted long enough, compare
      if (
        detectedNote &&
        detectedNoteRef.current &&
        noteStartTimeRef.current &&
        Date.now() - noteStartTimeRef.current >= NOTE_DURATION_THRESHOLD
      ) {
        const now = Date.now()
        // Avoid duplicate processing: either new index or more than 500ms since last processing
        const isNewIndex = lastProcessedNoteIndexRef.current !== latestCurrentNoteIndex
        const enoughTimePassed = now - lastProcessedTimeRef.current > 500
        
        if (isNewIndex || enoughTimePassed) {
          const isCorrect = notesMatch(detectedNote, expectedNote.noteName)

          console.log(
            `[Note Comparison] Detected: ${detectedNote}, Expected: ${expectedNote.noteName}, Index: ${latestCurrentNoteIndex}, Correct: ${isCorrect}, Duration: ${now - noteStartTimeRef.current!}ms`
          )

          // Create marker (use note's page number, or current page if not available)
          const marker: Marker = {
            id: `note-${latestCurrentNoteIndex}-${Date.now()}`,
            x: expectedNote.x,
            y: expectedNote.y,
            page: expectedNote.page || currentPage,
            note: isCorrect
              ? `✓ Correct: ${expectedNote.noteName}`
              : `✗ Error: Detected ${detectedNote}, Expected ${expectedNote.noteName}`,
            type: isCorrect ? 'correct' : 'error',
            createdAt: new Date(),
          }

          currentState.addMarker(marker)
          
          // Update processing time and note name
          lastProcessedTimeRef.current = now
          lastProcessedNoteNameRef.current = detectedNote
          
          // Mark as waiting for silence to avoid duplicate detection of same note
          isWaitingForSilenceRef.current = true
          silenceStartTimeRef.current = null

          // If correct, move to next note
          if (isCorrect) {
            const currentPageState = currentState.currentPage
            const totalPagesState = currentState.totalPages
            
            // Check if it's the last note of the entire piece
            const isLastNote = latestCurrentNoteIndex >= latestScoreNoteData.notes.length - 1
            
            // Check if it's the last note of the current page
            // Find all notes on current page
            const currentPageNoteIndices: number[] = []
            latestScoreNoteData.notes.forEach((note, index) => {
              if ((note.page || 1) === currentPageState) {
                currentPageNoteIndices.push(index)
              }
            })
            // Find index of last note on current page
            const lastNoteIndexInPage = currentPageNoteIndices.length > 0 
              ? currentPageNoteIndices[currentPageNoteIndices.length - 1]
              : -1
            const isLastNoteInPage = latestCurrentNoteIndex === lastNoteIndexInPage
            
            if (isLastNote) {
              // Completed entire piece
              console.log('[Note Comparison] Complete! All notes played correctly!')
              currentState.setSectionComplete(true)
              // Mark as processed
              lastProcessedNoteIndexRef.current = latestCurrentNoteIndex
              // Reset detection state
              detectedNoteRef.current = null
              noteStartTimeRef.current = null
              isWaitingForSilenceRef.current = false // Completed, no need to wait for silence
            } else if (isLastNoteInPage && currentPageState < totalPagesState) {
              // Completed last note of current page, auto turn page
              console.log(`[Note Comparison] Completed last note of page ${currentPageState} (index ${latestCurrentNoteIndex}), auto turning to page ${currentPageState + 1}`)
              
              // Mark current note as processed
              lastProcessedNoteIndexRef.current = latestCurrentNoteIndex
              // Reset detection state
              detectedNoteRef.current = null
              noteStartTimeRef.current = null
              
              // Delay page turn to give user some feedback time
              setTimeout(() => {
                const state = useStore.getState()
                const nextPage = currentPageState + 1
                state.setCurrentPage(nextPage)
                
                // Find index of first note on next page
                const nextPageFirstNoteIndex = state.scoreNoteData?.notes.findIndex(
                  note => (note.page || 1) === nextPage
                )
                
                if (nextPageFirstNoteIndex !== undefined && nextPageFirstNoteIndex >= 0) {
                  lastProcessedNoteIndexRef.current = nextPageFirstNoteIndex
                  state.setCurrentNoteIndex(nextPageFirstNoteIndex)
                  console.log(`[Note Comparison] Turned to page ${nextPage}, starting from index ${nextPageFirstNoteIndex}`)
                }
                
                // Reset silence waiting state after page turn
                isWaitingForSilenceRef.current = false
              }, 500) // Delay 500ms before page turn
            } else if (latestCurrentNoteIndex < latestScoreNoteData.notes.length - 1) {
              // Move to next note (within same page)
              const nextIndex = latestCurrentNoteIndex + 1
              console.log(`[Note Comparison] Moving to next note, index: ${nextIndex}, note: ${latestScoreNoteData.notes[nextIndex]?.noteName}`)
              
              // Update index to next (update ref first, then state)
              lastProcessedNoteIndexRef.current = nextIndex
              currentState.setCurrentNoteIndex(nextIndex)
              
              // Reset detection state, ready to detect next note
              detectedNoteRef.current = null
              noteStartTimeRef.current = null
            }
          } else {
            // On error, mark current index as processed to avoid duplicate marking
            lastProcessedNoteIndexRef.current = latestCurrentNoteIndex
            // Reset detection state, allow re-detection of current note (but need to wait for silence first)
            detectedNoteRef.current = null
            noteStartTimeRef.current = null
            console.log(`[Note Comparison] Error, staying at index ${latestCurrentNoteIndex}, waiting for silence before re-detection`)
          }
        }
      }
    },
    [currentScore?.id] // Only depend on currentScore.id which doesn't change frequently
  )

  // Use pitch detection Hook
  const { isListening, error } = usePitchDetection({
    enabled: shouldEnableDetection,
    onPitchDetected: handlePitchDetected,
  })

  // Reset state when playback stops
  useEffect(() => {
    if (!isPlaying) {
      detectedNoteRef.current = null
      noteStartTimeRef.current = null
      lastProcessedNoteIndexRef.current = -1
      lastProcessedTimeRef.current = 0
      lastProcessedNoteNameRef.current = null
      isWaitingForSilenceRef.current = false
      silenceStartTimeRef.current = null
      // Don't reset sectionComplete to let user see completion feedback
    }
  }, [isPlaying])
  
  // Reset completion state when switching scores
  useEffect(() => {
    if (currentScore?.id === 'default-5') {
      setSectionComplete(false)
    }
  }, [currentScore?.id, setSectionComplete])

  // Reset current note index when switching scores or note data changes
  useEffect(() => {
    if (scoreNoteData && currentScore?.id === 'default-5') {
      resetCurrentNoteIndex()
    }
  }, [scoreNoteData, currentScore?.id, resetCurrentNoteIndex])

  // When switching pages, find index of first note on current page
  useEffect(() => {
    if (scoreNoteData && currentScore?.id === 'default-5') {
      const firstNoteIndex = scoreNoteData.notes.findIndex(
        note => (note.page || 1) === currentPage
      )
      if (firstNoteIndex >= 0) {
        // Only jump to first note of page if current index is not on current page
        const currentNote = scoreNoteData.notes[currentNoteIndex]
        if (!currentNote || (currentNote.page || 1) !== currentPage) {
          setCurrentNoteIndex(firstNoteIndex)
          // Reset detection state
          detectedNoteRef.current = null
          noteStartTimeRef.current = null
          lastProcessedNoteIndexRef.current = -1
          isWaitingForSilenceRef.current = false
          console.log(`[Note Comparison] Switched to page ${currentPage}, starting from index ${firstNoteIndex}`)
        }
      }
    }
  }, [scoreNoteData, currentScore?.id, currentPage, currentNoteIndex, setCurrentNoteIndex])

  return {
    isListening,
    error,
    currentNoteIndex,
    totalNotes: scoreNoteData?.notes.length || 0,
    expectedNote: scoreNoteData?.notes[currentNoteIndex] || null,
  }
}

