import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lireScores, lirePseudo } from '../storage/storage'
import { calculerStats } from '../game/statistiques'

function Stats() {
  // On lit le pseudo et les parties une seule fois, à l'ouverture de la page
  const [pseudo] = useState(() => lirePseudo() || 'Anonyme')
  const [parties] = useState(lireScores)

  // Seulement les parties de ce joueur
  const stats = calculerStats(parties.filter((partie) => partie.pseudo === pseudo))

  // La barre la plus longue = la plus grande valeur (au moins 1 pour éviter de diviser par 0)
  const maximum = Math.max(...stats.repartition, 1)

  return (
    <div className="page-stats">
      <h1>Statistiques</h1>
      <p>Joueur : <strong>{pseudo}</strong></p>

      {stats.jouees === 0 ? (
        <p>Aucune partie jouée pour l'instant.</p>
      ) : (
        <>
          <div className="grille-stats">
            <div className="stat"><span className="valeur">{stats.jouees}</span>Parties jouées</div>
            <div className="stat"><span className="valeur">{stats.pourcentageVictoires} %</span>Victoires</div>
            <div className="stat"><span className="valeur">{stats.serieEnCours}</span>Série en cours</div>
            <div className="stat"><span className="valeur">{stats.meilleureSerie}</span>Meilleure série</div>
            <div className="stat"><span className="valeur">{stats.totalPoints}</span>Total des points</div>
          </div>

          <h2>Victoires par nombre d'essais</h2>
          <div className="repartition">
            {stats.repartition.map((nombre, index) => (
              <div className="ligne-repartition" key={index}>
                <span className="essai">{index + 1}</span>
                <div className="barre" style={{ width: (nombre / maximum) * 100 + '%' }}>
                  {nombre}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Link to="/">Retour à l'accueil</Link>
    </div>
  )
}

export default Stats