import Ligne from './Ligne.jsx'
import { ESSAIS_MAX } from '../game/reducteurPartie.js'
import '../styles/grille.css'
import '../styles/animations.css'

function Grille(props) {
  const lignes = []

  for (let i = 0; i < ESSAIS_MAX; i++) {
    let mot = ''
    let couleurs = null
    const estCourante = i === props.essais.length

    if (i < props.essais.length) {
      mot = props.essais[i]
      couleurs = props.resultats[i]
    } else if (estCourante) {
      mot = props.propositionEnCours
    }

    // La key de la ligne courante change à chaque refus : React la recrée,
    // ce qui rejoue l'animation de tremblement.
    let cle = i
    if (estCourante) {
      cle = i + '-' + props.nbRefus
    }

    lignes.push(
      <Ligne key={cle} mot={mot} couleurs={couleurs} refusee={estCourante && props.refusee} />
    )
  }

  return <div className="grille">{lignes}</div>
}

export default Grille