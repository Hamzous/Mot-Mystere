import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lireScores } from '../storage/storage'
import { meilleuresParties } from '../game/classement'

function Scores() {
  // on lit les parties une seule fois, à l'ouverture de la page
  const [parties] = useState(lireScores)
  const classement = meilleuresParties(parties)

  return (
    <div className="page-scores">
      <h1>Scores</h1>

      {classement.length === 0 ? (
        <p>Aucune partie gagnée pour l'instant.</p>
      ) : (
        <table className="tableau-scores">
          <thead>
            <tr>
              <th>#</th>
              <th>Pseudo</th>
              <th>Mot</th>
              <th>Essais</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {classement.map((partie, index) => (
              <tr key={partie.date + partie.pseudo}>
                <td>{index + 1}</td>
                <td>{partie.pseudo}</td>
                <td>{partie.mot}</td>
                <td>{partie.essais}</td>
                <td>{partie.points}</td>
                <td>{new Date(partie.date).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/">Retour à l'accueil</Link>
    </div>
  )
}

export default Scores