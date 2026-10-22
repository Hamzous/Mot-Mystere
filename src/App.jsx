import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Game from './pages/Game.jsx'
import Scores from './pages/Scores.jsx'
import Stats from './pages/Stats.jsx'
import Rules from './pages/Rules.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jeu" element={<Game />} />
      <Route path="/scores" element={<Scores />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/regles" element={<Rules />} />
    </Routes>
  )
}

export default App
