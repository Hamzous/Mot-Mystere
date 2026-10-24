import { describe, it, expect } from 'vitest'
import { etatsLettres } from './clavier'
import { evaluerProposition } from './evaluerProposition'

describe('etatsLettres', () => {
  it('ne contient aucune lettre quand rien n\'a été joué', () => {
    expect(etatsLettres([], [])).toEqual({})
  })

  it('donne la couleur de chaque lettre jouée', () => {
    const resultats = [evaluerProposition('ARBRE', 'CLOUT')]
    const etats = etatsLettres(['CLOUT'], resultats)
    expect(etats.C).toBe('gris')
    expect(etats.A).toBeUndefined()
  })

  it('garde le vert même si la lettre est jaune ailleurs', () => {
    // ERRER sur ARBRE : le premier R (3e) est jaune, le deuxième (2e) est vert
    const resultats = [evaluerProposition('ARBRE', 'ERRER')]
    const etats = etatsLettres(['ERRER'], resultats)
    expect(etats.R).toBe('vert')
    expect(etats.E).toBe('jaune')
  })

  it('une lettre jaune ne repasse pas en gris dans un essai suivant', () => {
    const essais = ['ERRER', 'EEEEE']
    const resultats = [evaluerProposition('ARBRE', 'ERRER'), evaluerProposition('ARBRE', 'EEEEE')]
    const etats = etatsLettres(essais, resultats)
    // dans EEEEE, le E final est vert (ARBRE finit par E)
    expect(etats.E).toBe('vert')
  })
})