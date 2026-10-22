import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page-accueil">
      <h1>Le Mot Mystère</h1>
      <p>Trouve le mot de 5 lettres en 6 essais maximum.</p>

      <Link to="/jeu">Jouer</Link>

      <nav className="liens-accueil">
        <Link to="/scores">Scores</Link>
        <Link to="/stats">Statistiques</Link>
        <Link to="/regles">Règles</Link>
      </nav>
    </div>
  )
}

export default Home