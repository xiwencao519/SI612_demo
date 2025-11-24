import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Upload, FileText, Scan, Music } from 'lucide-react'
import FileUpload from '../components/FileUpload'

export default function HomePage() {
  const navigate = useNavigate()
  const { scores, addScore, setCurrentScore, initializeDefaultScores } = useStore()
  const [showUpload, setShowUpload] = useState(false)
  const [scanning, setScanning] = useState(false)

  // Initialize default scores
  useEffect(() => {
    initializeDefaultScores()
  }, [initializeDefaultScores])

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file)
    const newScore = {
      id: Date.now().toString(),
      name: file.name,
      url,
      type: file.type.includes('pdf') ? 'pdf' as const : 'image' as const,
      uploadedAt: new Date(),
    }
    addScore(newScore)
    setCurrentScore(newScore)
    navigate('/viewer')
  }

  const handleScan = () => {
    setScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false)
      setShowUpload(true)
    }, 2000)
  }

  const handleScoreSelect = (scoreId: string) => {
    const score = scores.find(s => s.id === scoreId)
    if (score) {
      setCurrentScore(score)
      navigate('/viewer')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-4">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Digital Score Viewer
          </h1>
          <p className="text-gray-600 text-lg">
            Elegant practice experience with intelligent feedback
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Action buttons */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => setShowUpload(true)}
              className="group relative p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <FileText className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select Digital Score
                </h3>
                <p className="text-gray-600 text-sm">
                  Upload PDF or image format score files
                </p>
              </div>
            </button>

            <button
              onClick={handleScan}
              disabled={scanning}
              className="group relative p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <Scan className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {scanning ? 'Scanning...' : 'Scan Paper Score'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {scanning ? 'Processing your score...' : 'Convert paper score to digital version'}
                </p>
              </div>
            </button>
          </div>

          {/* Saved scores list */}
          {scores.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                My Scores
              </h2>
              <div className="grid gap-3">
                {scores.map((score) => (
                  <button
                    key={score.id}
                    onClick={() => handleScoreSelect(score.id)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="font-medium text-gray-900">{score.name}</p>
                        <p className="text-sm text-gray-500">
                          {score.uploadedAt.toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>
                    <span className="text-primary-600">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showUpload && (
          <FileUpload
            onFileSelect={handleFileSelect}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>
    </div>
  )
}

