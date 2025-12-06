import { useState, useCallback, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useStore } from '../../store/useStore'
import { Score } from '../../types'
import MarkerOverlay from './MarkerOverlay'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import './ScoreViewer.css'

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface ScoreViewerProps {
  score: Score
  onTotalPagesChange: (pages: number) => void
}

export default function ScoreViewer({ score, onTotalPagesChange }: ScoreViewerProps) {
  const { currentPage, setCurrentPage, markers, addMarker, practiceSettings } = useStore()
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1.5)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null)
  const [displayPage, setDisplayPage] = useState(currentPage)
  const [isFading, setIsFading] = useState(false)

  // Sync displayPage with currentPage on mount or when score changes
  useEffect(() => {
    setDisplayPage(currentPage)
  }, [score.id])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    onTotalPagesChange(numPages)
  }

  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (practiceSettings.mode === 'practice' && isSelecting) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      if (!selectionStart) {
        setSelectionStart({ x, y })
      } else {
        setSelectionEnd({ x, y })
        setIsSelecting(false)
      }
      } else {
        // Add marker
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        
        const marker = {
          id: Date.now().toString(),
          x,
          y,
          page: currentPage,
          createdAt: new Date(),
        }
        addMarker(marker)
      }
  }, [practiceSettings.mode, isSelecting, selectionStart, currentPage, addMarker])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      setScale(prev => Math.max(0.5, Math.min(3, prev - e.deltaY * 0.001)))
    }
  }, [])

  // Handle page transition with smooth fade effect
  useEffect(() => {
    if (currentPage !== displayPage) {
      // Start fade out
      setIsFading(true)
      // After fade out completes, switch page and fade in
      const timer = setTimeout(() => {
        setDisplayPage(currentPage)
        // Small delay before fade in to ensure content is ready
        setTimeout(() => {
          setIsFading(false)
        }, 50)
      }, 300) // Match CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [currentPage, displayPage])

  if (score.type === 'image') {
    // Support multi-page images
    const imageUrl = score.urls && score.urls.length > 0 
      ? score.urls[displayPage - 1] || score.urls[0]
      : score.url
    
    // Set total pages
    const imageTotalPages = score.urls ? score.urls.length : 1
    if (numPages !== imageTotalPages) {
      setNumPages(imageTotalPages)
      onTotalPagesChange(imageTotalPages)
    }
    
    return (
      <div className="score-viewer-container">
        <div
          className={`relative cursor-crosshair transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
          onClick={handlePageClick}
          onWheel={handleWheel}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        >
          <img
            src={imageUrl}
            alt={`${score.name} - Page ${displayPage}`}
            className="max-w-full h-auto shadow-2xl"
          />
          <MarkerOverlay
            page={displayPage}
            markers={markers.filter(m => m.page === displayPage)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="score-viewer-container">
      <Document
        file={score.url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center h-screen">
            <div className="text-gray-600">Loading...</div>
          </div>
        }
      >
        <div
          className={`relative cursor-crosshair transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
          onClick={handlePageClick}
          onWheel={handleWheel}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        >
          <Page
            pageNumber={displayPage}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={scale}
          />
          <MarkerOverlay
            page={displayPage}
            markers={markers.filter(m => m.page === displayPage)}
          />
        </div>
      </Document>
    </div>
  )
}

