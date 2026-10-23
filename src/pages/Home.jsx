import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { lirePseudo, enregistrerPseudo } from '../storage/storage'

function Home() {
  // Le pseudo affiché dans le champ. Au départ, on reprend celui déjà enregistré.
  const [pseudo, setPseudo] = useState(lirePseudo)

  // navigate permet de changer de page par le code
  const navigate = useNavigate()

  function lancerPartie(evenement) {
    // empêche le rechargement de la page quand on envoie le formulaire
    evenement.preventDefault()

    const pseudoPropre = pseudo.trim() // enlève les espaces au début et à la fin
    if (pseudoPropre === '') {
      return // pas de pseudo, on ne lance pas la partie
    }

    enregistrerPseudo(pseudoPropre)
    navigate('/jeu')
  }

  return (
    <div className="page-accueil">
      <h1>Le Mot Mystère</h1>
      <p>Trouve le mot de 5 lettres en 6 essais maximum.</p>

      <form onSubmit={lancerPartie}>
        <input
          type="text"
          placeholder="Ton pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          maxLength={20}
        />
        <button type="submit">Jouer</button>
      </form>

      <nav className="liens-accueil">
        <Link to="/scores">Scores</Link>
        <Link to="/stats">Statistiques</Link>
        <Link to="/regles">Règles</Link>
      </nav>
    </div>
  )
}

export default Home