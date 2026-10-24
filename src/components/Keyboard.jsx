// Les 3 rangées du clavier AZERTY
const RANGEES = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTREE', 'W', 'X', 'C', 'V', 'B', 'N', 'EFFACER'],
]

// etats : { A: 'vert', ... }  surTouche : fonction appelée avec la touche cliquée
function Keyboard({ etats, surTouche, desactive }) {
  return (
    <div className="clavier">
      {RANGEES.map((rangee, i) => (
        <div className="rangee-clavier" key={i}>
          {rangee.map((touche) => {
            const estSpeciale = touche === 'ENTREE' || touche === 'EFFACER'

            let texte = touche
            if (touche === 'ENTREE') {
              texte = 'Entrée'
            }
            if (touche === 'EFFACER') {
              texte = '⌫'
            }

            const couleur = etats[touche] || ''

            return (
              <button
                key={touche}
                type="button"
                className={'touche ' + couleur + (estSpeciale ? ' large' : '')}
                disabled={desactive}
                aria-label={touche === 'EFFACER' ? 'Effacer' : texte}
                // empêche le bouton de prendre le focus : sinon la touche Entrée du vrai
                // clavier "re-cliquerait" le dernier bouton utilisé
                onMouseDown={(evenement) => evenement.preventDefault()}
                onClick={() => surTouche(touche)}
              >
                {texte}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Keyboard