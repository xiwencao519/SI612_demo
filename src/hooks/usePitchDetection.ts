import { useEffect, useRef, useState } from 'react'

// Dynamically import pitchfinder
let PitchFinder: any = null
try {
  // @ts-ignore
  PitchFinder = require('pitchfinder')
  // Handle different export methods
  if (PitchFinder && typeof PitchFinder.default === 'object') {
    PitchFinder = PitchFinder.default
  }
} catch (e) {
  console.warn('[Pitch Detection] Unable to load pitchfinder library:', e)
}

interface UsePitchDetectionOptions {
  enabled: boolean
  onPitchDetected?: (pitch: number | null) => void
  sampleRate?: number
}

export function usePitchDetection(options: UsePitchDetectionOptions) {
  const { enabled, onPitchDetected, sampleRate = 44100 } = options
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const dataArrayRef = useRef<Float32Array | null>(null)

  useEffect(() => {
    if (!enabled) {
      stopListening()
      return
    }

    startListening()

    return () => {
      stopListening()
    }
  }, [enabled])

  const startListening = async () => {
    try {
      setError(null)
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      })
      
      streamRef.current = stream
      
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ 
        sampleRate: sampleRate 
      })
      audioContextRef.current = audioContext
      
      // Create analyser node
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 4096 // Increase FFT size to improve frequency resolution
      analyser.smoothingTimeConstant = 0.3 // Decrease smoothing for faster response
      analyserRef.current = analyser
      
      // Create microphone input source
      const microphone = audioContext.createMediaStreamSource(stream)
      microphone.connect(analyser)
      microphoneRef.current = microphone
      
      // Create data array
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Float32Array(bufferLength)
      dataArrayRef.current = dataArray
      
      setIsListening(true)
      
      // Start detection loop
      detectPitchLoop()
    } catch (err: any) {
      console.error('Error accessing microphone:', err)
      setError(err.message || 'Unable to access microphone, please check permission settings')
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
      microphoneRef.current = null
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    analyserRef.current = null
    dataArrayRef.current = null
    setIsListening(false)
  }

  // Use ref to store detector instance, avoid creating it in every loop
  const detectPitchFnRef = useRef<((signal: Float32Array) => number | null) | null>(null)

  useEffect(() => {
    // Initialize detector
    if (enabled) {
      try {
        // Create pitch detector (using YIN algorithm)
        if (PitchFinder) {
          // Try different methods to access YIN
          const yinMethod = PitchFinder.YIN || PitchFinder.default?.YIN
          if (yinMethod) {
            detectPitchFnRef.current = yinMethod({ sampleRate })
            console.log('[Pitch Detection] PitchFinder YIN algorithm initialized successfully, sampleRate:', sampleRate)
          } else {
            console.error('[Pitch Detection] PitchFinder.YIN method does not exist, PitchFinder object:', PitchFinder)
          }
        } else {
          console.error('[Pitch Detection] PitchFinder not loaded')
        }
      } catch (err) {
        console.error('[Pitch Detection] Initialization error:', err)
      }
    } else {
      detectPitchFnRef.current = null
    }
  }, [enabled, sampleRate])

  // Use FFT to detect frequency (more reliable method)
  const detectPitchWithFFT = (analyser: AnalyserNode): number | null => {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(frequencyData)
    
    // Find frequency with maximum amplitude (skip DC component)
    let maxIndex = 0
    let maxValue = 0
    for (let i = 1; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i]
        maxIndex = i
      }
    }
    
    // Lower threshold to detect sound more easily (from 10 to 3)
    if (maxValue < 3) {
      return null
    }
    
    // Calculate frequency: frequency = (index / FFT size) * sample rate
    const nyquist = sampleRate / 2
    const frequency = (maxIndex / frequencyData.length) * nyquist
    
    // Filter valid range (80-2000 Hz corresponds to bass to treble)
    if (frequency >= 80 && frequency <= 2000) {
      return frequency
    }
    
    return null
  }

  const detectPitchLoop = () => {
    if (!analyserRef.current || !dataArrayRef.current) {
      animationFrameRef.current = requestAnimationFrame(detectPitchLoop)
      return
    }
    
    let pitch: number | null = null
    
    try {
      // Prioritize FFT method (more reliable, doesn't depend on pitchfinder)
      pitch = detectPitchWithFFT(analyserRef.current)
      
      // If FFT didn't detect, try pitchfinder (optional)
      if (!pitch) {
        const detectPitch = detectPitchFnRef.current
        if (detectPitch) {
          analyserRef.current.getFloatTimeDomainData(dataArrayRef.current)
          const pfPitch = detectPitch(dataArrayRef.current)
          if (pfPitch && pfPitch > 80 && pfPitch < 2000) {
            pitch = pfPitch
          }
        }
      }
      
      // Callback result
      if (onPitchDetected) {
        if (pitch && pitch > 80 && pitch < 2000) {
          onPitchDetected(pitch)
        } else {
          onPitchDetected(null)
        }
      }
    } catch (err) {
      console.error('[Pitch Detection] Detection error:', err)
      if (onPitchDetected) {
        onPitchDetected(null)
      }
    }
    
    // Continue loop
    animationFrameRef.current = requestAnimationFrame(detectPitchLoop)
  }

  return {
    isListening,
    error,
    stopListening,
  }
}

