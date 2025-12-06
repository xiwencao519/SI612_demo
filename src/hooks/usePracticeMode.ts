import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

export function usePracticeMode() {
  const {
    practiceSettings,
    currentPage,
    totalPages,
    setCurrentPage,
    isPlaying,
    setLoopRange,
  } = useStore()
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const loopStartRef = useRef<number | null>(null)

  useEffect(() => {
    // Clear previous timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Performance mode: auto turn page
    if (
      practiceSettings.mode === 'performance' &&
      practiceSettings.autoTurnPage &&
      isPlaying &&
      currentPage < totalPages
    ) {
      intervalRef.current = setInterval(() => {
        setCurrentPage(currentPage + 1)
      }, practiceSettings.pageTurnDelay * 1000)
    }

    // Practice mode: loop playback
    if (
      practiceSettings.mode === 'practice' &&
      isPlaying &&
      practiceSettings.loopStart &&
      practiceSettings.loopEnd
    ) {
      const loopStart = practiceSettings.loopStart
      const loopEnd = practiceSettings.loopEnd
      
      if (currentPage >= loopEnd) {
        // Loop back to start
        setTimeout(() => {
          setCurrentPage(loopStart)
        }, 500)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [
    practiceSettings.mode,
    practiceSettings.autoTurnPage,
    practiceSettings.pageTurnDelay,
    practiceSettings.loopStart,
    practiceSettings.loopEnd,
    currentPage,
    totalPages,
    isPlaying,
    setCurrentPage,
  ])

  // Clear timer when playback stops
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isPlaying])
}



