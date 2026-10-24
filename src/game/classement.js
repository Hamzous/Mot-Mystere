import { TAILLE_CLASSEMENT } from '../config'
// Renvoie les meilleures parties : seulement les parties gagnées,
// classées par points décroissants, puis par date (la plus ancienne d'abord).
export function meilleuresParties(parties, nombre = TAILLE_CLASSEMENT) {
  const gagnees = parties.filter((partie) => partie.statut === 'gagne')

  gagnees.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points
    }
    // égalité de points : le critère de départage est la date
    return a.date.localeCompare(b.date)
  })

  return gagnees.slice(0, nombre)
}