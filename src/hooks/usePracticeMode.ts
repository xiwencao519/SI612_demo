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
    // 清除之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // 表演模式：自动翻页
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

    // 练习模式：循环播放
    if (
      practiceSettings.mode === 'practice' &&
      isPlaying &&
      practiceSettings.loopStart &&
      practiceSettings.loopEnd
    ) {
      const loopStart = practiceSettings.loopStart
      const loopEnd = practiceSettings.loopEnd
      
      if (currentPage >= loopEnd) {
        // 循环回到开始
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

  // 当停止播放时清除定时器
  useEffect(() => {
    if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isPlaying])
}

