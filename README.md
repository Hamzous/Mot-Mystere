# Le Mot Mystère

Un jeu de lettres en React : trouver un mot de 5 lettres en 6 essais. Les propositions sont vérifiées auprès de l'API du Wiktionnaire.

> Site en ligne (Vercel) : *à compléter dès le déploiement (palier 4)*

## Binôme

- Hamza Mouhim
- Mohamed Rherbaoui

## Palier visé

**Palier 4 minimum** (mot du jour + mise en ligne sur Vercel), puis paliers 5 et 6 si le temps le permet.

## État des paliers

*Dernière mise à jour : 25 octobre 2026*

| Palier | Contenu | État |
|---|---|---|
| 1 | Le jeu | Terminé |
| 2 | Le dictionnaire | Presque terminé (il manque les accents en fin de partie) |
| 3 | Le confort de jeu | Terminé |
| 4 | Le mot du jour | Presque terminé (déploiement et classement du jour en cours) |
| 5 | Les variantes | Pas commencé |
| 6 | Les quatre grilles | Pas commencé |

### Palier 1 : le jeu (terminé)

- [x] Page d'accueil avec saisie du pseudo, mémorisé dans le navigateur
- [x] Partie sur sa propre adresse (`/jeu`)
- [x] Grille de 6 lignes de 5 cases
- [x] Mot mystère tiré au hasard dans `mots_solutions.json`
- [x] Saisie au clavier (lettres, Retour arrière, Entrée)
- [x] Couleurs vert / jaune / gris, y compris pour les lettres en double
- [x] Victoire et défaite détectées, mot révélé en cas de défaite
- [x] Points affichés, nouvelle partie, retour à l'accueil
- [x] Logique du jeu séparée de l'affichage (dossier `src/game/`)

### Palier 2 : le dictionnaire (presque terminé)

- [x] Chaque proposition est vérifiée auprès du Wiktionnaire (mots français uniquement)
- [x] Un mot refusé ne compte pas comme un essai, le joueur est averti par un message
- [x] Indicateur « Vérification du mot… » et validation bloquée pendant la vérification
- [x] Si l'API ne répond pas : le jeu continue avec une liste de secours (voir « Choix techniques »)
- [x] La ligne montre visuellement le refus (bordures rouges et tremblement)
- [ ] Écran de fin avec le mot **avec ses accents** et un lien vers sa page du Wiktionnaire : le code est prêt, il manque le fichier `mots_solutions.json` avec les accents

### Palier 3 : le confort de jeu (terminé)

- [x] Tableau des scores : les 10 meilleures parties, classées par points
- [x] Écran de statistiques : parties jouées, % de victoires, séries, total des points, répartition par nombre d'essais
- [x] Clavier à l'écran avec les touches colorées
- [x] Animations (retournement des cases, tremblement quand un mot est refusé)
- [x] Écran des règles avec exemple illustré des trois couleurs
- [x] Accueil avec accès à la partie, aux scores, aux statistiques et aux règles

### Palier 4 : le mot du jour (presque terminé)

- [x] Mot du jour identique pour tous, qui change à minuit (heure de Paris), sur `/jour`
- [x] Partie libre toujours disponible sur `/jeu`
- [x] Partie du jour reprise au rechargement et non rejouable
- [x] Compte à rebours jusqu'au prochain mot
- [x] Partage du résultat en emojis dans le presse-papiers
- [x] Plus de 5 tests automatiques, dont 2 sur les lettres en double
- [x] `vercel.json` : toutes les adresses renvoient `index.html`, pour que les routes marchent au rafraîchissement
- [ ] Classement du jour : en cours
- [ ] Mise en ligne sur Vercel : en cours

### Paliers 5 et 6

Pas commencés.

## Installer, lancer, tester

```bash
git clone <url-du-depot>
cd <dossier-du-depot>
npm install
npm run dev      # lance le jeu en local (http://localhost:5173)
npm test         # lance les tests automatiques (Vitest)
npm run lint     # vérifie le code (ESLint)
npm run build    # construit la version de production
```

### Configuration (fichier `.env`)

Les réglages ne sont pas écrits en dur dans le code : ils sont dans le fichier `.env` à la racine, lu par Vite et centralisé dans `src/config.js`.

| Variable | Rôle |
|---|---|
| `VITE_WIKTIONNAIRE_API` | adresse de l'API du Wiktionnaire |
| `VITE_WIKTIONNAIRE_PAGE` | début de l'adresse des pages de mots (pour le lien de l'écran de fin) |
| `VITE_API_USER_AGENT` | identifiant du projet envoyé à Wikimedia (nom du projet + contact) |
| `VITE_API_DELAI_MS` | délai maximum d'attente de l'API, en millisecondes |

À savoir :
- Après chaque modification du `.env`, il faut relancer `npm run dev`.
- Seules les variables qui commencent par `VITE_` sont visibles dans le code. Elles sont **publiques** (elles se retrouvent dans le code envoyé au navigateur) : on n'y met aucun secret. L'API du Wiktionnaire n'a pas de clé, donc il n'y en a pas.
- Le `.env` est commité, ce qui permet à Vercel de fonctionner sans configuration supplémentaire. Les valeurs personnelles vont dans `.env.local`, ignoré par Git.
- Les règles du jeu (longueur du mot, nombre d'essais, points par essai, taille du classement) sont aussi dans `src/config.js`.

## Organisation du code

```
src/
  config.js    réglages (variables du .env et règles du jeu)
  game/        logique du jeu en JavaScript pur (sans React) + tests
  api/         tous les appels au Wiktionnaire (un seul fichier)
  storage/     lecture et écriture dans le localStorage
  data/        liste des mots solutions
  components/  affichage uniquement : Grille, Ligne, Case, Keyboard, CompteARebours, BoutonPartage
  pages/       un fichier par écran : Home, Game, Scores, Stats, Rules
  styles/      CSS de la grille et des animations
```

| Fichier | Rôle |
|---|---|
| `game/normaliser.js` | met un mot en majuscules sans accents (`école` donne `ECOLE`, `cœur` donne `COEUR`) |
| `game/evaluerProposition.js` | compare une proposition au mot mystère et renvoie les couleurs |
| `game/reducteurPartie.js` | état de la partie (essais, ligne en cours, statut, vérification) |
| `game/score.js` | nombre d'essais vers points |
| `game/motMystere.js` | tire un mot au hasard dans la liste (avec et sans accents) |
| `game/dictionnaireLocal.js` | liste de secours quand l'API ne répond pas |
| `game/classement.js` | calcule les 10 meilleures parties |
| `game/statistiques.js` | calcule les statistiques d'un joueur |
| `api/wiktionary.js` | vérifie qu'un mot est un mot français, construit le lien vers sa page |
| `storage/storage.js` | pseudo et parties dans le localStorage |
| `pages/Game.jsx` | assemble le tout, écoute le clavier, enregistre la partie à la fin |

Le principe : `game` calcule, `components` affichent, `pages` assemblent, `storage` et `api` communiquent avec l'extérieur.

## Choix techniques

**Bibliothèques ajoutées**
- `react-router-dom` : navigation entre les écrans (imposé par le sujet).
- `vitest` : tests automatiques. Il s'intègre directement à Vite, sans configuration supplémentaire.

**Coloration des lettres en double.** `evaluerProposition` fait deux passages. Le premier marque les lettres bien placées (vert) et met de côté les autres lettres du mot mystère. Le second donne un jaune seulement s'il reste encore un exemplaire de cette lettre dans la réserve, qu'on retire ensuite. Sans ça, `ERRER` sur `ARBRE` donnerait trop de jaunes.

**Accents.** Les mots se jouent sans accents. `normaliser` utilise `normalize('NFD')` pour séparer les lettres de leurs accents, puis supprime les accents. La ligature `œ` n'est pas une lettre accentuée : elle est remplacée à la main par `oe`. Le mot d'origine (avec accents) est gardé à côté pour l'écran de fin.

**`useReducer` pour la partie.** Tout l'état de la partie est dans un reducer, une fonction pure testée sans interface. Le reducer ne tire pas le mot au hasard et n'appelle pas l'API : on lui donne le mot, et `Game.jsx` appelle `verifierMot` puis envoie l'action `VALIDER` ou `MOT_REFUSE`.

**Vérification d'un mot par le Wiktionnaire.** Une page qui existe n'est pas forcément un mot français (le Wiktionnaire contient toutes les langues). On procède en deux requêtes :
1. recherche (`opensearch`) du mot : l'API retrouve `école` quand on cherche `ecole`, et on compare les résultats sans accents ;
2. lecture des catégories de la page : le mot est accepté s'il a la catégorie « Lemmes en français » ou une catégorie « Formes de … en français » (ce qui couvre les pluriels et les verbes conjugués).

Le simple critère « catégorie qui finit par *en français* » ne suffit pas, parce que des pages d'autres langues en ont (par exemple « Exemples en français »).

**Noms propres refusés.** Les titres avec une majuscule (`Paris`) sont écartés : seuls les mots communs sont acceptés.

**Cache et délai.** Un mot déjà vérifié est gardé en mémoire (pas de nouvelle requête). Une requête qui dure plus de `VITE_API_DELAI_MS` est annulée et considérée comme une panne.

**Quand l'API ne répond pas.** Le jeu n'est pas bloqué : le mot est vérifié dans la liste locale `mots_solutions.json` (environ 300 mots). S'il y est, il est accepté avec un message ; sinon il est refusé avec un message, sans compter comme un essai. Le mot mystère vient de cette liste, donc le joueur peut toujours gagner. On préfère refuser un vrai mot hors ligne plutôt que valider n'importe quel texte. Contrepartie : hors ligne, seuls les mots de la liste sont acceptés.

**localStorage.** Le pseudo et la liste des parties terminées sont enregistrés dans le navigateur. Le classement et les statistiques ne sont pas stockés : ils sont calculés à l'affichage à partir de la liste des parties, ce qui évite d'avoir deux versions d'une même information. Deux parties à égalité de points sont départagées par la date, pour que l'ordre soit toujours le même. Les statistiques sont calculées par pseudo, donc plusieurs joueurs peuvent se partager un ordinateur.

**Thème.** Interface noir et violet. Toutes les couleurs sont des variables CSS définies au début de `index.css`, pour pouvoir changer le thème à un seul endroit.

## Difficultés rencontrées

- **Les lettres en double.** Premier jet à un seul passage : une lettre jaune pouvait « voler » celle d'un vert situé plus loin. Résolu par les deux passages avec une réserve de lettres, et des tests sur `ARBRE` / `ERRER` et `PLAGE` / `ALLEE`.
- **Savoir si un mot est français.** Tester l'existence de la page ne suffit pas. Nous avons testé l'API dans le navigateur sur plusieurs mots (`chats`, `house`) pour voir les catégories réellement renvoyées, ce qui a montré qu'il fallait distinguer « lemme » et « forme » en français.
- **Écouteur clavier et état périmé.** Au palier 1, le clavier ne fait que des `dispatch`, donc il n'a pas besoin de lire l'état. Avec la vérification du dictionnaire, la fonction de validation lit la ligne en cours : l'effet dépend donc de l'état et se relance à chaque changement.
- **Le mot avec accents.** Notre fichier de mots ne contient pas d'accents : pour afficher `scène` et faire le bon lien Wiktionnaire, il faut la liste d'origine avec les accents.
- **Les séries dans les statistiques.** Une série dépend de l'ordre des parties : on trie d'abord par date, sinon une liste dans le désordre donne de fausses séries (cas couvert par un test).
- **Organisation Git.** Une erreur de workflow (envoi direct sur `main` au lieu d'une branche) : le code était sain, rien n'a été cassé. Nous reprenons une branche par fonctionnalité.

## Répartition du travail

- **Hamza** : logique du jeu (`game/`), tirage du mot, pseudo (`storage`, accueil), page de partie, appel au Wiktionnaire et liste de secours, scores et statistiques, clavier à l'écran, animations, écran des règles, mot du jour, compte à rebours, partage, configuration (`.env`), mise en forme générale (`index.css`).
- **Mohamed** : routes React Router, composants `Grille`, `Ligne`, `Case` et leur CSS, configuration Vercel (`vercel.json`), mise à jour du README.

## Suite prévue

1. Finir le palier 2 : récupérer la liste de mots d'origine avec les accents, pour l'écran de fin.
2. Finir le palier 4 : classement du jour et mise en ligne sur Vercel.
3. Palier 5 : mots de 6 et 7 lettres, mode difficile.