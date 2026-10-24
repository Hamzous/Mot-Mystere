function Case(props) {
  // "retourne" déclenche l'animation, seulement quand la case a une couleur
  const classes = 'case ' + props.couleur + (props.couleur ? ' retourne' : '')

  // --indice sert au CSS pour décaler le retournement de chaque case
  return (
    <div className={classes} style={{ '--indice': props.indice }}>
      {props.lettre}
    </div>
  )
}

export default Case