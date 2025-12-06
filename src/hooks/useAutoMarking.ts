import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

export function useAutoMarking() {
  const {
    currentScore,
    scoreNoteData,
    isPlaying,
  } = useStore()

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const noteIndexRef = useRef<number>(0)
  const isInitializedRef = useRef<boolean>(false)

  useEffect(() => {
    // Only work for default-6 (new Twinkle Twinkle copy)
    const isTargetScore = currentScore?.id === 'default-6'
    
    if (!isTargetScore || !scoreNoteData || !isPlaying) {
      // Clear interval if conditions not met
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      isInitializedRef.current = false
      return
    }

    // Reset note index when starting to play (only once)
    if (isPlaying && !isInitializedRef.current) {
      noteIndexRef.current = 0
      const state = useStore.getState()
      state.setCurrentNoteIndex(0)
      isInitializedRef.current = true
    }

    // Start auto-marking interval
    intervalRef.current = setInterval(() => {
      const state = useStore.getState()
      
      // Double check conditions
      if (state.currentScore?.id !== 'default-6' || !state.scoreNoteData || !state.isPlaying) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return
      }

      const currentNoteIdx = noteIndexRef.current
      const notes = state.scoreNoteData.notes
      
      // Check if we've marked all notes
      if (currentNoteIdx >= notes.length) {
        // All notes marked, stop
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        state.setIsPlaying(false)
        // Trigger section complete feedback
        state.setSectionComplete(true)
        isInitializedRef.current = false
        return
      }

      const note = notes[currentNoteIdx]
      if (!note) {
        // No more notes, stop
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        state.setIsPlaying(false)
        // Trigger section complete feedback
        state.setSectionComplete(true)
        isInitializedRef.current = false
        return
      }

      // Check if we need to turn page
      const notePage = note.page || 1
      if (notePage > state.currentPage) {
        // Turn to next page first
        state.setCurrentPage(notePage)
        // Mark note after page change (slight delay to ensure page is loaded)
        setTimeout(() => {
          markNote(note, currentNoteIdx)
        }, 300)
      } else {
        // Mark the note immediately
        markNote(note, currentNoteIdx)
      }
    }, 1000) // Every 1 second

    const markNote = (note: typeof notes[0], noteIdx: number) => {
      const state = useStore.getState()
      
      // Get latest markers from state
      const currentMarkers = state.markers
      
      // Check if marker already exists for this note (avoid duplicates)
      const existingMarker = currentMarkers.find(
        m => m.page === (note.page || 1) &&
        Math.abs(m.x - note.x) < 0.5 &&
        Math.abs(m.y - note.y) < 0.5
      )

      if (!existingMarker) {
        // Special cases for errors:
        // 10th note (index 9) should be 'mi' but user played 'fa'
        // 15th note (index 14) should be 'so' but user played 'la'
        const isTenthNote = noteIdx === 9
        const isFifteenthNote = noteIdx === 14
        const isExpectedMi = note.noteName === 'mi'
        const isExpectedSo = note.noteName === 'so'
        
        let markerType: 'correct' | 'error' = 'correct'
        let markerNote = note.noteName
        
        if (isTenthNote && isExpectedMi) {
          // This is the 10th note which should be mi, but user played fa
          markerType = 'error'
          markerNote = 'Expected mi, played fa' // Show error description in English
        } else if (isFifteenthNote && isExpectedSo) {
          // This is the 15th note which should be so, but user played la
          markerType = 'error'
          markerNote = 'Expected so, played la' // Show error description in English
        }
        
        // Create marker
        const marker = {
          id: `auto-${markerType === 'error' ? 'error' : 'correct'}-${Date.now()}-${noteIdx}`,
          x: note.x,
          y: note.y,
          page: note.page || 1,
          note: markerNote,
          type: markerType,
          createdAt: new Date(),
        }
        state.addMarker(marker)
      }

      // Move to next note
      noteIndexRef.current = noteIdx + 1
      state.setCurrentNoteIndex(noteIdx + 1)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [
    currentScore?.id,
    scoreNoteData,
    isPlaying,
  ])

  // Reset when stopping
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      isInitializedRef.current = false
    }
  }, [isPlaying])
}

