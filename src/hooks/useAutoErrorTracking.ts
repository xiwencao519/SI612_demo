import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

interface ErrorDetectionConfig {
  enabled: boolean
  detectionInterval: number // Detection interval (milliseconds)
  errorProbability: number // Error detection probability (0-1)
  minTimeOnPage: number // Minimum time on page (milliseconds) before error detection
}

const defaultConfig: ErrorDetectionConfig = {
  enabled: true,
  detectionInterval: 5000, // Detect every 5 seconds
  errorProbability: 0.3, // 30% probability of detecting an error
  minTimeOnPage: 3000, // At least 3 seconds on page
}

export function useAutoErrorTracking(config: Partial<ErrorDetectionConfig> = {}) {
  const {
    currentPage,
    totalPages,
    isPlaying,
    practiceSettings,
    markers,
    addMarker,
  } = useStore()

  const configRef = useRef({ ...defaultConfig, ...config })
  const pageStartTimeRef = useRef<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const detectedErrorsRef = useRef<Set<string>>(new Set()) // Track detected error positions

  useEffect(() => {
    // Reset time when page changes
    pageStartTimeRef.current = Date.now()
    detectedErrorsRef.current.clear()
  }, [currentPage])

  useEffect(() => {
    // Clear previous timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Only enable auto error tracking in practice mode when playing
    if (
      configRef.current.enabled &&
      practiceSettings.mode === 'practice' &&
      isPlaying &&
      currentPage <= totalPages
    ) {
      const timeOnPage = Date.now() - pageStartTimeRef.current

      // Only start detection after staying on page long enough
      if (timeOnPage >= configRef.current.minTimeOnPage) {
        intervalRef.current = setInterval(() => {
          // Simulate error detection logic
          const shouldDetectError = Math.random() < configRef.current.errorProbability

          if (shouldDetectError) {
            // Generate a random error position (avoid duplicates)
            const maxAttempts = 10
            let attempts = 0
            let errorX: number
            let errorY: number
            let errorKey: string

            do {
              // Generate error position in middle area of score (more realistic)
              errorX = 30 + Math.random() * 40 // 30-70% X position
              errorY = 20 + Math.random() * 60 // 20-80% Y position
              errorKey = `${currentPage}-${Math.floor(errorX)}-${Math.floor(errorY)}`
              attempts++
            } while (detectedErrorsRef.current.has(errorKey) && attempts < maxAttempts)

            // If new position found, add marker
            if (!detectedErrorsRef.current.has(errorKey)) {
              const marker = {
                id: `auto-${Date.now()}-${Math.random()}`,
                x: errorX,
                y: errorY,
                page: currentPage,
                note: 'Auto-detected possible error',
                createdAt: new Date(),
              }

              addMarker(marker)
              detectedErrorsRef.current.add(errorKey)

              // Limit maximum auto-detected errors per page
              const autoMarkersOnPage = markers.filter(
                m => m.page === currentPage && m.id.startsWith('auto-')
              )
              if (autoMarkersOnPage.length >= 5) {
                // If 5 errors already detected, reduce detection probability
                configRef.current.errorProbability = 0.1
              }
            }
          }
        }, configRef.current.detectionInterval)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [
    isPlaying,
    practiceSettings.mode,
    currentPage,
    totalPages,
    addMarker,
    markers,
  ])

  // Reset detection probability when playback stops
  useEffect(() => {
    if (!isPlaying) {
      configRef.current.errorProbability = defaultConfig.errorProbability
    }
  }, [isPlaying])
}

