import motsSolutions from '../data/mots_solutions.json'
import { normaliser } from './normaliser'

// Tire un mot au hasard et renvoie deux versions :
// - mot : sans accents, en majuscules (pour jouer)
// - motAffiche : tel qu'écrit dans la liste, avec ses accents (pour l'écran de fin)
export function tirerMotMystere() {
  const index = Math.floor(Math.random() * motsSolutions.length)
  const motAffiche = motsSolutions[index]
  return { mot: normaliser(motAffiche), motAffiche: motAffiche }
}