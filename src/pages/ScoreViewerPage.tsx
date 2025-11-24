import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import ScoreViewer from '../components/ScoreViewer/ScoreViewer'
import Toolbar from '../components/Toolbar/Toolbar'
import MarkerPanel from '../components/Marker/MarkerPanel'
import FeedbackModal from '../components/Feedback/FeedbackModal'
import { usePracticeMode } from '../hooks/usePracticeMode'
import { useAutoErrorTracking } from '../hooks/useAutoErrorTracking'

export default function ScoreViewerPage() {
  const navigate = useNavigate()
  const { currentScore, totalPages, setTotalPages, autoErrorTracking } = useStore()
  usePracticeMode()
  useAutoErrorTracking({ enabled: autoErrorTracking })

  useEffect(() => {
    if (!currentScore) {
      navigate('/')
    }
  }, [currentScore, navigate])

  if (!currentScore) {
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto">
          <ScoreViewer score={currentScore} onTotalPagesChange={setTotalPages} />
        </div>
        <MarkerPanel />
      </div>
      <FeedbackModal />
    </div>
  )
}

