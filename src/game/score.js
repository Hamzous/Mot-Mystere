// 1 essai = 600 points, 2 = 500, ... 6 = 100, perdu = 0
export function calculerPoints(statut, nbEssais) {
  if (statut !== 'gagne') {
    return 0
  }
  return (7 - nbEssais) * 100
}