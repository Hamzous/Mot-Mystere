import { describe, it, expect } from 'vitest'
import { meilleuresParties, classementDuJour } from './classement'

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
function partieDuJour(pseudo, points, duree, jour = '2026-10-25', statut = 'gagne') {
  return {
    pseudo,
    mot: 'brume',
    essais: 3,
    points,
    statut,
    date: '2026-10-25T10:00:00.000Z',
    mode: 'jour',
    jour,
    duree,
  }
}

describe('classementDuJour', () => {
  it('ignore les parties libres et celles des autres jours', () => {
    const parties = [
      partieDuJour('A', 300, 1000),
      partieDuJour('B', 600, 1000, '2026-10-24'),
      { ...partieDuJour('C', 600, 1000), mode: 'libre' },
    ]
    expect(classementDuJour(parties, '2026-10-25').map((p) => p.pseudo)).toEqual(['A'])
  })

  it('classe par points décroissants', () => {
    const parties = [partieDuJour('A', 200, 1000), partieDuJour('B', 500, 9000)]
    expect(classementDuJour(parties, '2026-10-25').map((p) => p.pseudo)).toEqual(['B', 'A'])
  })

  it('départage les égalités de points par le temps de résolution', () => {
    const parties = [partieDuJour('Lent', 300, 90000), partieDuJour('Rapide', 300, 20000)]
    expect(classementDuJour(parties, '2026-10-25').map((p) => p.pseudo)).toEqual(['Rapide', 'Lent'])
  })

  it('met en dernier une partie sans durée en cas d\'égalité de points', () => {
    const parties = [partieDuJour('SansTemps', 300, null), partieDuJour('AvecTemps', 300, 50000)]
    expect(classementDuJour(parties, '2026-10-25').map((p) => p.pseudo)).toEqual(['AvecTemps', 'SansTemps'])
  })

  it('ne classe pas les parties perdues', () => {
    const parties = [partieDuJour('A', 0, 1000, '2026-10-25', 'perdu')]
    expect(classementDuJour(parties, '2026-10-25').length).toBe(0)
  })
})