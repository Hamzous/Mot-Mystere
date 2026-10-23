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
    verification: false,     // true pendant qu'on interroge le dictionnaire
    message: '',             // message affiché au joueur
    messageErreur: false,    // true = message d'erreur (en rouge)
    nbRefus: 0,              // nombre de mots refusés (servira à l'animation de tremblement)
  }
}

export function reducteurPartie(etat, action) {
  // Partie finie : on ne peut plus rien faire (sauf recommencer)
  if (etat.statut !== 'en_cours' && action.type !== 'NOUVELLE_PARTIE') {
    return etat
  }

  switch (action.type) {
    case 'AJOUTER_LETTRE': {
      // pas de saisie pendant la vérification, ni plus de 5 lettres
      if (etat.verification || etat.propositionEnCours.length >= LONGUEUR_MOT) {
        return etat
      }
      return {
        ...etat,
        propositionEnCours: etat.propositionEnCours + action.lettre,
        message: '',
        messageErreur: false,
      }
    }

    case 'EFFACER_LETTRE': {
      if (etat.verification) {
        return etat
      }
      return {
        ...etat,
        propositionEnCours: etat.propositionEnCours.slice(0, -1),
        message: '',
        messageErreur: false,
      }
    }

    case 'DEBUT_VERIFICATION': {
      // ligne incomplète, ou vérification déjà en cours : on ne fait rien
      if (etat.verification || etat.propositionEnCours.length !== LONGUEUR_MOT) {
        return etat
      }
      return { ...etat, verification: true, message: '', messageErreur: false }
    }

    case 'MOT_REFUSE': {
      // le mot reste dans la ligne (le joueur peut le corriger) et ne compte pas comme un essai
      return {
        ...etat,
        verification: false,
        message: action.message,
        messageErreur: true,
        nbRefus: etat.nbRefus + 1,
      }
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
        verification: false,
        message: action.message || '',
        messageErreur: false,
      }
    }

    case 'NOUVELLE_PARTIE': {
      return creerEtatInitial(action.motMystere)
    }

    default:
      return etat
  }
}