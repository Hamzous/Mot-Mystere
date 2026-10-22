// Compare une proposition avec le mot mystère.
// Renvoie un tableau de couleurs : 'vert', 'jaune' ou 'gris'
export function evaluerProposition(motMystere, proposition) {
  // Au départ, tout est gris
  const couleurs = []
  for (let i = 0; i < motMystere.length; i++) {
    couleurs.push('gris')
  }

  // Les lettres du mot mystère pas encore "utilisées"
  const lettresRestantes = []

  // PASSAGE 1 : les verts (bonne lettre, bonne place)
  for (let i = 0; i < motMystere.length; i++) {
    if (proposition[i] === motMystere[i]) {
      couleurs[i] = 'vert'
    } else {
      // pas trouvée, on la garde de côté pour les jaunes
      lettresRestantes.push(motMystere[i])
    }
  }

  // PASSAGE 2 : les jaunes (bonne lettre, mauvaise place)
  for (let i = 0; i < motMystere.length; i++) {
    if (couleurs[i] !== 'vert') {
      const position = lettresRestantes.indexOf(proposition[i])
      if (position !== -1) {
        couleurs[i] = 'jaune'
        // on retire la lettre pour ne pas la compter deux fois
        lettresRestantes.splice(position, 1)
      }
    }
  }

  return couleurs
}