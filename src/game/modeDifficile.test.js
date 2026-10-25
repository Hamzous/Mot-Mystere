import { describe, it, expect } from 'vitest'
import { verifierModeDifficile } from './modeDifficile'
import { evaluerProposition } from './evaluerProposition'

describe('verifierModeDifficile', () => {
  // mot mystère ARBRE, premier essai ERRER : E jaune, R vert en 2e position
  const essais = ['ERRER']
  const resultats = [evaluerProposition('ARBRE', 'ERRER')]

  it('accepte tout quand rien n\'a encore été joué', () => {
    expect(verifierModeDifficile([], [], 'CLOUT')).toBe('')
  })

  it('refuse si une lettre verte a changé de place', () => {
    expect(verifierModeDifficile(essais, resultats, 'ECRAN')).toBe(
      'Mode difficile : la lettre n°2 doit être R'
    )
  })

  it('refuse si une lettre jaune n\'est pas réutilisée', () => {
    expect(verifierModeDifficile(essais, resultats, 'ARBRA')).toBe(
      'Mode difficile : le mot doit contenir la lettre E'
    )
  })

  it('accepte une proposition qui respecte tous les indices', () => {
    expect(verifierModeDifficile(essais, resultats, 'ARBRE')).toBe('')
  })
})
