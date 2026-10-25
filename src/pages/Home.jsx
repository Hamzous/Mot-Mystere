import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { lirePseudo, enregistrerPseudo } from '../storage/storage'
import { LONGUEUR_MOT, ESSAIS_MAX } from '../config'
import CompteARebours from '../components/CompteARebours'

function Home() {
  // Le pseudo affiché dans le champ. Au départ, on reprend celui déjà enregistré.
  const [pseudo, setPseudo] = useState(lirePseudo)
  const navigate = useNavigate()

  // destination : '/jeu' (partie libre) ou '/jour' (mot du jour)
  function lancer(destination) {
    const pseudoPropre = pseudo.trim() // enlève les espaces au début et à la fin
    if (pseudoPropre === '') {
      return // pas de pseudo, on ne lance pas la partie
    }
    enregistrerPseudo(pseudoPropre)
    navigate(destination)
  }

  // Le formulaire (bouton ou touche Entrée) lance une partie libre
  function validerFormulaire(evenement) {
    evenement.preventDefault()
    lancer('/jeu')
  }

  return (
    <div className="page-accueil">
      <h1>Le Mot Mystère</h1>
      <p>Trouve le mot de {LONGUEUR_MOT} lettres en {ESSAIS_MAX} essais maximum.</p>

      <form onSubmit={validerFormulaire}>
        <input
          type="text"
          placeholder="Ton pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          maxLength={20}
        />
        <button type="submit">Partie libre</button>
        <button type="button" className="bouton-secondaire" onClick={() => lancer('/jour')}>
          Mot du jour
        </button>
      </form>

      <CompteARebours />

      <nav className="liens-accueil">
        <Link to="/scores">Scores</Link>
        <Link to="/stats">Statistiques</Link>
        <Link to="/regles">Règles</Link>
      </nav>
    </div>
  )
}

export default Home