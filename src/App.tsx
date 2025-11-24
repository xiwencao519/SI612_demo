import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ScoreViewerPage from './pages/ScoreViewerPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/viewer" element={<ScoreViewerPage />} />
      </Routes>
    </Router>
  )
}

export default App

