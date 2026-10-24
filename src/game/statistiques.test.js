import { describe, it, expect } from 'vitest'
import { calculerStats } from './statistiques'

function creerPartie(statut, essais, date) {
  const points = statut === 'gagne' ? (7 - essais) * 100 : 0
  return { pseudo: 'A', mot: 'arbre', essais, points, statut, date }
}

describe('calculerStats', () => {
  it('renvoie des zéros quand il n\'y a aucune partie', () => {
    const stats = calculerStats([])
    expect(stats.jouees).toBe(0)
    expect(stats.pourcentageVictoires).toBe(0)
    expect(stats.meilleureSerie).toBe(0)
  })

  it('calcule le pourcentage de victoires et le total des points', () => {
    const stats = calculerStats([
      creerPartie('gagne', 1, '2026-10-01'),
      creerPartie('perdu', 6, '2026-10-02'),
    ])
    expect(stats.jouees).toBe(2)
    expect(stats.pourcentageVictoires).toBe(50)
    expect(stats.totalPoints).toBe(600)
  })

  it('une défaite remet la série en cours à zéro', () => {
    const stats = calculerStats([
      creerPartie('gagne', 2, '2026-10-01'),
      creerPartie('gagne', 3, '2026-10-02'),
      creerPartie('perdu', 6, '2026-10-03'),
    ])
    expect(stats.serieEnCours).toBe(0)
    expect(stats.meilleureSerie).toBe(2)
  })

  it('compte la série en cours et garde la meilleure série', () => {
    const stats = calculerStats([
      creerPartie('gagne', 2, '2026-10-01'),
      creerPartie('gagne', 2, '2026-10-02'),
      creerPartie('gagne', 2, '2026-10-03'),
      creerPartie('perdu', 6, '2026-10-04'),
      creerPartie('gagne', 4, '2026-10-05'),
    ])
    expect(stats.serieEnCours).toBe(1)
    expect(stats.meilleureSerie).toBe(3)
  })

  it('calcule les séries dans l\'ordre des dates, même si la liste est mélangée', () => {
    const stats = calculerStats([
      creerPartie('perdu', 6, '2026-10-02'),
      creerPartie('gagne', 3, '2026-10-01'),
      creerPartie('gagne', 3, '2026-10-03'),
    ])
    expect(stats.serieEnCours).toBe(1)
    expect(stats.meilleureSerie).toBe(1)
  })

  it('répartit les victoires selon le nombre d\'essais', () => {
    const stats = calculerStats([
      creerPartie('gagne', 3, '2026-10-01'),
      creerPartie('gagne', 3, '2026-10-02'),
      creerPartie('gagne', 5, '2026-10-03'),
    ])
    expect(stats.repartition).toEqual([0, 0, 2, 0, 1, 0])
  })
})