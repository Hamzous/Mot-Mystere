import { useReducer, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Grille from '../components/Grille'
import { reducteurPartie, creerEtatInitial, LONGUEUR_MOT } from '../game/reducteurPartie'
import { tirerMotMystere } from '../game/motMystere'
import { calculerPoints } from '../game/score'
import { verifierMot , lienWiktionnaire} from '../api/wiktionary'
import { estDansLaListe } from '../game/dictionnaireLocal'

function Game() {
  const [etat, dispatch] = useReducer(reducteurPartie, null, () =>{
    const tirage = tirerMotMystere()
    return creerEtatInitial(tirage.mot, tirage.motAffiche)
  })

  // On écoute le clavier. L'effet dépend de "etat" : à chaque changement d'état,
  // l'ancien écouteur est retiré et un nouveau est ajouté. Comme ça, l'écouteur
  // lit toujours l'état à jour (sinon il garderait une version périmée).
  useEffect(() => {
    // Vérifie le mot auprès du Wiktionnaire, puis valide ou refuse
    async function valider() {
      if (etat.verification || etat.statut !== 'en_cours') {
        return
      }
      if (etat.propositionEnCours.length !== LONGUEUR_MOT) {
        return
      }

      dispatch({ type: 'DEBUT_VERIFICATION' })
      const resultat = await verifierMot(etat.propositionEnCours)

      if (resultat === 'invalide') {
        dispatch({ type: 'MOT_REFUSE', message: "Ce mot n'est pas dans le dictionnaire" })
            } else if (resultat === 'erreur') {
        // API injoignable : on vérifie avec la liste locale à la place
        if (estDansLaListe(etat.propositionEnCours)) {
          dispatch({
            type: 'VALIDER',
            message: 'Dictionnaire indisponible : mot vérifié avec la liste locale',
          })
        } else {
          dispatch({
            type: 'MOT_REFUSE',
            message: "Dictionnaire indisponible : ce mot n'est pas dans la liste locale",
          })
        }
      } else {
        dispatch({ type: 'VALIDER' })
      }
    }

    function surTouche(evenement) {
      // on ignore les raccourcis (Ctrl+R, Cmd+C...)
      if (evenement.ctrlKey || evenement.metaKey || evenement.altKey) {
        return
      }

      if (evenement.key === 'Enter') {
        valider()
      } else if (evenement.key === 'Backspace') {
        dispatch({ type: 'EFFACER_LETTRE' })
      } else if (/^[a-zA-Z]$/.test(evenement.key)) {
        dispatch({ type: 'AJOUTER_LETTRE', lettre: evenement.key.toUpperCase() })
      }
    }

    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [etat])

  function rejouer() {
    const tirage = tirerMotMystere()
    dispatch({ type: 'NOUVELLE_PARTIE', motMystere: tirage.mot, motAffiche: tirage.motAffiche })
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

      {etat.verification && <p className="message">Vérification du mot…</p>}
      {etat.message && !etat.verification && (
        <p className={etat.messageErreur ? 'message erreur' : 'message'}>{etat.message}</p>
      )}

      {partieFinie && (
        <div className="fin-partie">
          <p>{etat.statut === 'gagne' ? 'Bravo ! Tu as trouvé le mot.' : 'Perdu...'}</p>
          <p>
            Le mot était : <strong>{etat.motAffiche}</strong>
          </p>
          <p className="points">Points : {calculerPoints(etat.statut, etat.essais.length)}</p>
          <button onClick={rejouer}>Nouvelle partie</button>
          <Link to="/">Retour à l'accueil</Link>
          <a href={lienWiktionnaire(etat.motAffiche)} target="_blank" rel="noreferrer">
            Voir sur le Wiktionnaire
          </a>
        </div>
      )}
    </div>
  )
}

export default Game