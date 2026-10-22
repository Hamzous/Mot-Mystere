// Lit le pseudo enregistré dans le navigateur.
// Si rien n'est enregistré, getItem renvoie null : on renvoie alors un texte vide.
export function lirePseudo() {
  const pseudo = localStorage.getItem('pseudo')
  if (pseudo === null) {
    return ''
  }
  return pseudo
}
 
// Enregistre le pseudo dans le navigateur (il sera encore là à la prochaine visite)
export function enregistrerPseudo(pseudo) {
  localStorage.setItem('pseudo', pseudo)
}