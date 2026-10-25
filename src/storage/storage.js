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

const CLE_SCORES = 'scores'

// Lit la liste des parties enregistrées.
// Si rien n'est enregistré, ou si le texte est illisible, on renvoie une liste vide.
export function lireScores() {
  try {
    const texte = localStorage.getItem(CLE_SCORES)
    if (texte === null) {
      return []
    }
    const liste = JSON.parse(texte)
    if (Array.isArray(liste)) {
      return liste
    }
    return []
  } catch {
    return []
  }
}

// Ajoute une partie terminée à la liste
export function enregistrerPartie(partie) {
  const scores = lireScores()
  scores.push(partie)
  localStorage.setItem(CLE_SCORES, JSON.stringify(scores))
}
const CLE_JOUR = 'partiesDuJour'

// Lit ce qui est enregistré pour le mot du jour : { date: '2026-10-25', joueurs: { Hamza: {...} } }
function lireStockJour() {
  const vide = { date: '', joueurs: {} }
  try {
    const texte = localStorage.getItem(CLE_JOUR)
    if (texte === null) {
      return vide
    }
    const stock = JSON.parse(texte)
    if (stock && typeof stock === 'object' && stock.joueurs && typeof stock.joueurs === 'object') {
      return stock
    }
    return vide
  } catch {
    return vide
  }
}

// La partie du jour d'un joueur, ou null s'il n'a pas commencé aujourd'hui
export function lirePartieDuJour(date, pseudo) {
  const stock = lireStockJour()
  if (stock.date !== date) {
    return null
  }
  return stock.joueurs[pseudo] || null
}

// Enregistre (ou complète) la partie du jour d'un joueur.
// Si la date a changé, les sauvegardes de la veille sont supprimées.
export function sauverPartieDuJour(date, pseudo, donnees) {
  let stock = lireStockJour()
  if (stock.date !== date) {
    stock = { date: date, joueurs: {} }
  }
  // { ...ancien, ...nouveau } : on garde ce qui existait et on remplace ce qui change
  stock.joueurs[pseudo] = { ...stock.joueurs[pseudo], ...donnees }
  localStorage.setItem(CLE_JOUR, JSON.stringify(stock))
}