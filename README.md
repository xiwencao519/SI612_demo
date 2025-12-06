# Digital Score Viewer

An elegant digital score viewer designed for tablets and laptops, providing an intelligent practice experience with a friendly feedback system.

## Features

### 🎵 Core Features
- **Digital Score Viewer** - Supports PDF and image format score display
- **File Upload** - Select digital scores or simulate scanning paper scores
- **Default Scores** - Built-in 4 sample scores for quick start
- **Error Marking** - Lightweight, non-intrusive marking system to help record practice issues
- **Auto Error Tracking** - Intelligently detects possible errors during practice and automatically adds markers
- **Section Feedback** - Simple, friendly feedback at the end of sections

### 🎯 Practice Modes
- **Practice Mode** - Supports selecting score segments for looped practice
- **Performance Mode** - Automatically advances, simulating real performance scenarios

### 📄 Page Turning Features
- Manual page turning controls
- Auto page turning (Performance Mode)
- Voice control simulation (supports "next page" and other commands)

### 🤖 Auto Error Tracking
- **Intelligent Detection** - Automatically detects possible error locations in practice mode
- **Visual Distinction** - Auto-detected markers displayed in orange, manual markers in yellow
- **Controllable** - Enable/disable auto error tracking via toolbar button
- **Smart Limiting** - Maximum 5 auto-detected errors per page to avoid over-marking

## Tech Stack

- **React 18** + **TypeScript** - Modern frontend framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React PDF** - PDF file rendering
- **React Router** - Route management
- **Lucide React** - Icon library

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
SI612_demo/
├── src/
│   ├── components/        # UI Components
│   │   ├── ScoreViewer/   # Score viewer
│   │   ├── Toolbar/       # Toolbar
│   │   ├── Marker/        # Marker components
│   │   └── Feedback/      # Feedback components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom Hooks
│   ├── store/             # State management
│   ├── types/             # TypeScript types
│   └── App.tsx
├── public/                # Static assets
└── package.json
```

## Usage Instructions

1. **Select Score** - Choose default sample scores on the home page, or upload your own score files
2. **View Score** - Use mouse wheel (Ctrl/Cmd + wheel) to zoom the score
3. **Add Markers** - Click on positions on the score to manually add markers
4. **Auto Error Tracking** - Click play in practice mode, the system will automatically detect possible errors and add markers (orange markers)
5. **Switch Modes** - Toggle between "Practice Mode" and "Performance Mode" in the toolbar
6. **Loop Practice** - Select areas for looping in practice mode
7. **Voice Control** - After enabling voice control, say "next page" to turn pages (simulated)
8. **Manage Markers** - View and manage all markers in the right marker panel, delete unwanted markers

## Simulated Features

- **Scanning Feature** - Displays upload interface, simulates scanning process
- **Voice Control** - Displays voice recognition UI, simulates recognizing "next page" and other commands
- **Section Detection** - Based on pages or manual markers
- **Feedback Generation** - Generates friendly feedback based on simple rules like marker count

## Browser Support

- Chrome (Recommended)
- Firefox
- Safari
- Edge

## License

MIT
