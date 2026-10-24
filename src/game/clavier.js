// Une lettre peut avoir été vue plusieurs fois avec des couleurs différentes.
// On garde la meilleure information : vert > jaune > gris.
const PRIORITE = { gris: 1, jaune: 2, vert: 3 }

// Renvoie un objet du type { A: 'vert', R: 'jaune', Z: 'gris' }
// (les lettres jamais jouées n'y sont pas)
export function etatsLettres(essais, resultats) {
  const etats = {}

  for (let i = 0; i < essais.length; i++) {
    for (let j = 0; j < essais[i].length; j++) {
      const lettre = essais[i][j]
      const couleur = resultats[i][j]

      // on remplace seulement si la nouvelle couleur est "meilleure"
      if (!etats[lettre] || PRIORITE[couleur] > PRIORITE[etats[lettre]]) {
        etats[lettre] = couleur
      }
    }
  }

  return etats
}