import { describe, it, expect } from 'vitest'
import { formaterJourMois, genererTextePartage } from './partage'

const resultatsGagnes = [
  ['gris', 'jaune', 'gris', 'gris', 'gris'],
  ['gris', 'vert', 'jaune', 'gris', 'gris'],
  ['vert', 'vert', 'gris', 'vert', 'gris'],
  ['vert', 'vert', 'vert', 'vert', 'vert'],
]

describe('formaterJourMois', () => {
  it('met la date au format jour/mois', () => {
    expect(formaterJourMois('2026-10-21')).toBe('21/10')
  })
})

describe('genererTextePartage', () => {
  it('donne exactement le texte de l\'exemple du sujet', () => {
    const texte = genererTextePartage('2026-10-21', resultatsGagnes, 'gagne')
    expect(texte).toBe(
      'Le Mot Mystère 21/10 · 4/6\n⬛🟨⬛⬛⬛\n⬛🟩🟨⬛⬛\n🟩🟩⬛🟩⬛\n🟩🟩🟩🟩🟩'
    )
  })

  it('écrit X/6 quand la partie est perdue', () => {
    const resultatsPerdus = []
    for (let i = 0; i < 6; i++) {
      resultatsPerdus.push(['gris', 'gris', 'gris', 'gris', 'gris'])
    }
    const texte = genererTextePartage('2026-10-21', resultatsPerdus, 'perdu')
    expect(texte.split('\n')[0]).toBe('Le Mot Mystère 21/10 · X/6')
  })

  it('ne contient aucune lettre dans la grille de carrés', () => {
    const texte = genererTextePartage('2026-10-21', resultatsGagnes, 'gagne')
    const grille = texte.split('\n').slice(1)
    for (const ligne of grille) {
      expect(ligne).not.toMatch(/[A-Za-z]/)
    }
  })
})