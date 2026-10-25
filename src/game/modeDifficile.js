// Mode difficile : chaque proposition doit réutiliser les indices déjà trouvés.
// - une lettre verte doit rester à la même place
// - une lettre jaune doit être présente dans la proposition
// Renvoie un message d'erreur, ou '' si la proposition respecte les indices.
export function verifierModeDifficile(essais, resultats, proposition) {
  for (let i = 0; i < essais.length; i++) {
    for (let j = 0; j < essais[i].length; j++) {
      const lettre = essais[i][j]
      const couleur = resultats[i][j]

      if (couleur === 'vert' && proposition[j] !== lettre) {
        return 'Mode difficile : la lettre n°' + (j + 1) + ' doit être ' + lettre
      }

      if (couleur === 'jaune' && !proposition.includes(lettre)) {
        return 'Mode difficile : le mot doit contenir la lettre ' + lettre
      }
    }
  }

  return ''
}
