import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function MarkerPanel() {
  const { markers, removeMarker, currentPage } = useStore()
  const [isOpen, setIsOpen] = useState(true)
  
  const currentPageMarkers = markers.filter(m => m.page === currentPage && m.type !== 'correct')

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-24 bg-gradient-to-r from-orange-400 to-yellow-500 text-white p-3 rounded-xl shadow-lg hover:from-orange-500 hover:to-yellow-600 transition-all"
        title="Show Markers"
      >
        <AlertCircle className="w-5 h-5" />
        {currentPageMarkers.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {currentPageMarkers.length}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="w-80 bg-white border-l-2 border-gray-200 flex flex-col shadow-xl">
      <div className="flex items-center justify-between p-5 border-b-2 border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <h3 className="text-lg font-semibold text-gray-900">
          Markers ({currentPageMarkers.length})
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {currentPageMarkers.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No markers on current page</p>
            <p className="text-sm mt-1">Click on the score to add a marker</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentPageMarkers.map((marker) => {
              const isAutoDetected = marker.id.startsWith('auto-')
              return (
                <div
                  key={marker.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    isAutoDetected
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      isAutoDetected ? 'bg-orange-400' : 'bg-yellow-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700">
                      {marker.note || 'Marker position'}
                    </p>
                    {isAutoDetected && (
                      <span className="text-xs px-1.5 py-0.5 bg-orange-200 text-orange-700 rounded">
                        Auto
                      </span>
                    )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {marker.createdAt.toLocaleTimeString('en-US')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMarker(marker.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

