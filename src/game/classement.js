import { TAILLE_CLASSEMENT } from '../config'
// Renvoie les meilleures parties : seulement les parties gagnées,
// classées par points décroissants, puis par date (la plus ancienne d'abord).
export function meilleuresParties(parties, nombre = TAILLE_CLASSEMENT) {
  const gagnees = parties.filter((partie) => partie.statut === 'gagne')

  gagnees.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points
    }
    // égalité de points : le critère de départage est la date
    return a.date.localeCompare(b.date)
  })

  return gagnees.slice(0, nombre)
}

// Garde les parties d'un mode : 'tous', 'normal' ou 'difficile'.
// Les parties enregistrées avant le mode difficile n'ont pas le champ : elles comptent comme normales.
export function filtrerParMode(parties, filtre) {
  if (filtre === 'difficile') {
    return parties.filter((partie) => partie.difficile === true)
  }
  if (filtre === 'normal') {
    return parties.filter((partie) => partie.difficile !== true)
  }
  return parties
}

// Classement d'un mot du jour : seulement les parties gagnées sur ce jour-là,
// par points décroissants, puis par temps de résolution (le plus court d'abord).
export function classementDuJour(parties, jour, nombre = TAILLE_CLASSEMENT) {
  const duJour = parties.filter(
    (partie) => partie.mode === 'jour' && partie.jour === jour && partie.statut === 'gagne'
  )

  duJour.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points
    }

    // une durée absente compte comme la pire (Infinity)
    const dureeA = a.duree ?? Infinity
    const dureeB = b.duree ?? Infinity
    if (dureeA !== dureeB) {
      return dureeA - dureeB
    }

    // dernier critère : la date, pour que l'ordre soit toujours le même
    return a.date.localeCompare(b.date)
  })

  return duJour.slice(0, nombre)
}