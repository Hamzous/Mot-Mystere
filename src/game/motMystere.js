import motsSolutions from '../data/mots_solutions.json'
import { normaliser } from './normaliser'

// Tire un mot au hasard dans la liste et le renvoie sans accents, en majuscules
export function tirerMotMystere() {
  // Math.random() donne un nombre entre 0 et 1 (jamais 1).
  // Multiplié par la taille de la liste, puis arrondi vers le bas : on obtient un index valide.
  const index = Math.floor(Math.random() * motsSolutions.length)
  return normaliser(motsSolutions[index])
}