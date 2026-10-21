// Transforme "école" en "ECOLE" et "cœur" en "COEUR"
export function normaliser(mot) {
  let resultat = mot

  // œ n'est pas une lettre accentuée, on la remplace à la main
  resultat = resultat.replace('œ', 'oe')

  // "NFD" sépare "é" en "e" + accent, puis on supprime les accents
  resultat = resultat.normalize('NFD')
  resultat = resultat.replace(/[\u0300-\u036f]/g, '')

  return resultat.toUpperCase()
}