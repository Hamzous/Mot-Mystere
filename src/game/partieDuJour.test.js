import { describe, it, expect } from 'vitest'
import { creerEtatDuJour } from './partieDuJour'

const jour = { mot: 'ARBRE', motAffiche: 'arbre', numero: 3, date: '2026-10-25' }

function creerSauvegarde() {
  return {
    mot: 'ARBRE',
    debut: 1000,
    essais: ['CLOUT'],
    resultats: [['gris', 'gris', 'gris', 'gris', 'gris']],
    propositionEnCours: 'AR',
    statut: 'en_cours',
  }
}

describe('creerEtatDuJour', () => {
  it('démarre une partie neuve quand il n\'y a pas de sauvegarde', () => {
    const etat = creerEtatDuJour(jour, null)
    expect(etat.motMystere).toBe('ARBRE')
    expect(etat.essais).toEqual([])
    expect(etat.statut).toBe('en_cours')
  })

  it('reprend les essais, la ligne en cours et le statut sauvegardés', () => {
    const etat = creerEtatDuJour(jour, creerSauvegarde())
    expect(etat.essais).toEqual(['CLOUT'])
    expect(etat.propositionEnCours).toBe('AR')
    expect(etat.statut).toBe('en_cours')
  })

  it('reprend une partie déjà terminée (elle ne peut pas être rejouée)', () => {
    const sauvegarde = { ...creerSauvegarde(), statut: 'gagne' }
    expect(creerEtatDuJour(jour, sauvegarde).statut).toBe('gagne')
  })

  it('ignore la sauvegarde d\'un autre mot', () => {
    const sauvegarde = { ...creerSauvegarde(), mot: 'PLAGE' }
    expect(creerEtatDuJour(jour, sauvegarde).essais).toEqual([])
  })

  it('ignore une sauvegarde abîmée', () => {
    const sauvegarde = { ...creerSauvegarde(), essais: 'n importe quoi' }
    expect(creerEtatDuJour(jour, sauvegarde).essais).toEqual([])
  })
})