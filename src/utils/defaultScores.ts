import { Score, NoteData, ScoreNoteData } from '../types'

// Create a single page of Twinkle Twinkle score
const createTwinkleTwinkleScorePage = (pageNumber: number): string => {
  const svgWidth = 800
  const svgHeight = 800
  const staffTop = 150
  const lineGap = 15
  const staffWidth = 500
  const staffLeft = 150

  // Twinkle Twinkle melody
  // Page 1: first four lines
  // Page 2: do do so so la la so, fa fa mi mi re re do
  const pageMelodies: string[][][] = [
    // Page 1
    [
      ['do', 'do', 'so', 'so', 'la', 'la', 'so'],      // Line 1
      ['fa', 'fa', 'mi', 'mi', 're', 're', 'do'],      // Line 2
      ['so', 'so', 'fa', 'fa', 'mi', 'mi', 're'],      // Line 3
      ['so', 'so', 'fa', 'fa', 'mi', 'mi', 're'],      // Line 4
    ],
    // Page 2
    [
      ['do', 'do', 'so', 'so', 'la', 'la', 'so'],      // Line 1
      ['fa', 'fa', 'mi', 'mi', 're', 're', 'do'],      // Line 2
    ],
  ]
  
  const melody = pageMelodies[pageNumber - 1] || pageMelodies[0]

  // Map note names to staff positions (offset from bottom line, unit: lineGap)
  // do = C4 (ledger line below), re = D4 (space below), mi = E4 (first line), fa = F4 (first space), 
  // so = G4 (second line), la = A4 (second space)
  const notePositions: { [key: string]: number } = {
    'do': lineGap,      // Ledger line below
    're': lineGap / 2,  // Space below
    'mi': 0,            // First line (bottom line)
    'fa': -lineGap / 2, // First space
    'so': -lineGap,     // Second line
    'la': -lineGap * 1.5, // Second space
  }

  // Generate staff lines and clef (based on number of staves on current page)
  const staffElements: string[] = []
  const numStaffs = melody.length // Number of staves on current page
  for (let staffIndex = 0; staffIndex < numStaffs; staffIndex++) {
    const yBase = staffTop + staffIndex * 140
    // Treble clef
    staffElements.push(`<text x="120" y="${yBase + 60}" font-family="serif" font-size="70" fill="#000">𝄞</text>`)
    // Five lines
    for (let i = 0; i < 5; i++) {
      const y = yBase + i * lineGap
      staffElements.push(`<line x1="${staffLeft}" y1="${y}" x2="${staffLeft + staffWidth}" y2="${y}" stroke="#000" stroke-width="2"/>`)
    }
  }

  // Generate notes
  const notes: string[] = []
  melody.forEach((staff, staffIndex) => {
    const yBase = staffTop + staffIndex * 140 + 4 * lineGap // Bottom line position
    staff.forEach((noteName, noteIndex) => {
      const x = staffLeft + 80 + noteIndex * 60
      const y = yBase + notePositions[noteName]
      
      // If it's 'do' (on ledger line below), need to draw ledger line
      let ledgerLine = ''
      if (noteName === 'do') {
        const ledgerY = yBase + lineGap
        ledgerLine = `<line x1="${x - 15}" y1="${ledgerY}" x2="${x + 15}" y2="${ledgerY}" stroke="#000" stroke-width="2"/>`
      }
      
      // Draw note (represented as circle)
      notes.push(ledgerLine + `<circle cx="${x}" cy="${y}" r="8" fill="#000"/>`)
    })
  })

  const svg = `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${svgWidth}" height="${svgHeight}" fill="#ffffff"/>
      <text x="400" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="#333">Twinkle Twinkle</text>
      <text x="400" y="90" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#666">Twinkle Twinkle Little Star</text>
      ${staffElements.join('')}
      ${notes.join('')}
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

// Create Twinkle Twinkle score (page 1, for compatibility)
const createTwinkleTwinkleScore = (): string => {
  return createTwinkleTwinkleScorePage(1)
}

// Create a single page of Twinkle Twinkle score copy (2 lines per page, 3 pages total)
const createTwinkleTwinkleScorePageCopy = (pageNumber: number): string => {
  const svgWidth = 800
  const svgHeight = 800
  const staffTop = 150
  const lineGap = 15
  const staffWidth = 500
  const staffLeft = 150

  // Twinkle Twinkle melody - 6 lines total, 2 lines per page
  const allLines: string[][] = [
    ['do', 'do', 'so', 'so', 'la', 'la', 'so'],      // Line 1
    ['fa', 'fa', 'mi', 'mi', 're', 're', 'do'],      // Line 2
    ['so', 'so', 'fa', 'fa', 'mi', 'mi', 're'],      // Line 3
    ['so', 'so', 'fa', 'fa', 'mi', 'mi', 're'],      // Line 4
    ['do', 'do', 'so', 'so', 'la', 'la', 'so'],      // Line 5
    ['fa', 'fa', 'mi', 'mi', 're', 're', 'do'],      // Line 6
  ]

  // Get 2 lines for current page
  const startIndex = (pageNumber - 1) * 2
  const melody = [
    allLines[startIndex] || [],
    allLines[startIndex + 1] || [],
  ].filter(line => line.length > 0)

  // Map note names to staff positions (offset from bottom line, unit: lineGap)
  const notePositions: { [key: string]: number } = {
    'do': lineGap,      // Ledger line below
    're': lineGap / 2,  // Space below
    'mi': 0,            // First line (bottom line)
    'fa': -lineGap / 2, // First space
    'so': -lineGap,     // Second line
    'la': -lineGap * 1.5, // Second space
  }

  // Generate staff lines and clef (based on number of staves on current page)
  const staffElements: string[] = []
  const numStaffs = melody.length // Number of staves on current page (should be 2)
  for (let staffIndex = 0; staffIndex < numStaffs; staffIndex++) {
    const yBase = staffTop + staffIndex * 140
    // Treble clef
    staffElements.push(`<text x="120" y="${yBase + 60}" font-family="serif" font-size="70" fill="#000">𝄞</text>`)
    // Five lines
    for (let i = 0; i < 5; i++) {
      const y = yBase + i * lineGap
      staffElements.push(`<line x1="${staffLeft}" y1="${y}" x2="${staffLeft + staffWidth}" y2="${y}" stroke="#000" stroke-width="2"/>`)
    }
  }

  // Generate notes
  const notes: string[] = []
  melody.forEach((staff, staffIndex) => {
    const yBase = staffTop + staffIndex * 140 + 4 * lineGap // Bottom line position
    staff.forEach((noteName, noteIndex) => {
      const x = staffLeft + 80 + noteIndex * 60
      const y = yBase + notePositions[noteName]
      
      // If it's 'do' (on ledger line below), need to draw ledger line
      let ledgerLine = ''
      if (noteName === 'do') {
        const ledgerY = yBase + lineGap
        ledgerLine = `<line x1="${x - 15}" y1="${ledgerY}" x2="${x + 15}" y2="${ledgerY}" stroke="#000" stroke-width="2"/>`
      }
      
      // Draw note (represented as circle)
      notes.push(ledgerLine + `<circle cx="${x}" cy="${y}" r="8" fill="#000"/>`)
    })
  })

  const svg = `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${svgWidth}" height="${svgHeight}" fill="#ffffff"/>
      <text x="400" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="#333">Twinkle Twinkle</text>
      <text x="400" y="90" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#666">Twinkle Twinkle Little Star</text>
      ${staffElements.join('')}
      ${notes.join('')}
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

// Export note data for Twinkle Twinkle score (includes all pages)
export function getTwinkleTwinkleNoteData(): ScoreNoteData {
  const svgWidth = 800
  const svgHeight = 800
  const staffTop = 150
  const lineGap = 15
  const staffLeft = 150

  // Melody for all pages
  const allPagesMelody: string[][][] = [
    // Page 1
    [
      ['do', 'do', 'so', 'so', 'la', 'la', 'so'],
      ['fa', 'fa', 'mi', 'mi', 're', 're', 'do'],
      ['so', 'so', 'fa', 'fa', 'mi', 'mi', 're'],
      ['so', 'so', 'fa', 'fa', 'mi', 'mi', 're'],
    ],
    // Page 2
    [
      ['do', 'do', 'so', 'so', 'la', 'la', 'so'],
      ['fa', 'fa', 'mi', 'mi', 're', 're', 'do'],
    ],
  ]

  const notes: NoteData[] = []
  const notesByStaff: NoteData[][] = []

  // Process notes for all pages
  allPagesMelody.forEach((pageMelody, pageIndex) => {
    pageMelody.forEach((staffMelody, staffIndex) => {
      const staffNotes: NoteData[] = []
      staffMelody.forEach((noteName, noteIndex) => {
        const x = staffLeft + 80 + noteIndex * 60
        // Note: staffIndex is independent per page, so page 1 has staffIndex 0-3, page 2 has 0-1
        // But when displaying, each page starts from the top
        const yBase = staffTop + staffIndex * 140 + 4 * lineGap // Bottom line position
        
        // Calculate note's y coordinate (based on note position)
        const notePositions: { [key: string]: number } = {
          'do': lineGap,
          're': lineGap / 2,
          'mi': 0,
          'fa': -lineGap / 2,
          'so': -lineGap,
          'la': -lineGap * 1.5,
        }
        const y = yBase + (notePositions[noteName] || 0)

        // Convert to percentage coordinates
        const xPercent = (x / svgWidth) * 100
        const yPercent = (y / svgHeight) * 100

        const noteData: NoteData = {
          noteName,
          x: xPercent,
          y: yPercent,
          staffIndex, // Staff index within current page
          noteIndex,
          page: pageIndex + 1, // Add page number information
        }
        notes.push(noteData)
        staffNotes.push(noteData)
      })
      notesByStaff.push(staffNotes)
    })
  })

  return {
    scoreId: 'default-5',
    notes,
    notesByStaff,
  }
}

// Export note data for Twinkle Twinkle score copy (includes all pages, 2 lines per page, 3 pages total)
export function getTwinkleTwinkleNoteDataCopy(): ScoreNoteData {
  const svgWidth = 800
  const svgHeight = 800
  const staffTop = 150
  const lineGap = 15
  const staffLeft = 150

  // All 6 lines of melody
  const allLines: string[][] = [
    ['do', 'do', 'so', 'so', 'la', 'la', 'so'],      // Line 1
    ['fa', 'fa', 'mi', 'mi', 're', 're', 'do'],      // Line 2
    ['so', 'so', 'fa', 'fa', 'mi', 'mi', 're'],      // Line 3
    ['so', 'so', 'fa', 'fa', 'mi', 'mi', 're'],      // Line 4
    ['do', 'do', 'so', 'so', 'la', 'la', 'so'],      // Line 5
    ['fa', 'fa', 'mi', 'mi', 're', 're', 'do'],      // Line 6
  ]

  // Organize into 3 pages, 2 lines per page
  const allPagesMelody: string[][][] = [
    // Page 1: lines 1-2
    [allLines[0], allLines[1]],
    // Page 2: lines 3-4
    [allLines[2], allLines[3]],
    // Page 3: lines 5-6
    [allLines[4], allLines[5]],
  ]

  const notes: NoteData[] = []
  const notesByStaff: NoteData[][] = []

  // Process notes for all pages
  allPagesMelody.forEach((pageMelody, pageIndex) => {
    pageMelody.forEach((staffMelody, staffIndex) => {
      const staffNotes: NoteData[] = []
      staffMelody.forEach((noteName, noteIndex) => {
        const x = staffLeft + 80 + noteIndex * 60
        // Note: staffIndex is independent per page, so each page has staffIndex 0-1
        // But when displaying, each page starts from the top
        const yBase = staffTop + staffIndex * 140 + 4 * lineGap // Bottom line position
        
        // Calculate note's y coordinate (based on note position)
        const notePositions: { [key: string]: number } = {
          'do': lineGap,
          're': lineGap / 2,
          'mi': 0,
          'fa': -lineGap / 2,
          'so': -lineGap,
          'la': -lineGap * 1.5,
        }
        const y = yBase + (notePositions[noteName] || 0)

        // Convert to percentage coordinates
        const xPercent = (x / svgWidth) * 100
        const yPercent = (y / svgHeight) * 100

        const noteData: NoteData = {
          noteName,
          x: xPercent,
          y: yPercent,
          staffIndex, // Staff index within current page
          noteIndex,
          page: pageIndex + 1, // Add page number information
        }
        notes.push(noteData)
        staffNotes.push(noteData)
      })
      notesByStaff.push(staffNotes)
    })
  })

  return {
    scoreId: 'default-6',
    notes,
    notesByStaff,
  }
}

// Create placeholder score image Data URL (SVG format)
const createPlaceholderScore = (name: string): string => {
  const svg = `
    <svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="1200" fill="#ffffff"/>
      <text x="400" y="100" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#333">${name}</text>
      <text x="400" y="150" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#666">Sample Score</text>
      <!-- Simulate staff lines -->
      ${Array.from({ length: 10 }, (_, i) => {
        const y = 250 + i * 80
        return Array.from({ length: 5 }, (_, j) => 
          `<line x1="100" y1="${y + j * 15}" x2="700" y2="${y + j * 15}" stroke="#333" stroke-width="2"/>`
        ).join('')
      }).join('')}
      <!-- Simulate notes -->
      ${Array.from({ length: 20 }, (_, i) => {
        const x = 150 + (i % 10) * 60
        const y = 280 + Math.floor(i / 10) * 80 + Math.random() * 60
        return `<circle cx="${x}" cy="${y}" r="8" fill="#333"/>`
      }).join('')}
      <text x="400" y="1150" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#999">This is a sample score, please upload your own score file</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

// Default score data
export const defaultScores: Score[] = [
  {
    id: 'default-1',
    name: 'Sample Score - Beethoven Moonlight Sonata',
    url: createPlaceholderScore('Beethoven Moonlight Sonata'),
    type: 'image',
    uploadedAt: new Date('2024-01-01'),
  },
  {
    id: 'default-2',
    name: 'Sample Score - Mozart Twinkle Variations',
    url: createPlaceholderScore('Mozart Twinkle Variations'),
    type: 'image',
    uploadedAt: new Date('2024-01-02'),
  },
  {
    id: 'default-3',
    name: 'Sample Score - Bach Well-Tempered Clavier',
    url: createPlaceholderScore('Bach Well-Tempered Clavier'),
    type: 'image',
    uploadedAt: new Date('2024-01-03'),
  },
  {
    id: 'default-4',
    name: 'Sample Score - Chopin Nocturne',
    url: createPlaceholderScore('Chopin Nocturne'),
    type: 'image',
    uploadedAt: new Date('2024-01-04'),
  },
  {
    id: 'default-5',
    name: 'Stars',
    url: createTwinkleTwinkleScorePage(1), // Page 1
    urls: [
      createTwinkleTwinkleScorePage(1), // Page 1
      createTwinkleTwinkleScorePage(2), // Page 2
    ],
    type: 'image',
    uploadedAt: new Date('2024-01-05'),
  },
  {
    id: 'default-6',
    name: 'Twinkle Twinkle',
    url: createTwinkleTwinkleScorePageCopy(1), // Page 1
    urls: [
      createTwinkleTwinkleScorePageCopy(1), // Page 1
      createTwinkleTwinkleScorePageCopy(2), // Page 2
      createTwinkleTwinkleScorePageCopy(3), // Page 3
    ],
    type: 'image',
    uploadedAt: new Date(),
  },
]

// Get default scores
export const getDefaultScores = (): Score[] => {
  return defaultScores
}

