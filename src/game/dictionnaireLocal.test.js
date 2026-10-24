import { describe, it, expect } from 'vitest'
import { estDansLaListe } from './dictionnaireLocal'

describe('dictionnaireLocal', () => {
  it('reconnaît un mot de la liste', () => {
    expect(estDansLaListe('ARBRE')).toBe(true)
  })

  it('refuse un mot qui n\'est pas dans la liste', () => {
    expect(estDansLaListe('AEOHF')).toBe(false)
  })
})