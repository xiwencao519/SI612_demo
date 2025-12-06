import { useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { usePitchDetection } from '../../hooks/usePitchDetection'

export default function PitchDisplay() {
  const [enabled, setEnabled] = useState(false)
  const [currentPitch, setCurrentPitch] = useState<number | null>(null)

  const handlePitchDetected = (pitch: number | null) => {
    if (pitch !== null && pitch > 0) {
      setCurrentPitch(pitch)
    } else {
      setCurrentPitch(null)
    }
  }

  const { isListening, error, stopListening } = usePitchDetection({
    enabled,
    onPitchDetected: handlePitchDetected,
  })

  const toggleDetection = () => {
    if (enabled) {
      setEnabled(false)
      stopListening()
      setCurrentPitch(null)
    } else {
      setEnabled(true)
    }
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={toggleDetection}
        className={`p-2 rounded-lg transition-colors relative ${
          enabled && isListening
            ? 'bg-red-100 text-red-600'
            : enabled
            ? 'bg-yellow-100 text-yellow-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title={enabled ? 'Stop Pitch Detection' : 'Start Pitch Detection'}
      >
        {enabled && isListening ? (
          <Mic className="w-4 h-4 animate-pulse" />
        ) : enabled ? (
          <Mic className="w-4 h-4" />
        ) : (
          <MicOff className="w-4 h-4" />
        )}
        {isListening && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {error && (
        <div className="text-xs text-red-600" title={error}>
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {enabled && !error && (
        <div className="flex items-center gap-2 min-w-[100px]">
          {isListening ? (
            <>
              <span className="text-xs text-gray-500">Frequency:</span>
              {currentPitch ? (
                <span className="text-sm font-mono font-semibold text-blue-600">
                  {currentPitch.toFixed(1)} Hz
                </span>
              ) : (
                <span className="text-xs text-gray-400">Detecting...</span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-400">Preparing...</span>
          )}
        </div>
      )}
    </div>
  )
}

