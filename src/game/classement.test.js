import { describe, it, expect } from 'vitest'
import { meilleuresParties } from './classement'

function creerPartie(pseudo, points, date, statut = 'gagne') {
  return { pseudo, mot: 'arbre', essais: 3, points, statut, date }
}

describe('meilleuresParties', () => {
  it('classe par points décroissants', () => {
    const parties = [
      creerPartie('A', 200, '2026-10-01'),
      creerPartie('B', 600, '2026-10-02'),
      creerPartie('C', 400, '2026-10-03'),
    ]
    const resultat = meilleuresParties(parties)
    expect(resultat.map((p) => p.pseudo)).toEqual(['B', 'C', 'A'])
  })

  it('ignore les parties perdues', () => {
    const parties = [
      creerPartie('A', 0, '2026-10-01', 'perdu'),
      creerPartie('B', 100, '2026-10-02'),
    ]
    expect(meilleuresParties(parties).length).toBe(1)
  })

  it('départage deux égalités par la date, toujours dans le même ordre', () => {
    const parties = [
      creerPartie('Tard', 300, '2026-10-09'),
      creerPartie('Tot', 300, '2026-10-01'),
    ]
    expect(meilleuresParties(parties).map((p) => p.pseudo)).toEqual(['Tot', 'Tard'])
  })

  it('garde seulement les 10 meilleures', () => {
    const parties = []
    for (let i = 0; i < 15; i++) {
      parties.push(creerPartie('J' + i, 100 + i, '2026-10-01'))
    }
    expect(meilleuresParties(parties).length).toBe(10)
  })
})