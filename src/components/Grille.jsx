import Ligne from './Ligne.jsx'
import { ESSAIS_MAX } from '../game/reducteurPartie.js'
import '../styles/grille.css'

function Grille(props) {
  const lignes = []

  for (let i = 0; i < ESSAIS_MAX; i++) {
    let mot = ''
    let couleurs = null

    if (i < props.essais.length) {
      
      mot = props.essais[i]
      couleurs = props.resultats[i]
    } else if (i === props.essais.length) {
      
      mot = props.propositionEnCours
    }
    

    lignes.push(<Ligne key={i} mot={mot} couleurs={couleurs} />)
  }

  return <div className="grille">{lignes}</div>
}

export default Grille
