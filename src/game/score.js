import { ESSAIS_MAX, POINTS_PAR_ESSAI } from '../config'

// 1 essai = 600 points, 2 = 500, ... 6 = 100, perdu = 0
export function calculerPoints(statut, nbEssais) {
  if (statut !== 'gagne') {
    return 0
  }
  return (ESSAIS_MAX + 1 - nbEssais) * POINTS_PAR_ESSAI
}