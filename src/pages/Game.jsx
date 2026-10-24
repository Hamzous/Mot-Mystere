import { useReducer, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Grille from '../components/Grille'
import Keyboard from '../components/Keyboard'
import { reducteurPartie, creerEtatInitial, LONGUEUR_MOT } from '../game/reducteurPartie'
import { tirerMotMystere } from '../game/motMystere'
import { calculerPoints } from '../game/score'
import { etatsLettres } from '../game/clavier'
import { estDansLaListe } from '../game/dictionnaireLocal'
import { verifierMot, lienWiktionnaire } from '../api/wiktionary'
import { lirePseudo, enregistrerPartie } from '../storage/storage'

function Game() {
  // Le 3e paramètre est exécuté une seule fois, au démarrage : il tire le mot
  const [etat, dispatch] = useReducer(reducteurPartie, null, () => {
    const tirage = tirerMotMystere()
    return creerEtatInitial(tirage.mot, tirage.motAffiche)
  })

  // Une touche, qu'elle vienne du vrai clavier ou du clavier à l'écran.
  // touche = une lettre ('A'), 'ENTREE' ou 'EFFACER'
  const traiterTouche = useCallback(
    async (touche) => {
      if (touche === 'EFFACER') {
        dispatch({ type: 'EFFACER_LETTRE' })
        return
      }
      if (touche !== 'ENTREE') {
        dispatch({ type: 'AJOUTER_LETTRE', lettre: touche })
        return
      }

      // Entrée : on vérifie le mot auprès du Wiktionnaire, puis on valide ou on refuse
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
    },
    [etat]
  )

  // On écoute le vrai clavier. L'effet se relance quand traiterTouche change (donc quand
  // l'état change) : l'écouteur lit ainsi toujours l'état à jour.
  useEffect(() => {
    function surClavier(evenement) {
      // on ignore les raccourcis (Ctrl+R, Cmd+C...)
      if (evenement.ctrlKey || evenement.metaKey || evenement.altKey) {
        return
      }

      if (evenement.key === 'Enter') {
        traiterTouche('ENTREE')
      } else if (evenement.key === 'Backspace') {
        traiterTouche('EFFACER')
      } else if (/^[a-zA-Z]$/.test(evenement.key)) {
        traiterTouche(evenement.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', surClavier)
    // nettoyage : on retire l'écouteur avant d'en ajouter un nouveau
    return () => window.removeEventListener('keydown', surClavier)
  }, [traiterTouche])

  // Quand la partie se termine, on l'enregistre une seule fois
  useEffect(() => {
    if (etat.statut === 'en_cours') {
      return
    }
    enregistrerPartie({
      pseudo: lirePseudo() || 'Anonyme',
      mot: etat.motAffiche,
      essais: etat.essais.length,
      points: calculerPoints(etat.statut, etat.essais.length),
      statut: etat.statut,
      date: new Date().toISOString(),
    })
  }, [etat.statut, etat.motAffiche, etat.essais.length])

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

      <Keyboard
        etats={etatsLettres(etat.essais, etat.resultats)}
        surTouche={traiterTouche}
        desactive={etat.verification || partieFinie}
      />

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