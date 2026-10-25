import { ESSAIS_MAX, POINTS_PAR_ESSAI } from '../config'

// 1 essai = 600 points, 2 = 500, ... 6 = 100, perdu = 0
// Mode difficile : points multipliés par 1,5
export function calculerPoints(statut, nbEssais, difficile = false) {
  if (statut !== 'gagne') {
    return 0
  }
  const points = (ESSAIS_MAX + 1 - nbEssais) * POINTS_PAR_ESSAI
  if (difficile) {
    return points * 1.5
  }
  return points
}