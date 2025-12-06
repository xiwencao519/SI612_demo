import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause, RotateCcw, Settings, Mic, RefreshCw, History } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import ModeToggle from './ModeToggle'
import VoiceControl from './VoiceControl'
import PracticeRecordModal from '../PracticeRecord/PracticeRecordModal'
import logoImage from '../../assets/11.png'

interface ToolbarProps {
  isListening?: boolean
  error?: string | null
  currentNoteIndex?: number
  totalNotes?: number
}

export default function Toolbar({ 
  isListening, 
  error, 
  currentNoteIndex, 
  totalNotes 
}: ToolbarProps = {}) {
  const navigate = useNavigate()
  const [showRecordModal, setShowRecordModal] = useState(false)
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    isPlaying,
    setIsPlaying,
    practiceSettings,
    setPracticeSettings,
    markers,
    saveCurrentPracticeAndReset,
    practiceRecords,
    currentScore,
  } = useStore()

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const togglePlay = () => {
    const newPlayingState = !isPlaying
    setIsPlaying(newPlayingState)
    
    // For Twinkle Twinkle (default-6), automatically enable microphone when starting to play
    if (currentScore?.id === 'default-6' && newPlayingState && !practiceSettings.voiceControlEnabled) {
      setPracticeSettings({ voiceControlEnabled: true })
    }
  }

  const handleRestart = () => {
    const hasMarkers = markers.length > 0
    const message = hasMarkers
      ? 'Are you sure you want to restart? The current practice record will be saved to practice records.'
      : 'Are you sure you want to restart? This will reset all practice state.'
    
    if (window.confirm(message)) {
      saveCurrentPracticeAndReset()
    }
  }

  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Navigation and home */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-105"
            title="Back to Home"
          >
            <img 
              src={logoImage} 
              alt="FLOWMATE Logo" 
              className="w-12 h-12 object-contain"
            />
          </button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-700 min-w-[80px] text-center font-semibold">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Mode toggle and playback controls */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {practiceSettings.mode === 'practice' && (
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-xl hover:from-orange-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </>
              )}
            </button>
          )}
          
          {practiceSettings.mode === 'practice' && (
            <button
              onClick={handleRestart}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-semibold ${
                markers.length > 0
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={markers.length > 0 ? 'Restart (Save current record and clear markers)' : 'Restart (Reset practice state)'}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Restart</span>
            </button>
          )}
          
          {practiceSettings.mode === 'practice' && practiceSettings.loopStart && (
            <button
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Reset Loop"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          )}
        </div>

        {/* Right: Settings and voice control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecordModal(true)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Practice Records"
          >
            <History className="w-5 h-5" />
            {practiceRecords.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-yellow-500 text-white text-xs rounded-full flex items-center justify-center shadow-md">
                {practiceRecords.length > 99 ? '99+' : practiceRecords.length}
              </span>
            )}
          </button>
          
          <VoiceControl 
            isListening={isListening} 
            error={error}
            currentNoteIndex={currentNoteIndex}
            totalNotes={totalNotes}
          />
          
          <button
            onClick={() => setPracticeSettings({ autoTurnPage: !practiceSettings.autoTurnPage })}
            className={`p-2 rounded-lg transition-colors ${
              practiceSettings.autoTurnPage
                ? 'bg-orange-100 text-orange-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Auto Turn Page"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <PracticeRecordModal 
        isOpen={showRecordModal} 
        onClose={() => setShowRecordModal(false)} 
      />
    </div>
  )
}

