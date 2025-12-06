import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import ScoreViewer from '../components/ScoreViewer/ScoreViewer'
import Toolbar from '../components/Toolbar/Toolbar'
import MarkerPanel from '../components/Marker/MarkerPanel'
import FeedbackModal from '../components/Feedback/FeedbackModal'
import { usePracticeMode } from '../hooks/usePracticeMode'
import { useNoteComparison } from '../hooks/useNoteComparison'
import { useAutoMarking } from '../hooks/useAutoMarking'

export default function ScoreViewerPage() {
  const navigate = useNavigate()
  const { currentScore, totalPages, setTotalPages } = useStore()
  usePracticeMode()
  useAutoMarking() // Auto-marking for default-6
  
  // Real-time note comparison (only enabled for Twinkle Twinkle score)
  const noteComparison = useNoteComparison()

  useEffect(() => {
    if (!currentScore) {
      navigate('/')
    }
  }, [currentScore, navigate])

  if (!currentScore) {
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
      <Toolbar 
        isListening={noteComparison.isListening}
        error={noteComparison.error}
        currentNoteIndex={noteComparison.currentNoteIndex}
        totalNotes={noteComparison.totalNotes}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
          <ScoreViewer score={currentScore} onTotalPagesChange={setTotalPages} />
        </div>
        <MarkerPanel />
      </div>
      <FeedbackModal />
    </div>
  )
}

