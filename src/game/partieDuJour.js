import { creerEtatInitial } from './reducteurPartie'
import { ESSAIS_MAX } from '../config'

const STATUTS = ['en_cours', 'gagne', 'perdu']

// Vérifie qu'une sauvegarde lue dans le navigateur est utilisable.
// (le localStorage peut contenir n'importe quoi : valeur abîmée, ancien format...)
function estSauvegardeValide(sauvegarde, jour) {
  if (!sauvegarde || typeof sauvegarde !== 'object') {
    return false
  }
  // la sauvegarde doit être celle du mot d'aujourd'hui
  if (sauvegarde.mot !== jour.mot) {
    return false
  }
  if (!Array.isArray(sauvegarde.essais) || !Array.isArray(sauvegarde.resultats)) {
    return false
  }
  if (sauvegarde.essais.length !== sauvegarde.resultats.length) {
    return false
  }
  if (sauvegarde.essais.length > ESSAIS_MAX) {
    return false
  }
  if (typeof sauvegarde.propositionEnCours !== 'string') {
    return false
  }
  return STATUTS.includes(sauvegarde.statut)
}

// Crée l'état de la partie du jour : reprend la sauvegarde si elle est valable,
// sinon repart d'une partie neuve.
export function creerEtatDuJour(jour, sauvegarde) {
  const etat = creerEtatInitial(jour.mot, jour.motAffiche)

  if (!estSauvegardeValide(sauvegarde, jour)) {
    return etat
  }

  return {
    ...etat,
    essais: sauvegarde.essais,
    resultats: sauvegarde.resultats,
    propositionEnCours: sauvegarde.propositionEnCours,
    statut: sauvegarde.statut,
  }
}