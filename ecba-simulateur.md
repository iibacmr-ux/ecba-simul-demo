# Application ECBA - Simulateur de QCM

Cette application interactive permet de passer un test ECBA en français standard avec les 50 questions fournies. L'utilisateur répond à chaque question, obtient une note sur 50, avec un taux de réussite de 75% requis (soit 38/50). La note et le résultat « Réussi / Échoué » sont affichés à la fin.

## Fonctionnalités

- Navigation entre les questions
- Sélection de réponses uniques
- Validation en fin de test
- Affichage du score et du statut (Pass/Fail)
- Réinitialisation pour refaire le test

## Structure du projet

```
/ecba-simulateur
├─ index.html        # Interface utilisateur HTML
├─ style.css         # Styles de l'application
├─ app.js            # Logique JavaScript
└─ questions.json    # Fichier JSON contenant les 50 questions et réponses
```

## Installation

1. Cloner le repository
2. Ouvrir `index.html` dans un navigateur

## Utilisation

1. Lancer le test ECBA
2. Répondre aux 50 questions
3. Cliquer sur "Valider" pour obtenir le score
4. Voir le résultat (≥75% : Réussi)
5. Réinitialiser pour recommencer

## Exemple de questions.json

```json
[
  {
    "question": "Quelle connaissance organisationnelle est la plus critique pour réussir un changement de processus ?",
    "options": [
      "Connaître objectifs, culture et processus internes",
      "Comprendre tendances du marché international",
      "Connaître processus des concurrents",
      "Comprendre culture organisationnelle"
    ],
    "correct": 0
  },
  ... 49 autres questions ...
]
```

## Technologies

- HTML/CSS/JavaScript Vanilla
- Aucune dépendance externe

