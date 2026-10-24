import { ESSAIS_MAX } from '../config'

// Calcule les statistiques à partir d'une liste de parties (celles d'un seul joueur)
export function calculerStats(parties) {
  // On range les parties de la plus ancienne à la plus récente (pour les séries)
  const triees = [...parties].sort((a, b) => a.date.localeCompare(b.date))

  const jouees = triees.length
  let victoires = 0
  let totalPoints = 0
  let serieEnCours = 0
  let meilleureSerie = 0

  // repartition[0] = victoires en 1 essai, repartition[5] = victoires en 6 essais
  const repartition = new Array(ESSAIS_MAX).fill(0)
  
  for (const partie of triees) {
    totalPoints += partie.points

    if (partie.statut === 'gagne') {
      victoires++
      serieEnCours++
      repartition[partie.essais - 1]++
      if (serieEnCours > meilleureSerie) {
        meilleureSerie = serieEnCours
      }
    } else {
      // une défaite remet la série à zéro
      serieEnCours = 0
    }
  }

  let pourcentageVictoires = 0
  if (jouees > 0) {
    pourcentageVictoires = Math.round((victoires / jouees) * 100)
  }

  return { jouees, victoires, pourcentageVictoires, serieEnCours, meilleureSerie, totalPoints, repartition }
}