import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lireScores } from '../storage/storage'
import { meilleuresParties, classementDuJour, filtrerParMode } from '../game/classement'
import { dateParis, formaterDuree } from '../game/motDuJour'

function Scores() {
  // lus une seule fois, à l'ouverture de la page
  const [parties] = useState(lireScores)
  const [jour] = useState(() => dateParis())
  const [onglet, setOnglet] = useState('jour')
  const [filtreMode, setFiltreMode] = useState('tous')

  // on filtre d'abord, puis on garde les 10 meilleures
  const general = meilleuresParties(filtrerParMode(parties, filtreMode))
  const duJour = classementDuJour(parties, jour)

  return (
    <div className="page-scores">
      <h1>Scores</h1>

      <div className="onglets">
        <button
          className={onglet === 'jour' ? 'onglet actif' : 'onglet'}
          onClick={() => setOnglet('jour')}
        >
          Mot du jour
        </button>
        <button
          className={onglet === 'general' ? 'onglet actif' : 'onglet'}
          onClick={() => setOnglet('general')}
        >
          Général
        </button>
      </div>

      {onglet === 'jour' && (
        <>
          <p>Classement du {jour.split('-').reverse().join('/')}</p>
          {duJour.length === 0 ? (
            <p>Personne n'a encore trouvé le mot du jour.</p>
          ) : (
            <table className="tableau-scores">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pseudo</th>
                  <th>Essais</th>
                  <th>Points</th>
                  <th>Temps</th>
                </tr>
              </thead>
              <tbody>
                {duJour.map((partie, index) => (
                  <tr key={partie.date + partie.pseudo}>
                    <td>{index + 1}</td>
                    <td>{partie.pseudo}</td>
                    <td>{partie.essais}</td>
                    <td>{partie.points}</td>
                    <td>
                      {partie.duree == null ? '-' : formaterDuree(Math.round(partie.duree / 1000))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {onglet === 'general' && (
        <>
          <label className="filtre-scores">
            Mode :
            <select value={filtreMode} onChange={(e) => setFiltreMode(e.target.value)}>
              <option value="tous">Tous</option>
              <option value="normal">Normal</option>
              <option value="difficile">Difficile</option>
            </select>
          </label>

          {general.length === 0 ? (
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
                  <th>Mode</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {general.map((partie, index) => (
                  <tr key={partie.date + partie.pseudo}>
                    <td>{index + 1}</td>
                    <td>{partie.pseudo}</td>
                    <td>{partie.mot}</td>
                    <td>{partie.essais}</td>
                    <td>{partie.points}</td>
                    <td>{partie.difficile ? 'Difficile' : 'Normal'}</td>
                    <td>{new Date(partie.date).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <Link to="/">Retour à l'accueil</Link>
    </div>
  )
}

export default Scores