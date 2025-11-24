import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function VoiceControl() {
  const { practiceSettings, setPracticeSettings, setCurrentPage, totalPages, currentPage } = useStore()
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    // Simulate voice recognition
    if (practiceSettings.voiceControlEnabled && isListening) {
      const handleVoiceCommand = () => {
        // Simulate recognizing "next page" command
        const commands = ['next', 'next page']
        const randomCommand = commands[Math.floor(Math.random() * commands.length)]
        
        // Simulate delay
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
  }, [isListening, practiceSettings.voiceControlEnabled, setCurrentPage, totalPages, currentPage])

  const toggleVoiceControl = () => {
    const newValue = !practiceSettings.voiceControlEnabled
    setPracticeSettings({ voiceControlEnabled: newValue })
    if (newValue) {
      setIsListening(true)
    } else {
      setIsListening(false)
    }
  }

  return (
    <button
      onClick={toggleVoiceControl}
      className={`p-2 rounded-lg transition-colors relative ${
        practiceSettings.voiceControlEnabled
          ? 'bg-primary-100 text-primary-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      title="Voice Control"
    >
      {practiceSettings.voiceControlEnabled ? (
        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
      ) : (
        <MicOff className="w-5 h-5" />
      )}
      {isListening && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}
    </button>
  )
}

