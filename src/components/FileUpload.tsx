import { useRef } from 'react'
import { X, Upload as UploadIcon } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onClose: () => void
}

export default function FileUpload({ onFileSelect, onClose }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Upload Score
          </h3>
          <p className="text-gray-600 mb-6">
            Supports PDF and image formats (JPG, PNG)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Select File
          </button>
        </div>
      </div>
    </div>
  )
}

