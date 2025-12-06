import { useStore } from '../../store/useStore'
import { PracticeMode } from '../../types'

export default function ModeToggle() {
  const { practiceSettings, setPracticeMode } = useStore()

  const handleModeChange = (mode: PracticeMode) => {
    setPracticeMode(mode)
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-xl p-1">
      <button
        onClick={() => handleModeChange('practice')}
        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
          practiceSettings.mode === 'practice'
            ? 'bg-gradient-to-r from-orange-400 to-yellow-500 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Practice Mode
      </button>
      <button
        onClick={() => handleModeChange('performance')}
        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
          practiceSettings.mode === 'performance'
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Performance Mode
      </button>
    </div>
  )
}

