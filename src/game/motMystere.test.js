import { describe, it, expect } from 'vitest'
import motsSolutions from '../data/mots_solutions.json'
import { normaliser } from './normaliser'
import { tirerMotMystere } from './motMystere'

describe('motMystere', () => {
  it('tire un mot de 5 lettres en majuscules', () => {
    const { mot } = tirerMotMystere()
    expect(mot).toMatch(/^[A-Z]{5}$/)
  })

  it('le mot affiché, une fois normalisé, donne le mot de jeu', () => {
    const { mot, motAffiche } = tirerMotMystere()
    expect(normaliser(motAffiche)).toBe(mot)
  })

  it('tous les mots de la liste font 5 lettres une fois normalisés', () => {
    for (const mot of motsSolutions) {
      expect(normaliser(mot)).toMatch(/^[A-Z]{5}$/)
    }
  })
})