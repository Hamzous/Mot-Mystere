import { evaluerProposition } from './evaluerProposition'

export const LONGUEUR_MOT = 5
export const ESSAIS_MAX = 6

// L'état de départ d'une partie
export function creerEtatInitial(motMystere) {
  return {
    motMystere: motMystere,  // sans accents, en majuscules
    essais: [],              // les mots déjà validés
    resultats: [],           // les couleurs de chaque mot validé
    propositionEnCours: '',  // la ligne en cours de saisie
    statut: 'en_cours',      // 'en_cours' | 'gagne' | 'perdu'
  }
}

// Reçoit l'état actuel + une action, et renvoie le NOUVEL état
export function reducteurPartie(etat, action) {
  // Partie finie : on ne peut plus rien faire (sauf recommencer)
  if (etat.statut !== 'en_cours' && action.type !== 'NOUVELLE_PARTIE') {
    return etat
  }

  switch (action.type) {
    case 'AJOUTER_LETTRE': {
      // pas plus de 5 lettres
      if (etat.propositionEnCours.length >= LONGUEUR_MOT) {
        return etat
      }
      return { ...etat, propositionEnCours: etat.propositionEnCours + action.lettre }
    }

    case 'EFFACER_LETTRE': {
      // slice(0, -1) enlève la dernière lettre
      return { ...etat, propositionEnCours: etat.propositionEnCours.slice(0, -1) }
    }

    case 'VALIDER': {
      // la ligne doit être complète
      if (etat.propositionEnCours.length !== LONGUEUR_MOT) {
        return etat
      }

      const couleurs = evaluerProposition(etat.motMystere, etat.propositionEnCours)
      const nouveauxEssais = [...etat.essais, etat.propositionEnCours]
      const nouveauxResultats = [...etat.resultats, couleurs]

      let nouveauStatut = 'en_cours'
      if (etat.propositionEnCours === etat.motMystere) {
        nouveauStatut = 'gagne'
      } else if (nouveauxEssais.length === ESSAIS_MAX) {
        nouveauStatut = 'perdu'
      }

      return {
        ...etat,
        essais: nouveauxEssais,
        resultats: nouveauxResultats,
        propositionEnCours: '',
        statut: nouveauStatut,
      }
    }

    case 'NOUVELLE_PARTIE': {
      return creerEtatInitial(action.motMystere)
    }

    default:
      return etat
  }
}