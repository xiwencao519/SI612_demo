import { Home, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause, RotateCcw, Settings, Mic, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import ModeToggle from './ModeToggle'
import VoiceControl from './VoiceControl'

export default function Toolbar() {
  const navigate = useNavigate()
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    isPlaying,
    setIsPlaying,
    practiceSettings,
    setPracticeSettings,
    autoErrorTracking,
    setAutoErrorTracking,
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
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Navigation and home */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Home"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-700 min-w-[80px] text-center">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
            onClick={() => setAutoErrorTracking(!autoErrorTracking)}
            className={`p-2 rounded-lg transition-colors relative ${
              autoErrorTracking
                ? 'bg-green-100 text-green-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={autoErrorTracking ? 'Auto Error Tracking Enabled' : 'Auto Error Tracking Disabled'}
          >
            <AlertCircle className="w-5 h-5" />
            {autoErrorTracking && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
          
          <VoiceControl />
          
          <button
            onClick={() => setPracticeSettings({ autoTurnPage: !practiceSettings.autoTurnPage })}
            className={`p-2 rounded-lg transition-colors ${
              practiceSettings.autoTurnPage
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Auto Turn Page"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

