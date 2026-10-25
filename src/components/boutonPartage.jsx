import { useState } from 'react'

function BoutonPartage({ texte }) {
  const [message, setMessage] = useState('')
  const [copieRefusee, setCopieRefusee] = useState(false)

  async function copier() {
    try {
      // writeText renvoie une promesse : on attend sa réponse avec await
      await navigator.clipboard.writeText(texte)
      setCopieRefusee(false)
      setMessage('Résultat copié dans le presse-papiers !')
    } catch {
      // copie refusée (autorisation, page non sécurisée...) : on affiche le texte
      setCopieRefusee(true)
      setMessage('Copie impossible : copie le texte ci-dessous à la main.')
    }
  }

  return (
    <div className="partage">
      <button onClick={copier}>Partager mon résultat</button>

      {message && (
        <p className={copieRefusee ? 'message erreur' : 'message'} role="status">
          {message}
        </p>
      )}

      {copieRefusee && (
        <textarea
          readOnly
          rows={5}
          value={texte}
          onFocus={(evenement) => evenement.target.select()}
        />
      )}
    </div>
  )
}

export default BoutonPartage