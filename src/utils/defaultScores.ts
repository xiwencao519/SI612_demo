import { Score } from '../types'

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
]

// Get default scores
export const getDefaultScores = (): Score[] => {
  return defaultScores
}

