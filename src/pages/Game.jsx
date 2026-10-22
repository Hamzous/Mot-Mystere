import { useReducer, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Grille from '../components/Grille'
import { reducteurPartie, creerEtatInitial } from '../game/reducteurPartie'
import { tirerMotMystere } from '../game/motMystere'
import { calculerPoints } from '../game/score'

function Game() {
  const [etat, dispatch] = useReducer(reducteurPartie, null, () =>
    creerEtatInitial(tirerMotMystere())
  )

  useEffect(() => {
    function surTouche(evenement) {
      if (evenement.ctrlKey || evenement.metaKey || evenement.altKey) {
        return
      }

      if (evenement.key === 'Enter') {
        dispatch({ type: 'VALIDER' })
      } else if (evenement.key === 'Backspace') {
        dispatch({ type: 'EFFACER_LETTRE' })
      } else if (/^[a-zA-Z]$/.test(evenement.key)) {
        dispatch({ type: 'AJOUTER_LETTRE', lettre: evenement.key.toUpperCase() })
      }
    }

    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [])

  function rejouer() {
    dispatch({ type: 'NOUVELLE_PARTIE', motMystere: tirerMotMystere() })
  }

  const partieFinie = etat.statut !== 'en_cours'

  return (
    <div className="page-jeu">
      <h1>Le Mot Mystère</h1>

      <Grille
        essais={etat.essais}
        resultats={etat.resultats}
        propositionEnCours={etat.propositionEnCours}
      />

      {partieFinie && (
        <div className="fin-partie">
          {etat.statut === 'gagne' ? (
            <p>Bravo ! Tu as trouvé le mot.</p>
          ) : (
            <p>Perdu... Le mot était : {etat.motMystere}</p>
          )}
          <p>Points : {calculerPoints(etat.statut, etat.essais.length)}</p>
          <button onClick={rejouer}>Nouvelle partie</button>
          <Link to="/">Retour à l'accueil</Link>
        </div>
      )}
    </div>
  )
}

export default Game