import motsSolutions from '../data/mots_solutions.json'
import { normaliser } from './normaliser'
import { FUSEAU, DATE_DEPART } from '../config'

// La date d'aujourd'hui en France, au format "2026-10-25".
// Le format 'en-CA' (anglais du Canada) écrit les dates sous la forme année-mois-jour.
export function dateParis(date = new Date(), fuseau = FUSEAU) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: fuseau,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// Nombre de jours entre la date de départ et la date donnée (ex : "2026-10-25").
// Date.UTC évite les décalages dus au changement d'heure été / hiver.
export function numeroDuJour(dateTexte, depart = DATE_DEPART) {
  const [annee, mois, jour] = dateTexte.split('-').map(Number)
  const [anneeD, moisD, jourD] = depart.split('-').map(Number)

  const millisecondes = Date.UTC(annee, mois - 1, jour) - Date.UTC(anneeD, moisD - 1, jourD)
  return Math.round(millisecondes / 86400000) // 86 400 000 ms = 1 jour
}

// Renvoie le mot du jour : { mot, motAffiche, numero, date }
export function tirerMotDuJour(dateTexte = dateParis(), depart = DATE_DEPART) {
  const numero = numeroDuJour(dateTexte, depart)
  const taille = motsSolutions.length

  // le double modulo évite un index négatif si la date est avant la date de départ
  const index = ((numero % taille) + taille) % taille

  const motAffiche = motsSolutions[index]
  return { mot: normaliser(motAffiche), motAffiche: motAffiche, numero: numero, date: dateTexte }
}

// Nombre de secondes avant minuit à Paris (pour le compte à rebours)
export function secondesAvantMinuit(date = new Date(), fuseau = FUSEAU) {
  const heure = new Intl.DateTimeFormat('en-GB', {
    timeZone: fuseau,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date) // ex : "21:59:59"

  const [h, m, s] = heure.split(':').map(Number)
  return 24 * 3600 - (h * 3600 + m * 60 + s)
}

// 3725 secondes donne "01:02:05"
export function formaterDuree(secondes) {
  const h = Math.floor(secondes / 3600)
  const m = Math.floor((secondes % 3600) / 60)
  const s = secondes % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}