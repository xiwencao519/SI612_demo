import { useState, useEffect } from 'react'
import { X, Heart, TrendingUp, Sparkles } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function FeedbackModal() {
  const { markers, currentPage, totalPages, practiceSettings } = useStore()
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<string>('')

  useEffect(() => {
    // Simulate section end detection (when reaching the last page)
    if (currentPage === totalPages && totalPages > 1) {
      generateFeedback()
      setShowFeedback(true)
    }
  }, [currentPage, totalPages])

  const generateFeedback = () => {
    const currentPageMarkers = markers.filter(m => m.page === currentPage)
    const totalMarkers = markers.length
    
    let message = ''
    
    if (totalMarkers === 0) {
      message = 'Excellent! You completed this section with no marked errors. Keep it up!'
    } else if (totalMarkers <= 3) {
      message = `Great! You completed this section. With only ${totalMarkers} marker(s), you're doing very well. Keep practicing these parts and you'll get even better!`
    } else if (totalMarkers <= 6) {
      message = `Good! You completed this section with ${totalMarkers} marker(s). These are areas that need focused practice. Take your time with these sections, there's no rush.`
    } else {
      message = `You completed this section! While there are ${totalMarkers} markers, this is normal in the learning process. Try practicing in smaller segments, focusing on one part at a time. Remember, progress is more important than perfection!`
    }
    
    setFeedback(message)
  }

  if (!showFeedback) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
        <button
          onClick={() => setShowFeedback(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Section Complete!
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-red-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            {feedback}
          </p>
          
          <button
            onClick={() => setShowFeedback(false)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Continue Practice
          </button>
        </div>
      </div>
    </div>
  )
}

