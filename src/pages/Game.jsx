import { useReducer, useEffect } from 'react'
import Grille from '../components/Grille'
import { reducteurPartie, creerEtatInitial } from '../game/reducteurPartie'
import { tirerMotMystere } from '../game/motMystere'

function Game() {
  // Le 3e paramètre est exécuté une seule fois, au démarrage : il tire le mot
  const [etat, dispatch] = useReducer(reducteurPartie, null, () =>
    creerEtatInitial(tirerMotMystere())
  )

  // On écoute le clavier de l'ordinateur
  useEffect(() => {
    function surTouche(evenement) {
      // on ignore les raccourcis (Ctrl+R, Cmd+C...)
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
    // nettoyage : on retire l'écouteur quand la page disparaît
    return () => window.removeEventListener('keydown', surTouche)
  }, [])

  return (
    <div className="page-jeu">
      <h1>Le Mot Mystère</h1>
      <Grille
        essais={etat.essais}
        resultats={etat.resultats}
        propositionEnCours={etat.propositionEnCours}
      />
    </div>
  )
}

export default Game