import { describe, it, expect } from 'vitest'
import {
  dateParis,
  numeroDuJour,
  tirerMotDuJour,
  secondesAvantMinuit,
  formaterDuree,
} from './motDuJour'

describe('dateParis', () => {
  it('change de jour à minuit heure de Paris (été)', () => {
    // 21:59:59 UTC = 23:59:59 à Paris en été (UTC+2)
    expect(dateParis(new Date('2026-10-24T21:59:59Z'), 'Europe/Paris')).toBe('2026-10-24')
    expect(dateParis(new Date('2026-10-24T22:00:00Z'), 'Europe/Paris')).toBe('2026-10-25')
  })

  it('change de jour à minuit heure de Paris (hiver)', () => {
    // 22:59:59 UTC = 23:59:59 à Paris en hiver (UTC+1)
    expect(dateParis(new Date('2026-12-31T22:59:59Z'), 'Europe/Paris')).toBe('2026-12-31')
    expect(dateParis(new Date('2026-12-31T23:00:00Z'), 'Europe/Paris')).toBe('2027-01-01')
  })
})

describe('numeroDuJour', () => {
  it('vaut 0 le jour de départ et augmente de 1 chaque jour', () => {
    expect(numeroDuJour('2026-10-01', '2026-10-01')).toBe(0)
    expect(numeroDuJour('2026-10-11', '2026-10-01')).toBe(10)
  })

  it('compte bien 2 jours malgré le changement d\'heure du 25 octobre', () => {
    expect(numeroDuJour('2026-10-26', '2026-10-24')).toBe(2)
  })
})

describe('tirerMotDuJour', () => {
  it('donne le même mot pour une même date', () => {
    const a = tirerMotDuJour('2026-10-25', '2026-10-01')
    const b = tirerMotDuJour('2026-10-25', '2026-10-01')
    expect(a.mot).toBe(b.mot)
  })

  it('donne un mot de 5 lettres en majuscules, avec sa version accentuée', () => {
    const jour = tirerMotDuJour('2026-10-25', '2026-10-01')
    expect(jour.mot).toMatch(/^[A-Z]{5}$/)
    expect(jour.motAffiche.length).toBe(5)
  })
})

describe('compte à rebours', () => {
  it('calcule les secondes restantes avant minuit à Paris', () => {
    expect(secondesAvantMinuit(new Date('2026-10-24T21:59:59Z'), 'Europe/Paris')).toBe(1)
    expect(secondesAvantMinuit(new Date('2026-10-24T20:00:00Z'), 'Europe/Paris')).toBe(7200)
  })

  it('formate une durée en heures:minutes:secondes', () => {
    expect(formaterDuree(3725)).toBe('01:02:05')
    expect(formaterDuree(59)).toBe('00:00:59')
  })
})