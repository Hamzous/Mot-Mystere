import { describe, it, expect } from 'vitest'
import { evaluerProposition } from './evaluerProposition'

describe('evaluerProposition', () => {
  it('tout vert quand le mot est trouvé', () => {
    expect(evaluerProposition('ARBRE', 'ARBRE')).toEqual(['vert', 'vert', 'vert', 'vert', 'vert'])
  })

  it('tout gris quand aucune lettre en commun', () => {
    expect(evaluerProposition('ARBRE', 'CLOUT')).toEqual(['gris', 'gris', 'gris', 'gris', 'gris'])
  })

  it('ARBRE / ERRER : pas plus de jaunes que de lettres dans le mot', () => {
    expect(evaluerProposition('ARBRE', 'ERRER')).toEqual(['jaune', 'vert', 'jaune', 'gris', 'gris'])
  })

  it('PLAGE / ALLEE : le deuxième L est gris', () => {
    expect(evaluerProposition('PLAGE', 'ALLEE')).toEqual(['jaune', 'vert', 'gris', 'gris', 'vert'])
  })

  it('le vert est prioritaire sur le jaune', () => {
    expect(evaluerProposition('PLAGE', 'EEEEE')).toEqual(['gris', 'gris', 'gris', 'gris', 'vert'])
  })
})