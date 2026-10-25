import { ESSAIS_MAX, NOM_JEU, EMOJIS_COULEURS } from '../config'

// "2026-10-25" devient "25/10"
export function formaterJourMois(dateTexte) {
  const [, mois, jour] = dateTexte.split('-')
  return jour + '/' + mois
}

// Construit le texte à partager : une ligne d'en-tête, puis une ligne de carrés par essai.
// On part des couleurs uniquement : les lettres ne sont jamais dans le texte.
export function genererTextePartage(dateTexte, resultats, statut) {
  // gagné en 4 essais : "4/6", perdu : "X/6"
  const score = statut === 'gagne' ? resultats.length : 'X'
  const entete = NOM_JEU + ' ' + formaterJourMois(dateTexte) + ' · ' + score + '/' + ESSAIS_MAX

  const lignes = resultats.map((couleurs) =>
    couleurs.map((couleur) => EMOJIS_COULEURS[couleur]).join('')
  )

  return [entete, ...lignes].join('\n')
}