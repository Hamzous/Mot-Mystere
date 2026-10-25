// ----- Réglages qui viennent du fichier .env -----
export const API_WIKTIONNAIRE = import.meta.env.VITE_WIKTIONNAIRE_API
export const PAGE_WIKTIONNAIRE = import.meta.env.VITE_WIKTIONNAIRE_PAGE
export const USER_AGENT_API = import.meta.env.VITE_API_USER_AGENT
export const DELAI_API_MS = Number(import.meta.env.VITE_API_DELAI_MS)
export const FUSEAU = import.meta.env.VITE_FUSEAU
export const DATE_DEPART = import.meta.env.VITE_DATE_DEPART

// Message clair si le fichier .env est absent ou incomplet
// (ce test doit rester APRÈS les déclarations ci-dessus)
if (
  !API_WIKTIONNAIRE ||
  !PAGE_WIKTIONNAIRE ||
  !USER_AGENT_API ||
  !DELAI_API_MS ||
  !FUSEAU ||
  !DATE_DEPART
) {
  console.error('Configuration manquante : vérifie le fichier .env (voir le README)')
}

// ----- Règles du jeu -----
export const LONGUEUR_MOT = 5
export const ESSAIS_MAX = 6
export const POINTS_PAR_ESSAI = 100
export const TAILLE_CLASSEMENT = 10