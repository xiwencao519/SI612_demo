import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useStore } from '../../store/useStore'

interface VoiceControlProps {
  isListening?: boolean
  error?: string | null
  currentNoteIndex?: number
  totalNotes?: number
}

export default function VoiceControl({ 
  isListening: externalIsListening, 
  error: externalError,
  currentNoteIndex,
  totalNotes,
}: VoiceControlProps) {
  const { 
    practiceSettings, 
    setPracticeSettings, 
    setCurrentPage, 
    totalPages, 
    currentPage,
    currentScore,
    isPlaying,
    scoreNoteData,
    currentNoteIndex: storeCurrentNoteIndex,
  } = useStore()
  const [isListening, setIsListening] = useState(false)

  // Check if it's the Twinkle Twinkle score (default-5 or default-6)
  const isTwinkleScore = currentScore?.id === 'default-5' || currentScore?.id === 'default-6'
  
  // Use external isListening (if Twinkle score) or internal state
  const actualIsListening = isTwinkleScore && isPlaying 
    ? (externalIsListening || false)
    : isListening

  useEffect(() => {
    // If not Twinkle score, use the original voice control simulation logic
    if (!isTwinkleScore && practiceSettings.voiceControlEnabled && isListening) {
      const handleVoiceCommand = () => {
        const commands = ['next', 'next page']
        const randomCommand = commands[Math.floor(Math.random() * commands.length)]
        
        setTimeout(() => {
          if (randomCommand.includes('next')) {
            setCurrentPage(Math.min(totalPages, currentPage + 1))
          }
          setIsListening(false)
        }, 1000)
      }

      const timer = setTimeout(handleVoiceCommand, 2000)
      return () => clearTimeout(timer)
    }
  }, [isListening, practiceSettings.voiceControlEnabled, setCurrentPage, totalPages, currentPage, isTwinkleScore])

  const toggleVoiceControl = () => {
    const newValue = !practiceSettings.voiceControlEnabled
    setPracticeSettings({ voiceControlEnabled: newValue })
    if (!isTwinkleScore) {
      if (newValue) {
        setIsListening(true)
      } else {
        setIsListening(false)
      }
    }
  }

  // Get title text
  const getTitle = () => {
    if (externalError) {
      return `Microphone Error: ${externalError}`
    }
    if (isTwinkleScore && isPlaying) {
      if (actualIsListening) {
        return `Detecting audio... (${currentNoteIndex || 0}/${totalNotes || 0})`
      } else {
        return 'Click to enable microphone for note detection'
      }
    }
    return practiceSettings.voiceControlEnabled ? 'Disable Voice Control' : 'Enable Voice Control'
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleVoiceControl}
        className={`p-2 rounded-lg transition-colors relative ${
          practiceSettings.voiceControlEnabled
            ? isTwinkleScore && actualIsListening
              ? 'bg-red-100 text-red-600'
              : 'bg-orange-100 text-orange-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title={getTitle()}
        disabled={isTwinkleScore && !isPlaying}
      >
        {practiceSettings.voiceControlEnabled ? (
          <Mic className={`w-5 h-5 ${actualIsListening ? 'animate-pulse' : ''}`} />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
        {actualIsListening && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </button>
      
      {/* Show progress and expected note (only for Twinkle score) */}
      {isTwinkleScore && practiceSettings.voiceControlEnabled && totalNotes && totalNotes > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">
            {currentNoteIndex || 0}/{totalNotes}
          </span>
          {isPlaying && storeCurrentNoteIndex !== undefined && scoreNoteData && (
            <span className="text-xs text-blue-600 font-semibold">
              (Expected: {scoreNoteData.notes[storeCurrentNoteIndex]?.noteName || '?'})
            </span>
          )}
        </div>
      )}
      
      {/* Show error message */}
      {externalError && (
        <span className="text-xs text-red-600" title={externalError}>
          Error
        </span>
      )}
    </div>
  )
}

