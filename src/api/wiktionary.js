import { normaliser } from '../game/normaliser'
import {
  API_WIKTIONNAIRE,
  PAGE_WIKTIONNAIRE,
  USER_AGENT_API,
  DELAI_API_MS,
} from '../config'

// Wikimedia demande de s'identifier (valeur définie dans le fichier .env)
const ENTETES = { 'Api-User-Agent': USER_AGENT_API }

// Mémoire : un mot déjà vérifié n'est pas redemandé à l'API
const memoire = new Map()

// Fait une requête à l'API et renvoie la réponse en objet JavaScript
async function appeler(parametres) {
  const adresse =
    API_WIKTIONNAIRE + '?' + new URLSearchParams({ ...parametres, format: 'json', origin: '*' })

  // AbortController permet d'annuler la requête si elle est trop longue
  const controleur = new AbortController()
  const minuteur = setTimeout(() => controleur.abort(), DELAI_API_MS)

  try {
    const reponse = await fetch(adresse, { headers: ENTETES, signal: controleur.signal })
    if (!reponse.ok) {
      throw new Error('Erreur HTTP ' + reponse.status)
    }
    return await reponse.json()
  } finally {
    clearTimeout(minuteur)
  }
}

// Une page est un mot français si elle est un "lemme" ou une "forme" en français
function estCategorieFrancaise(titre) {
  if (titre === 'Catégorie:Lemmes en français') {
    return true
  }
  // ex : "Catégorie:Formes de noms communs en français"
  return titre.startsWith('Catégorie:Formes de ') && titre.endsWith(' en français')
}

// Renvoie 'valide' ou 'invalide'. Lance une erreur si l'API ne répond pas.
async function chercherMot(mot) {
  // Étape 1 : on cherche le mot (en minuscules), l'API gère les accents
  const recherche = await appeler({
    action: 'opensearch',
    search: mot.toLowerCase(),
    limit: '50',
    namespace: '0',
  })

  // On garde les titres qui, sans accents, sont égaux au mot tapé.
  // On exclut ceux qui ont une majuscule (noms propres comme "Paris").
  const titres = recherche[1]
  const candidats = titres.filter(
    (titre) => normaliser(titre) === mot && titre === titre.toLowerCase()
  )
  if (candidats.length === 0) {
    return 'invalide'
  }

  // Étape 2 : on regarde les catégories des pages trouvées
  const infos = await appeler({
    action: 'query',
    titles: candidats.join('|'),
    prop: 'categories',
    cllimit: '500',
  })

  const pages = Object.values(infos.query.pages)
  for (const page of pages) {
    if (page.categories) {
      for (const categorie of page.categories) {
        if (estCategorieFrancaise(categorie.title)) {
          return 'valide'
        }
      }
    }
  }
  return 'invalide'
}

// Fonction utilisée par le reste de l'application.
// Renvoie 'valide', 'invalide' ou 'erreur' (API injoignable), sans jamais planter.
export async function verifierMot(mot) {
  if (memoire.has(mot)) {
    return memoire.get(mot)
  }

  try {
    const resultat = await chercherMot(mot)
    memoire.set(mot, resultat)
    return resultat
  } catch {
    // on ne mémorise pas une erreur : la prochaine fois on réessaie
    return 'erreur'
  }
}
// Adresse de la page d'un mot sur le Wiktionnaire (encodeURIComponent gère les accents)
export function lienWiktionnaire(mot) {
  return PAGE_WIKTIONNAIRE + encodeURIComponent(mot)
}