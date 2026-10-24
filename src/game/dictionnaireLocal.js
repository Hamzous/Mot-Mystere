import motsSolutions from '../data/mots_solutions.json'
import { normaliser } from './normaliser'

// On normalise tous les mots de la liste une seule fois (sans accents, en majuscules).
// Un Set permet de savoir très vite si un mot est dedans.
const motsConnus = new Set(motsSolutions.map(normaliser))

// Renvoie true si le mot est dans la liste locale
export function estDansLaListe(mot) {
  return motsConnus.has(mot)
}