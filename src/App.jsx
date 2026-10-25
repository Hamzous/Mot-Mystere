import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import Scores from './pages/Scores'
import Stats from './pages/Stats'
import Rules from './pages/Rules'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* key : sans elle, React garde le même composant en passant de /jeu à /jour et mélange les deux parties */}
      <Route path="/jeu" element={<Game key="libre" mode="libre" />} />
      <Route path="/jour" element={<Game key="jour" mode="jour" />} />
      <Route path="/scores" element={<Scores />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/regles" element={<Rules />} />
    </Routes>
  )
}

export default App