import { useStore } from '../../store/useStore'
import { PracticeMode } from '../../types'

export default function ModeToggle() {
  const { practiceSettings, setPracticeMode } = useStore()

  const handleModeChange = (mode: PracticeMode) => {
    setPracticeMode(mode)
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => handleModeChange('practice')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          practiceSettings.mode === 'practice'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Practice Mode
      </button>
      <button
        onClick={() => handleModeChange('performance')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          practiceSettings.mode === 'performance'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Performance Mode
      </button>
    </div>
  )
}

