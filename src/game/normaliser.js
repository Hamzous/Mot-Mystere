// Transforme "école" en "ECOLE" et "cœur" en "COEUR"
export function normaliser(mot) {
  let resultat = mot

  // œ n'est pas une lettre accentuée, on la remplace à la main
  // (/g : toutes les occurrences, pas seulement la première ; et aussi en majuscule)
  resultat = resultat.replace(/œ/g, 'oe').replace(/Œ/g, 'OE')
  resultat = resultat.replace(/æ/g, 'ae').replace(/Æ/g, 'AE')

  // "NFD" sépare "é" en "e" + accent, puis on supprime les accents
  resultat = resultat.normalize('NFD')
  resultat = resultat.replace(/[\u0300-\u036f]/g, '') // regex pour supprimer les accents associé au normalize avec NFD

  return resultat.toUpperCase()
}