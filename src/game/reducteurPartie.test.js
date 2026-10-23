import { describe, it, expect } from 'vitest'
import { reducteurPartie, creerEtatInitial } from './reducteurPartie'
import { calculerPoints } from './score'

// Tape un mot lettre par lettre
function taperMot(etat, mot) {
  let nouvelEtat = etat
  for (const lettre of mot) {
    nouvelEtat = reducteurPartie(nouvelEtat, { type: 'AJOUTER_LETTRE', lettre: lettre })
  }
  return nouvelEtat
}

describe('reducteurPartie', () => {
  it('ajoute une lettre', () => {
    const etat = taperMot(creerEtatInitial('ARBRE'), 'A')
    expect(etat.propositionEnCours).toBe('A')
  })

  it('refuse une sixième lettre', () => {
    const etat = taperMot(creerEtatInitial('ARBRE'), 'ABCDEF')
    expect(etat.propositionEnCours).toBe('ABCDE')
  })

  it('efface la dernière lettre', () => {
    let etat = taperMot(creerEtatInitial('ARBRE'), 'AB')
    etat = reducteurPartie(etat, { type: 'EFFACER_LETTRE' })
    expect(etat.propositionEnCours).toBe('A')
  })

  it('ne valide pas une ligne incomplète', () => {
    let etat = taperMot(creerEtatInitial('ARBRE'), 'AB')
    etat = reducteurPartie(etat, { type: 'VALIDER' })
    expect(etat.essais.length).toBe(0)
  })

  it('détecte la victoire', () => {
    let etat = taperMot(creerEtatInitial('ARBRE'), 'ARBRE')
    etat = reducteurPartie(etat, { type: 'VALIDER' })
    expect(etat.statut).toBe('gagne')
  })

  it('détecte la défaite après 6 essais', () => {
    let etat = creerEtatInitial('ARBRE')
    for (let i = 0; i < 6; i++) {
      etat = taperMot(etat, 'CLOUT')
      etat = reducteurPartie(etat, { type: 'VALIDER' })
    }
    expect(etat.statut).toBe('perdu')
  })

  it('bloque les actions quand la partie est finie', () => {
    let etat = taperMot(creerEtatInitial('ARBRE'), 'ARBRE')
    etat = reducteurPartie(etat, { type: 'VALIDER' })
    etat = reducteurPartie(etat, { type: 'AJOUTER_LETTRE', lettre: 'A' })
    expect(etat.propositionEnCours).toBe('')
  })
})

describe('calculerPoints', () => {
  it('donne 600 points en 1 essai et 100 en 6 essais', () => {
    expect(calculerPoints('gagne', 1)).toBe(600)
    expect(calculerPoints('gagne', 6)).toBe(100)
  })

  it('donne 0 point quand la partie est perdue', () => {
    expect(calculerPoints('perdu', 6)).toBe(0)
  })
})

describe('vérification du dictionnaire', () => {
  it('bloque la saisie pendant la vérification', () => {
    let etat = taperMot(creerEtatInitial('ARBRE'), 'ABCDE')
    etat = reducteurPartie(etat, { type: 'DEBUT_VERIFICATION' })
    etat = reducteurPartie(etat, { type: 'EFFACER_LETTRE' })
    expect(etat.propositionEnCours).toBe('ABCDE')
  })

  it('un mot refusé ne compte pas comme un essai', () => {
    let etat = taperMot(creerEtatInitial('ARBRE'), 'ABCDE')
    etat = reducteurPartie(etat, { type: 'DEBUT_VERIFICATION' })
    etat = reducteurPartie(etat, { type: 'MOT_REFUSE', message: 'refusé' })
    expect(etat.essais.length).toBe(0)
    expect(etat.propositionEnCours).toBe('ABCDE')
    expect(etat.nbRefus).toBe(1)
    expect(etat.verification).toBe(false)
  })

  it('ne lance pas deux vérifications en même temps', () => {
    let etat = taperMot(creerEtatInitial('ARBRE'), 'ABCDE')
    const premiere = reducteurPartie(etat, { type: 'DEBUT_VERIFICATION' })
    const seconde = reducteurPartie(premiere, { type: 'DEBUT_VERIFICATION' })
    expect(seconde).toBe(premiere)
  })

  it('ne démarre pas la vérification sur une ligne incomplète', () => {
    let etat = taperMot(creerEtatInitial('ARBRE'), 'AB')
    etat = reducteurPartie(etat, { type: 'DEBUT_VERIFICATION' })
    expect(etat.verification).toBe(false)
  })
})