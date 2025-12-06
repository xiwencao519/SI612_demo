import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Upload, FileText, Scan } from 'lucide-react'
import FileUpload from '../components/FileUpload'
import logoImage from '../assets/11.png'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6 transform hover:scale-105 transition-transform">
            <img 
              src={logoImage} 
              alt="FLOWMATE Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            FLOWMATE
          </h1>
          <p className="text-gray-700 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Keeps your piano moments calm by handling pages and highlighting what needs care.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Action buttons */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <button
              onClick={() => setShowUpload(true)}
              className="group relative p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-yellow-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-5 group-hover:from-yellow-500 group-hover:to-yellow-700 transition-all shadow-lg">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Upload Score
                </h3>
                <p className="text-gray-600 text-base">
                  Upload PDF or image format score files
                </p>
              </div>
            </button>

            <button
              onClick={handleScan}
              disabled={scanning}
              className="group relative p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 border-2 border-transparent hover:border-orange-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-5 group-hover:from-orange-500 group-hover:to-orange-700 transition-all shadow-lg">
                  <Scan className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {scanning ? 'Scanning...' : 'Scan Paper Score'}
                </h3>
                <p className="text-gray-600 text-base">
                  {scanning ? 'Processing your score...' : 'Convert paper score to digital version'}
                </p>
              </div>
            </button>
          </div>

          {/* Saved scores list */}
          {scores.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                My Scores
              </h2>
              <div className="grid gap-4">
                {scores.map((score) => (
                  <button
                    key={score.id}
                    onClick={() => handleScoreSelect(score.id)}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl hover:from-orange-50 hover:to-yellow-50 transition-all text-left border-2 border-transparent hover:border-orange-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{score.name}</p>
                        <p className="text-sm text-gray-600">
                          {score.uploadedAt.toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl text-orange-500 font-bold">→</span>
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

