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
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative border-4 border-orange-200 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <UploadIcon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            Upload Score
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
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
            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-xl hover:from-orange-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            Select File
          </button>
        </div>
      </div>
    </div>
  )
}

