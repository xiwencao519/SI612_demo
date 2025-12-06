import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Clock, AlertCircle, Trash2, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { PracticeRecord } from '../../types'
import logoImage from '../../assets/11.png'

export default function PracticeRecordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { practiceRecords, removePracticeRecord, restorePracticeRecord, scores } = useStore()
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set())

  if (!isOpen) {
    return null
  }

  const toggleExpand = (recordId: string) => {
    setExpandedRecords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(recordId)) {
        newSet.delete(recordId)
      } else {
        newSet.add(recordId)
      }
      return newSet
    })
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleRestore = (record: PracticeRecord) => {
    // Check if score exists
    const score = scores.find(s => s.id === record.scoreId)
    if (!score) {
      alert('Cannot restore: The corresponding score does not exist')
      return
    }

    // Restore the record
    const success = restorePracticeRecord(record.id)
    if (success) {
      // Close modal and navigate to viewer
      onClose()
      navigate('/viewer')
    } else {
      alert('Restore failed: Record or score does not exist')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col shadow-2xl border-4 border-orange-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="FLOWMATE Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Practice Records</h2>
              <p className="text-sm text-gray-500 mt-1">{practiceRecords.length} record{practiceRecords.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {practiceRecords.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No practice records</p>
              <p className="text-gray-400 text-sm mt-2">Click the "Restart" button to save practice records</p>
            </div>
          ) : (
            <div className="space-y-4">
              {practiceRecords.map((record) => {
                const isExpanded = expandedRecords.has(record.id)
                const autoMarkers = record.markers.filter(m => m.id.startsWith('auto-'))
                const manualMarkers = record.markers.filter(m => !m.id.startsWith('auto-'))

                return (
                  <div
                    key={record.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Record Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{record.scoreName}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              record.practiceMode === 'practice'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {record.practiceMode === 'practice' ? 'Practice Mode' : 'Performance Mode'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(record.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>Error Markers: {record.totalMarkers}</span>
                          </div>
                          <span>Page: {record.currentPage}/{record.totalPages}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestore(record)}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-xl hover:from-orange-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg font-semibold flex items-center gap-2"
                          title="Restore record (Go back to score and show error markers)"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </button>
                        <button
                          onClick={() => toggleExpand(record.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title={isExpanded ? 'Collapse Details' : 'Expand Details'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this record?')) {
                              removePracticeRecord(record.id)
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Total Markers</p>
                            <p className="text-2xl font-bold text-gray-900">{record.totalMarkers}</p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Auto Detected</p>
                            <p className="text-2xl font-bold text-orange-700">{record.autoDetectedMarkers}</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Manual Markers</p>
                            <p className="text-2xl font-bold text-yellow-700">{record.manualMarkers}</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Practice Mode</p>
                            <p className="text-lg font-semibold text-blue-700">
                              {record.practiceMode === 'practice' ? 'Practice Mode' : 'Performance Mode'}
                            </p>
                          </div>
                        </div>

                        {/* Markers List */}
                        {record.markers.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Marker Details:</p>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {record.markers.map((marker) => {
                                const isAuto = marker.id.startsWith('auto-')
                                return (
                                  <div
                                    key={marker.id}
                                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                                      isAuto
                                        ? 'bg-orange-50 border border-orange-200'
                                        : 'bg-yellow-50 border border-yellow-200'
                                    }`}
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        isAuto ? 'bg-orange-400' : 'bg-yellow-400'
                                      }`}
                                    />
                                    <span className="text-gray-700">
                                      {marker.note || 'Marker Position'}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                      Page {marker.page}
                                    </span>
                                    {isAuto && (
                                      <span className="text-xs px-1.5 py-0.5 bg-orange-200 text-orange-700 rounded ml-auto">
                                        Auto
                                      </span>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-xl hover:from-orange-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

