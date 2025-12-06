import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import logoImage from '../../assets/11.png'

export default function FeedbackModal() {
  const { markers, currentPage, totalPages, practiceSettings, sectionComplete, setSectionComplete } = useStore()
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<string>('')

  useEffect(() => {
    // Show feedback when section is complete
    if (sectionComplete) {
      generateFeedback()
      setShowFeedback(true)
    }
  }, [sectionComplete])

  const generateFeedback = () => {
    // Only count error markers (exclude correct markers)
    const errorMarkers = markers.filter(m => m.type === 'error')
    const totalErrorMarkers = errorMarkers.length
    
    const message = `You made only ${totalErrorMarkers} mistake${totalErrorMarkers !== 1 ? 's' : ''}, good job!`
    
    setFeedback(message)
  }

  if (!showFeedback) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative shadow-2xl border-4 border-yellow-200">
        <button
          onClick={() => setShowFeedback(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src={logoImage} 
              alt="FLOWMATE Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Section Complete!
          </h3>
          
          <p className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
            {feedback}
          </p>
          
          <button
            onClick={() => {
              setShowFeedback(false)
              setSectionComplete(false) // Reset completion status
            }}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Continue Practice
          </button>
        </div>
      </div>
    </div>
  )
}

