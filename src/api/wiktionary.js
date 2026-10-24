import { normaliser } from '../game/normaliser'

const URL_API = 'https://fr.wiktionary.org/w/api.php'

// Wikimedia demande de s'identifier : mets ton nom de projet et un contact
const ENTETES = {
  'Api-User-Agent': 'LeMotMystere/1.0 (projet scolaire; contact: ton-email@exemple.fr)',
}

const DELAI_MAX = 6000 // 6 secondes, ensuite on considère que l'API ne répond pas

// Mémoire : un mot déjà vérifié n'est pas redemandé à l'API
const memoire = new Map()


// Fait une requête à l'API et renvoie la réponse en objet JavaScript
async function appeler(parametres) {
  const adresse =
    URL_API + '?' + new URLSearchParams({ ...parametres, format: 'json', origin: '*' })

  // AbortController permet d'annuler la requête si elle est trop longue
  const controleur = new AbortController()
  const minuteur = setTimeout(() => controleur.abort(), DELAI_MAX)

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
  // ex : "Catégorie:Formes de noms communs en français", "Catégorie:Formes de verbes en français"
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

  // recherche[1] = la liste des titres trouvés
  const titres = recherche[1]

  // On garde les titres qui, sans accents, sont égaux au mot tapé.
  // On exclut ceux qui ont une majuscule (noms propres comme "Paris").
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
  return 'https://fr.wiktionary.org/wiki/' + encodeURIComponent(mot)
}