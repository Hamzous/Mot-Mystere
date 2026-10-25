import { useState, useEffect } from 'react'
import { dateParis, secondesAvantMinuit, formaterDuree } from '../game/motDuJour'

function CompteARebours() {
  // jourAffiche = le jour à l'ouverture de la page, pour détecter le passage à minuit
  const [etat, setEtat] = useState(() => ({
    jourAffiche: dateParis(),
    secondes: secondesAvantMinuit(),
    nouveauJour: false,
  }))

  useEffect(() => {
    // Toutes les secondes, on relit l'horloge au lieu de retirer 1 à un compteur :
    // un onglet en arrière-plan ralentit les minuteurs, et le compteur serait faux.
    const minuteur = setInterval(() => {
      setEtat((ancien) => ({
        jourAffiche: ancien.jourAffiche,
        secondes: secondesAvantMinuit(),
        nouveauJour: dateParis() !== ancien.jourAffiche,
      }))
    }, 1000)

    // nettoyage : on arrête le minuteur quand le composant disparaît
    return () => clearInterval(minuteur)
  }, [])

  if (etat.nouveauJour) {
    return (
      <div className="compte-a-rebours">
        <p>Un nouveau mot est disponible !</p>
        <button onClick={() => window.location.reload()}>Jouer le nouveau mot</button>
      </div>
    )
  }

  return (
    <p className="compte-a-rebours" role="timer">
      Prochain mot dans <strong>{formaterDuree(etat.secondes)}</strong>
    </p>
  )
}

export default CompteARebours