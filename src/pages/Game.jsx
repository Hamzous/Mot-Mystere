import { useState, useReducer, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Grille from '../components/Grille'
import Keyboard from '../components/Keyboard'
import { reducteurPartie, creerEtatInitial, LONGUEUR_MOT } from '../game/reducteurPartie'
import { tirerMotMystere } from '../game/motMystere'
import { tirerMotDuJour } from '../game/motDuJour'
import { creerEtatDuJour } from '../game/partieDuJour'
import { calculerPoints } from '../game/score'
import { etatsLettres } from '../game/clavier'
import { estDansLaListe } from '../game/dictionnaireLocal'
import { verifierModeDifficile } from '../game/modeDifficile'
import { verifierMot, lienWiktionnaire } from '../api/wiktionary'
import {
  lirePseudo,
  enregistrerPartie,
  lirePartieDuJour,
  sauverPartieDuJour,
  lireModeDifficile,
} from '../storage/storage'
import CompteARebours from '../components/CompteARebours'
import BoutonPartage from '../components/boutonPartage'
import { genererTextePartage } from '../game/partage'

function Game({ mode }) {
  const modeJour = mode === 'jour'

  // Lus une seule fois, à l'ouverture de la page
  const [pseudo] = useState(() => lirePseudo() || 'Anonyme')
  const [jour] = useState(() => (modeJour ? tirerMotDuJour() : null))
  const [sauvegarde] = useState(() => (modeJour ? lirePartieDuJour(jour.date, pseudo) : null))
  // Mode difficile : partie libre seulement (le mot du jour reste le même pour tout le monde)
  const [difficile] = useState(() => !modeJour && lireModeDifficile())

  // Partie du jour : on reprend la sauvegarde. Partie libre : on tire un mot au hasard.
  const [etat, dispatch] = useReducer(reducteurPartie, null, () => {
    if (modeJour) {
      return creerEtatDuJour(jour, sauvegarde)
    }
    const tirage = tirerMotMystere()
    return creerEtatInitial(tirage.mot, tirage.motAffiche)
  })

  // true si la partie du jour était déjà terminée à l'ouverture : on ne l'enregistre pas deux fois
  const [dejaTerminee] = useState(modeJour && etat.statut !== 'en_cours')

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

      // Mode difficile : on refuse tout de suite un mot qui oublie un indice (pas besoin du dictionnaire)
      if (difficile) {
        const erreur = verifierModeDifficile(etat.essais, etat.resultats, etat.propositionEnCours)
        if (erreur !== '') {
          dispatch({ type: 'MOT_REFUSE', message: erreur })
          return
        }
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
    [etat, difficile]
  )

  // On écoute le vrai clavier
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
    return () => window.removeEventListener('keydown', surClavier)
  }, [traiterTouche])

  // Partie du jour : à chaque changement, on sauvegarde l'état (pour pouvoir le reprendre).
  // "debut" est écrit la première fois seulement, puis conservé.
  useEffect(() => {
    if (!modeJour) {
      return
    }
    const existante = lirePartieDuJour(jour.date, pseudo)
    sauverPartieDuJour(jour.date, pseudo, {
      mot: jour.mot,
      debut: existante && existante.debut ? existante.debut : Date.now(),
      essais: etat.essais,
      resultats: etat.resultats,
      propositionEnCours: etat.propositionEnCours,
      statut: etat.statut,
    })
  }, [etat, modeJour, jour, pseudo])

  // Quand la partie se termine, on l'enregistre une seule fois
  useEffect(() => {
    if (etat.statut === 'en_cours' || dejaTerminee) {
      return
    }

    // durée de résolution (partie du jour seulement) : de la première ouverture à maintenant
    let duree = null
    if (modeJour) {
      const sauvee = lirePartieDuJour(jour.date, pseudo)
      if (sauvee && sauvee.debut) {
        duree = Date.now() - sauvee.debut
        sauverPartieDuJour(jour.date, pseudo, { duree: duree })
      }
    }

    enregistrerPartie({
      pseudo: pseudo,
      mot: etat.motAffiche,
      essais: etat.essais.length,
      points: calculerPoints(etat.statut, etat.essais.length, difficile),
      statut: etat.statut,
      date: new Date().toISOString(),
      mode: modeJour ? 'jour' : 'libre',
      difficile: difficile,
      jour: modeJour ? jour.date : null,
      duree: duree,
    })
  }, [etat.statut, etat.motAffiche, etat.essais.length, dejaTerminee, modeJour, jour, pseudo, difficile])

  function rejouer() {
    const tirage = tirerMotMystere()
    dispatch({ type: 'NOUVELLE_PARTIE', motMystere: tirage.mot, motAffiche: tirage.motAffiche })
  }

  const partieFinie = etat.statut !== 'en_cours'

  return (
    <div className="page-jeu">
      <h1>Le Mot Mystère</h1>
      {modeJour && <p>Mot du jour du {jour.date.split('-').reverse().join('/')}</p>}
      {difficile && <p>Mode difficile</p>}

      <Grille
        essais={etat.essais}
        resultats={etat.resultats}
        propositionEnCours={etat.propositionEnCours}
        refusee={etat.messageErreur}
        nbRefus={etat.nbRefus}
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
          <p className="points">Points : {calculerPoints(etat.statut, etat.essais.length, difficile)}</p>

          {modeJour ? (
            
            <>
              <BoutonPartage texte={genererTextePartage(jour.date, etat.resultats, etat.statut)} />
              <CompteARebours />
            </>
          ) : (
            <button onClick={rejouer}>Nouvelle partie</button>
          )}

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