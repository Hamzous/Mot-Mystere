import { Link } from 'react-router-dom'
import Ligne from '../components/Ligne'
import { evaluerProposition } from '../game/evaluerProposition'
import { calculerPoints } from '../game/score'
import { LONGUEUR_MOT, ESSAIS_MAX } from '../config'

// Les exemples sont calculés avec la vraie fonction de coloration
const EXEMPLE_MOT = 'ARBRE'
const EXEMPLE_SIMPLE = 'ABRIS'
const EXEMPLE_DOUBLE = 'ERRER'

function Rules() {
  // Un tableau de 1 à 6 essais, pour afficher les points
  const essais = []
  for (let i = 1; i <= ESSAIS_MAX; i++) {
    essais.push(i)
  }

  return (
    <div className="page-regles">
      <h1>Règles</h1>

      <p>
        Trouve le mot mystère de {LONGUEUR_MOT} lettres en {ESSAIS_MAX} essais maximum. Après
        chaque proposition, chaque lettre change de couleur :
      </p>

      <ul>
        <li><span className="pastille vert"></span> <strong>Vert</strong> : la lettre est dans le mot, à la bonne place.</li>
        <li><span className="pastille jaune"></span> <strong>Jaune</strong> : la lettre est dans le mot, mais à une autre place.</li>
        <li><span className="pastille gris"></span> <strong>Gris</strong> : la lettre n'est pas dans le mot, ou pas autant de fois que proposé.</li>
      </ul>

      <h2>Exemple</h2>
      <p>Le mot mystère est <strong>{EXEMPLE_MOT}</strong> et tu proposes <strong>{EXEMPLE_SIMPLE}</strong> :</p>
      <div className="exemple">
        <Ligne
          mot={EXEMPLE_SIMPLE}
          couleurs={evaluerProposition(EXEMPLE_MOT, EXEMPLE_SIMPLE)}
          refusee={false}
        />
      </div>

      <h2>Les lettres en double</h2>
      <p>
        Il n'y a que deux R et un E dans {EXEMPLE_MOT} : avec <strong>{EXEMPLE_DOUBLE}</strong>,
        toutes les lettres ne peuvent pas être jaunes.
      </p>
      <div className="exemple">
        <Ligne
          mot={EXEMPLE_DOUBLE}
          couleurs={evaluerProposition(EXEMPLE_MOT, EXEMPLE_DOUBLE)}
          refusee={false}
        />
      </div>

      <h2>À savoir</h2>
      <ul>
        <li>Les mots se jouent sans accents : « école » se joue ECOLE.</li>
        <li>Ta proposition doit être un vrai mot français. Un mot refusé ne compte pas comme un essai.</li>
      </ul>

      <h2>Les points</h2>
      <table className="tableau-scores">
        <thead>
          <tr>
            <th>Mot trouvé en</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {essais.map((nombre) => (
            <tr key={nombre}>
              <td>{nombre} essai{nombre > 1 ? 's' : ''}</td>
              <td>{calculerPoints('gagne', nombre)}</td>
            </tr>
          ))}
          <tr>
            <td>Perdu</td>
            <td>{calculerPoints('perdu', ESSAIS_MAX)}</td>
          </tr>
        </tbody>
      </table>

      <Link to="/">Retour à l'accueil</Link>
    </div>
  )
}

export default Rules