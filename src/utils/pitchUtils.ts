// Utility functions for mapping pitch frequency to simple note names

/**
 * Convert frequency (Hz) to simple note name (do, re, mi, etc.)
 * @param frequency Frequency in Hz
 * @returns Simple note name or null
 */
export function frequencyToNoteName(frequency: number): string | null {
  if (!frequency || frequency < 80 || frequency > 2000) {
    return null
  }

  // Use more precise frequency to note mapping
  // Directly calculate closest note instead of through semitone count
  const noteFrequencies: Array<{ name: string, freq: number }> = [
    { name: 'C3', freq: 130.81 },
    { name: 'D3', freq: 146.83 },
    { name: 'E3', freq: 164.81 },
    { name: 'F3', freq: 174.61 },
    { name: 'G3', freq: 196.00 },
    { name: 'A3', freq: 220.00 },
    { name: 'B3', freq: 246.94 },
    { name: 'C4', freq: 261.63 },  // do
    { name: 'D4', freq: 293.66 },  // re
    { name: 'E4', freq: 329.63 },  // mi
    { name: 'F4', freq: 349.23 },  // fa
    { name: 'G4', freq: 392.00 },  // so
    { name: 'A4', freq: 440.00 },  // la
    { name: 'B4', freq: 493.88 },  // si
    { name: 'C5', freq: 523.25 },
    { name: 'D5', freq: 587.33 },
    { name: 'E5', freq: 659.25 },
    { name: 'F5', freq: 698.46 },
    { name: 'G5', freq: 783.99 },
    { name: 'A5', freq: 880.00 },
    { name: 'B5', freq: 987.77 },
  ]

  // Find closest note (using semitone distance, more accurate)
  let closestNote = noteFrequencies[0]
  let minDistance = Infinity

  for (const note of noteFrequencies) {
    // Calculate semitone distance (using logarithmic distance)
    const semitoneDistance = Math.abs(12 * Math.log2(frequency / note.freq))
    
    if (semitoneDistance < minDistance) {
      minDistance = semitoneDistance
      closestNote = note
    }
  }

  // If distance too far (more than 1 semitone), consider detection inaccurate
  // Use 1 semitone tolerance because user playing may be slightly off
  if (minDistance > 1.0) {
    console.log(`[Frequency Conversion] Frequency ${frequency.toFixed(2)}Hz too far from closest note ${closestNote.name} (${closestNote.freq}Hz), distance: ${minDistance.toFixed(2)} semitones`)
    return null
  }

  // Map to simple note name
  const simpleNoteMap: { [key: string]: string } = {
    'C3': 'do',
    'D3': 're',
    'E3': 'mi',
    'F3': 'fa',
    'G3': 'so',
    'A3': 'la',
    'B3': 'si',
    'C4': 'do',
    'D4': 're',
    'E4': 'mi',
    'F4': 'fa',
    'G4': 'so',
    'A4': 'la',
    'B4': 'si',
    'C5': 'do',
    'D5': 're',
    'E5': 'mi',
    'F5': 'fa',
    'G5': 'so',
    'A5': 'la',
    'B5': 'si',
  }

  const result = simpleNoteMap[closestNote.name]
  
  // Add debug log (only for do and so)
  if (result === 'do' || result === 'so') {
    console.log(`[Frequency Conversion] Frequency: ${frequency.toFixed(2)}Hz → ${closestNote.name} (${closestNote.freq}Hz) → ${result}, distance: ${minDistance.toFixed(3)} semitones`)
  }
  
  return result || null
}

/**
 * Get standard frequency (Hz) for a note
 * @param noteName Simple note name (do, re, mi, etc.)
 * @returns Standard frequency in Hz
 */
export function noteNameToFrequency(noteName: string): number {
  const noteFrequencies: { [key: string]: number } = {
    'do': 261.63,  // C4
    're': 293.66,  // D4
    'mi': 329.63,  // E4
    'fa': 349.23,  // F4
    'so': 392.00,  // G4
    'la': 440.00,  // A4
    'si': 493.88,  // B4
  }
  
  return noteFrequencies[noteName.toLowerCase()] || 0
}

/**
 * Check if two notes match (allow some tolerance)
 * @param detectedNote Detected note
 * @param expectedNote Expected note
 * @returns Whether they match
 */
export function notesMatch(detectedNote: string | null, expectedNote: string): boolean {
  if (!detectedNote) {
    return false
  }
  
  return detectedNote.toLowerCase() === expectedNote.toLowerCase()
}

