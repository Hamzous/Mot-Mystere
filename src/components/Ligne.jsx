import Case from './Case.jsx'
import { LONGUEUR_MOT } from '../game/reducteurPartie.js'

function Ligne(props) {
  const cases = []

  for (let i = 0; i < LONGUEUR_MOT; i++) {
    let lettre = ''
    if (i < props.mot.length) {
      lettre = props.mot[i]
    }

    let couleur = ''
    if (props.couleurs !== null) {
      couleur = props.couleurs[i]
    }

    cases.push(<Case key={i} lettre={lettre} couleur={couleur} indice={i} />)
  }

  // "refusee" : le mot a été refusé, la ligne tremble
  const classes = props.refusee ? 'ligne refusee' : 'ligne'

  return <div className={classes}>{cases}</div>
}

export default Ligne