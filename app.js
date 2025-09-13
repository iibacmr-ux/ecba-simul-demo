// Application state
const examState = {
    currentQuestion: 0,
    answers: {},
    markedQuestions: new Set(),
    timeRemaining: 3600, // 60 minutes in seconds
    timerInterval: null,
    startTime: null,
    isExamActive: false,
    showingResults: false
};

// Complete question bank - extending the provided data to 50 questions
const questionBank = [
    {
        id: 1,
        question: "Vous êtes chargé de mettre en œuvre un changement de processus dans un département. Quelle connaissance organisationnelle est la plus critique pour réussir ?",
        options: [
            "Connaître les objectifs départementaux, la culture et les processus internes de changement",
            "Comprendre les tendances du marché international", 
            "Connaître les processus de changement des concurrents",
            "Comprendre la culture organisationnelle pour savoir ce qui sera ou ne sera pas accepté"
        ],
        correct: 0,
        explanation: "La connaissance organisationnelle inclut la compréhension de la structure, de la culture et de la dynamique interne pour faciliter un changement réussi.",
        babokRef: "BABOK v3 - 9.3.3 Connaissances organisationnelles",
        category: "Compétences Sous-jacentes"
    },
    {
        id: 2,
        question: "Comment un analyste métier peut-il simplifier des exigences complexes pour les parties prenantes ?",
        options: [
            "Utiliser une documentation textuelle détaillée pour s'assurer que toutes les exigences sont couvertes",
            "Créer des diagrammes, graphiques et modèles pour faciliter la compréhension",
            "Rédiger une liste d'exigences et la regrouper dans un tableur par catégories", 
            "Résumer l'information dans un courriel pour une vue d'ensemble"
        ],
        correct: 1,
        explanation: "La pensée visuelle améliore la compréhension en utilisant des modèles et des diagrammes.",
        babokRef: "BABOK v3 - 9.1.7 Pensée visuelle",
        category: "Compétences Sous-jacentes"
    },
    {
        id: 3,
        question: "Deux parties prenantes demandent des fonctionnalités contradictoires. Que doit faire l'analyste métier ?",
        options: [
            "Choisir aléatoirement l'une des demandes",
            "Négocier en se fondant sur la valeur, l'impact et la faisabilité",
            "Ne pas décider et laisser le sponsor trancher",
            "Rejeter les deux propositions pour qu'aucun ne l'emporte"
        ],
        correct: 1,
        explanation: "La résolution de conflits implique une négociation axée sur les objectifs.",
        babokRef: "BABOK v3 - 9.5.4 Négociation et résolution de conflits", 
        category: "Compétences Sous-jacentes"
    },
    {
        id: 4,
        question: "Lors de la documentation des changements d'un système CRM, quel aspect est clé ?",
        options: [
            "Connaître en détail le fonctionnement des connexions utilisateur",
            "Réaliser une analyse d'impact et une validation des exigences",
            "Maîtriser le fonctionnement technique du système",
            "Consulter le service marketing pour déterminer l'importance"
        ],
        correct: 1,
        explanation: "La connaissance de la solution soutient l'analyse d'impact et la validation des exigences.",
        babokRef: "BABOK v3 - 9.3.4 Connaissances de la solution",
        category: "Compétences Sous-jacentes"  
    },
    {
        id: 5,
        question: "Vous êtes invité à falsifier un rapport. Quelle est votre réaction ?",
        options: [
            "Refuser et signaler la violation éthique selon la politique",
            "Accepter discrètement et garder le secret", 
            "Le faire tout en manifestant votre désaccord au demandeur",
            "Reporter la décision le temps de réfléchir"
        ],
        correct: 0,
        explanation: "Le comportement éthique exige l'intégrité et le respect des normes.",
        babokRef: "BABOK v3 - 9.2.1 Comportement éthique",
        category: "Compétences Sous-jacentes"
    },
    {
        id: 6,
        question: "Vous devez créer un diagramme de flux de données. Quelle action est la meilleure ?",
        options: [
            "Utiliser un outil de modélisation BA avec des modèles DFD",
            "Le dessiner à main levée sur papier",
            "Le créer dans PowerPoint ou Word", 
            "Demander aux concepteurs ou développeurs de le réaliser"
        ],
        correct: 0,
        explanation: "Les outils BA améliorent la précision et la clarté dans la modélisation d'analyse.",
        babokRef: "BABOK v3 - 9.2.5 Outils et technologies BA",
        category: "Compétences Sous-jacentes"
    },
    {
        id: 7,
        question: "Une partie prenante semble désengagée en réunion. Qu'est-ce qui pourrait aider ?",
        options: [
            "Observer et ajuster votre ton et votre contact visuel",
            "L'ignorer mais continuer à impliquer les autres",
            "Conclure tôt car elle pourrait s'ennuyer", 
            "La mettre en avant et faire d'elle le centre d'attention"
        ],
        correct: 0,
        explanation: "La conscience non verbale améliore l'efficacité de la communication.",
        babokRef: "BABOK v3 - 9.4.2 Communication non verbale",
        category: "Compétences Sous-jacentes"
    },
    {
        id: 8,
        question: "Avant le lancement d'un nouveau système, comment un BA peut-il se préparer à des événements négatifs potentiels ?",
        options: [
            "Réaliser une analyse des parties prenantes pour identifier les problèmes potentiels",
            "Évaluer l'état actuel du processus pour détecter les gaspillages",
            "Mener une analyse de risques et définir des plans d'atténuation",
            "Conduire une analyse des causes profondes pour identifier la cause principale de l'événement négatif"
        ],
        correct: 2,
        explanation: "L'analyse de risques anticipe les incertitudes et prépare des réponses à celles-ci.",
        babokRef: "BABOK v3 - 10.38 Analyse de risques",
        category: "Techniques"
    },
    {
        id: 9,
        question: "Une entreprise évalue son entrée sur un nouveau marché. Quelle analyse aide à explorer une position stratégique ?",
        options: [
            "Analyse SWOT",
            "User stories", 
            "Maquettage (wireframes)",
            "Ateliers de travail"
        ],
        correct: 0,
        explanation: "L'analyse SWOT identifie les forces, faiblesses, opportunités et menaces.",
        babokRef: "BABOK v3 - 10.46 Analyse SWOT",
        category: "Techniques"
    },
    {
        id: 10,
        question: "L'équipe est bloquée sur des méthodes traditionnelles. Comment le BA peut-il encourager l'innovation ?",
        options: [
            "Organiser une séance de brainstorming avec des méthodes novatrices",
            "Demander d'abord l'accord du client ou du sponsor",
            "Encourager l'équipe à revisiter les approches éprouvées car elles ont fait leurs preuves",
            "Solliciter un budget supplémentaire pour une formation externe"
        ],
        correct: 0,
        explanation: "La pensée créative utilise des techniques non traditionnelles comme le brainstorming pour trouver de nouvelles solutions.",
        babokRef: "BABOK v3 - 9.1.1 Pensée créative", 
        category: "Compétences Sous-jacentes"
    },
    // Additional questions to reach 50 total
    {
        id: 11,
        question: "Quelle est la première étape de la planification de l'analyse métier ?",
        options: [
            "Identifier les parties prenantes",
            "Planifier l'approche de l'analyse métier",
            "Définir les besoins d'information sur les parties prenantes",
            "Planifier la gouvernance de l'analyse métier"
        ],
        correct: 1,
        explanation: "La planification de l'approche BA est la première étape qui guide toutes les autres activités.",
        babokRef: "BABOK v3 - 3.1 Planifier l'approche de l'analyse métier",
        category: "Planification et surveillance de l'analyse métier"
    },
    {
        id: 12,
        question: "Qu'est-ce qu'une partie prenante ?",
        options: [
            "Une personne qui utilise directement la solution",
            "Une personne ou un groupe qui a un intérêt dans le changement",
            "Le sponsor du projet uniquement",
            "L'équipe de développement technique"
        ],
        correct: 1,
        explanation: "Une partie prenante est toute personne ou groupe ayant un intérêt légitime dans le changement.",
        babokRef: "BABOK v3 - Glossaire",
        category: "Concepts fondamentaux"
    },
    {
        id: 13,
        question: "Quelle technique est la plus appropriée pour comprendre l'état actuel d'un processus ?",
        options: [
            "Brainstorming",
            "Observation",
            "Sondage",
            "Prototypage"
        ],
        correct: 1,
        explanation: "L'observation permet de comprendre comment un processus fonctionne réellement dans la pratique.",
        babokRef: "BABOK v3 - 10.30 Observation",
        category: "Techniques"
    },
    {
        id: 14,
        question: "Quel est l'objectif principal de l'élicitation ?",
        options: [
            "Documenter les exigences",
            "Tirer et découvrir des informations pertinentes aux parties prenantes",
            "Valider les exigences",
            "Prioriser les exigences"
        ],
        correct: 1,
        explanation: "L'élicitation vise à tirer et découvrir des informations des parties prenantes.",
        babokRef: "BABOK v3 - Chapitre 4 Élicitation et collaboration",
        category: "Élicitation et collaboration"
    },
    {
        id: 15,
        question: "Qu'est-ce qu'une exigence ?",
        options: [
            "Une solution technique spécifique",
            "Une condition ou capacité nécessaire pour résoudre un problème",
            "Un document de spécification",
            "Un cas de test"
        ],
        correct: 1,
        explanation: "Une exigence est une condition ou capacité nécessaire pour résoudre un problème ou atteindre un objectif.",
        babokRef: "BABOK v3 - Glossaire",
        category: "Concepts fondamentaux"
    },
    {
        id: 16,
        question: "Quelle activité n'appartient PAS à la gestion du cycle de vie des exigences ?",
        options: [
            "Tracer les exigences",
            "Maintenir les exigences",
            "Éliciter les exigences",
            "Prioriser les exigences"
        ],
        correct: 2,
        explanation: "L'élicitation des exigences appartient au domaine 'Élicitation et collaboration'.",
        babokRef: "BABOK v3 - Chapitre 5 Gestion du cycle de vie des exigences",
        category: "Gestion du cycle de vie des exigences"
    },
    {
        id: 17,
        question: "Quel est le but de l'analyse de l'état actuel ?",
        options: [
            "Définir la solution future",
            "Comprendre le contexte du changement",
            "Évaluer les options de solution",
            "Implémenter la solution"
        ],
        correct: 1,
        explanation: "L'analyse de l'état actuel aide à comprendre le contexte dans lequel le changement aura lieu.",
        babokRef: "BABOK v3 - 6.1 Analyser l'état actuel",
        category: "Analyse de stratégie"
    },
    {
        id: 18,
        question: "Quelle technique est utilisée pour décomposer des exigences complexes ?",
        options: [
            "Décomposition fonctionnelle",
            "Analyse de risques",
            "Modélisation de processus",
            "Analyse de parties prenantes"
        ],
        correct: 0,
        explanation: "La décomposition fonctionnelle permet de décomposer des fonctions complexes en composants plus simples.",
        babokRef: "BABOK v3 - 10.17 Décomposition fonctionnelle",
        category: "Techniques"
    },
    {
        id: 19,
        question: "Qu'est-ce qui caractérise une bonne exigence ?",
        options: [
            "Elle est technique et détaillée",
            "Elle est claire, complète et vérifiable",
            "Elle inclut la solution",
            "Elle est écrite par les développeurs"
        ],
        correct: 1,
        explanation: "Une bonne exigence doit être claire, complète, cohérente et vérifiable.",
        babokRef: "BABOK v3 - 5.3 Maintenir les exigences",
        category: "Gestion du cycle de vie des exigences"
    },
    {
        id: 20,
        question: "Quel domaine de connaissance traite de la définition de la solution ?",
        options: [
            "Analyse de stratégie",
            "Analyse et définition de la conception des exigences",
            "Évaluation de solution",
            "Planification et surveillance de l'analyse métier"
        ],
        correct: 1,
        explanation: "L'analyse et définition de la conception des exigences traite de la spécification et la modélisation des exigences.",
        babokRef: "BABOK v3 - Chapitre 7",
        category: "Analyse et définition de la conception des exigences"
    },
    {
        id: 21,
        question: "Quelle est la différence entre validation et vérification ?",
        options: [
            "Il n'y a pas de différence",
            "La validation vérifie si on construit le bon produit, la vérification si on le construit correctement",
            "La vérification vérifie si on construit le bon produit, la validation si on le construit correctement",
            "Les deux sont identiques"
        ],
        correct: 1,
        explanation: "La validation vérifie qu'on construit le bon produit, la vérification qu'on le construit correctement.",
        babokRef: "BABOK v3 - 5.4 Vérifier les exigences",
        category: "Gestion du cycle de vie des exigences"
    },
    {
        id: 22,
        question: "Qu'est-ce qu'un cas d'utilisation ?",
        options: [
            "Un document technique",
            "Une description des interactions entre un acteur et un système",
            "Un plan de test",
            "Une spécification de base de données"
        ],
        correct: 1,
        explanation: "Un cas d'utilisation décrit les interactions entre un acteur et un système pour atteindre un objectif.",
        babokRef: "BABOK v3 - 10.45 Cas d'utilisation et scénarios",
        category: "Techniques"
    },
    {
        id: 23,
        question: "Quel est l'objectif de la traçabilité des exigences ?",
        options: [
            "Documenter l'historique des modifications",
            "Comprendre les relations entre les exigences",
            "Faciliter l'analyse d'impact",
            "Tous les éléments ci-dessus"
        ],
        correct: 3,
        explanation: "La traçabilité sert à documenter l'historique, comprendre les relations et faciliter l'analyse d'impact.",
        babokRef: "BABOK v3 - 5.2 Tracer les exigences",
        category: "Gestion du cycle de vie des exigences"
    },
    {
        id: 24,
        question: "Quelle technique permet de visualiser les flux de données ?",
        options: [
            "Diagramme d'état",
            "Diagramme de flux de données",
            "Diagramme de Gantt",
            "Diagramme de réseau"
        ],
        correct: 1,
        explanation: "Le diagramme de flux de données montre comment les données circulent dans un système.",
        babokRef: "BABOK v3 - 10.15 Modélisation de flux de données",
        category: "Techniques"
    },
    {
        id: 25,
        question: "Qu'est-ce que l'analyse des parties prenantes vise à accomplir ?",
        options: [
            "Identifier toutes les parties prenantes",
            "Comprendre leurs besoins et influences",
            "Définir leur niveau d'engagement",
            "Tous les éléments ci-dessus"
        ],
        correct: 3,
        explanation: "L'analyse des parties prenantes vise à les identifier, comprendre leurs besoins et définir leur engagement.",
        babokRef: "BABOK v3 - 10.43 Analyse des parties prenantes",
        category: "Techniques"
    },
    {
        id: 26,
        question: "Quel est le rôle principal d'un analyste métier ?",
        options: [
            "Programmer des applications",
            "Faire le lien entre les parties prenantes métier et les solutions",
            "Gérer les projets",
            "Tester les applications"
        ],
        correct: 1,
        explanation: "L'analyste métier fait le lien entre les besoins métier et les solutions techniques.",
        babokRef: "BABOK v3 - 2.1 Activités principales",
        category: "Concepts fondamentaux"
    },
    {
        id: 27,
        question: "Quelle technique est appropriée pour prioriser les exigences ?",
        options: [
            "MoSCoW",
            "Observation",
            "Prototypage",
            "Modélisation de processus"
        ],
        correct: 0,
        explanation: "MoSCoW (Must, Should, Could, Won't) est une technique de priorisation des exigences.",
        babokRef: "BABOK v3 - 5.1 Prioriser les exigences",
        category: "Gestion du cycle de vie des exigences"
    },
    {
        id: 28,
        question: "Qu'est-ce qu'un prototype ?",
        options: [
            "Un document de spécifications",
            "Une version préliminaire d'une solution",
            "Un plan de projet",
            "Un rapport d'analyse"
        ],
        correct: 1,
        explanation: "Un prototype est une version préliminaire d'une solution utilisée pour valider des concepts.",
        babokRef: "BABOK v3 - 10.35 Prototypage",
        category: "Techniques"
    },
    {
        id: 29,
        question: "Quelle activité fait partie de l'évaluation de solution ?",
        options: [
            "Mesurer la performance de la solution",
            "Éliciter les exigences",
            "Planifier l'approche BA",
            "Modéliser les processus"
        ],
        correct: 0,
        explanation: "Mesurer la performance fait partie de l'évaluation de solution pour s'assurer qu'elle répond aux objectifs.",
        babokRef: "BABOK v3 - Chapitre 8 Évaluation de solution",
        category: "Évaluation de solution"
    },
    {
        id: 30,
        question: "Quel est l'objectif d'un atelier de travail ?",
        options: [
            "Former les utilisateurs",
            "Obtenir un consensus sur les exigences",
            "Tester la solution",
            "Documenter les processus"
        ],
        correct: 1,
        explanation: "Les ateliers de travail visent à obtenir un consensus et à faciliter la collaboration.",
        babokRef: "BABOK v3 - 10.47 Ateliers",
        category: "Techniques"
    },
    {
        id: 31,
        question: "Qu'est-ce que la gouvernance de l'analyse métier ?",
        options: [
            "Les règles et processus qui guident les activités BA",
            "La gestion de projet",
            "L'organisation des équipes",
            "La formation des analystes"
        ],
        correct: 0,
        explanation: "La gouvernance BA définit les règles, processus et structures qui guident les activités d'analyse métier.",
        babokRef: "BABOK v3 - 3.4 Planifier la gouvernance de l'analyse métier",
        category: "Planification et surveillance de l'analyse métier"
    },
    {
        id: 32,
        question: "Quelle technique permet de modéliser les règles métier ?",
        options: [
            "Arbre de décision",
            "Diagramme de Gantt",
            "Analyse SWOT",
            "Sondage"
        ],
        correct: 0,
        explanation: "L'arbre de décision permet de modéliser les règles métier et les conditions logiques.",
        babokRef: "BABOK v3 - 10.16 Règles et analyse de décision",
        category: "Techniques"
    },
    {
        id: 33,
        question: "Qu'est-ce qu'une exigence fonctionnelle ?",
        options: [
            "Une exigence technique",
            "Ce que le système doit faire",
            "Comment le système doit performer",
            "Les contraintes du système"
        ],
        correct: 1,
        explanation: "Une exigence fonctionnelle décrit ce que le système doit faire, ses fonctionnalités.",
        babokRef: "BABOK v3 - 7.1 Spécifier et modéliser les exigences",
        category: "Analyse et définition de la conception des exigences"
    },
    {
        id: 34,
        question: "Qu'est-ce qu'une exigence non fonctionnelle ?",
        options: [
            "Une exigence qui ne fonctionne pas",
            "Les qualités que le système doit avoir",
            "Une exigence métier",
            "Une contrainte de projet"
        ],
        correct: 1,
        explanation: "Les exigences non fonctionnelles décrivent les qualités du système (performance, sécurité, etc.).",
        babokRef: "BABOK v3 - 7.1 Spécifier et modéliser les exigences",
        category: "Analyse et définition de la conception des exigences"
    },
    {
        id: 35,
        question: "Quelle est la différence entre besoin et exigence ?",
        options: [
            "Il n'y a pas de différence",
            "Un besoin est un problème à résoudre, une exigence est une solution",
            "Une exigence est un problème, un besoin est une solution",
            "Les deux sont des solutions"
        ],
        correct: 1,
        explanation: "Un besoin représente un problème ou une opportunité, une exigence est une condition pour le résoudre.",
        babokRef: "BABOK v3 - Glossaire",
        category: "Concepts fondamentaux"
    },
    {
        id: 36,
        question: "Quel est l'objectif de l'analyse d'écart ?",
        options: [
            "Identifier les différences entre l'état actuel et futur",
            "Analyser les risques",
            "Évaluer les parties prenantes",
            "Prioriser les exigences"
        ],
        correct: 0,
        explanation: "L'analyse d'écart identifie les différences entre l'état actuel et l'état futur désiré.",
        babokRef: "BABOK v3 - 10.18 Analyse d'écart",
        category: "Techniques"
    },
    {
        id: 37,
        question: "Qu'est-ce qu'un critère d'acceptation ?",
        options: [
            "Un plan de test",
            "Les conditions qui doivent être remplies pour accepter une exigence",
            "Un document de spécification",
            "Une mesure de performance"
        ],
        correct: 1,
        explanation: "Les critères d'acceptation définissent les conditions qui doivent être remplies pour qu'une exigence soit acceptée.",
        babokRef: "BABOK v3 - 7.2 Vérifier et valider les exigences",
        category: "Analyse et définition de la conception des exigences"
    },
    {
        id: 38,
        question: "Quelle technique permet d'identifier les causes d'un problème ?",
        options: [
            "Analyse des causes profondes",
            "Prototypage",
            "Sondage",
            "Cas d'utilisation"
        ],
        correct: 0,
        explanation: "L'analyse des causes profondes permet d'identifier les causes réelles d'un problème.",
        babokRef: "BABOK v3 - 10.37 Analyse des causes profondes",
        category: "Techniques"
    },
    {
        id: 39,
        question: "Qu'est-ce que la modélisation de processus métier ?",
        options: [
            "La programmation d'applications",
            "La représentation visuelle des processus métier",
            "L'analyse financière",
            "La gestion de projet"
        ],
        correct: 1,
        explanation: "La modélisation de processus métier crée des représentations visuelles des processus organisationnels.",
        babokRef: "BABOK v3 - 10.6 Modélisation de processus métier",
        category: "Techniques"
    },
    {
        id: 40,
        question: "Quel est l'objectif de la définition de l'architecture des exigences ?",
        options: [
            "Programmer la solution",
            "Organiser et structurer les exigences",
            "Tester la solution",
            "Former les utilisateurs"
        ],
        correct: 1,
        explanation: "L'architecture des exigences organise et structure les exigences de manière cohérente.",
        babokRef: "BABOK v3 - 7.3 Définir l'architecture des exigences",
        category: "Analyse et définition de la conception des exigences"
    },
    {
        id: 41,
        question: "Qu'est-ce qu'un persona ?",
        options: [
            "Un utilisateur réel",
            "Un profil fictif représentant un groupe d'utilisateurs",
            "Un développeur",
            "Un sponsor"
        ],
        correct: 1,
        explanation: "Un persona est un profil fictif qui représente un groupe d'utilisateurs ayant des besoins similaires.",
        babokRef: "BABOK v3 - 10.34 Personas",
        category: "Techniques"
    },
    {
        id: 42,
        question: "Quelle activité permet de s'assurer que la solution répond aux besoins ?",
        options: [
            "Évaluer la performance de la solution",
            "Éliciter les exigences",
            "Modéliser les processus",
            "Analyser les parties prenantes"
        ],
        correct: 0,
        explanation: "L'évaluation de la performance permet de s'assurer que la solution répond aux besoins métier.",
        babokRef: "BABOK v3 - 8.1 Mesurer la performance de la solution",
        category: "Évaluation de solution"
    },
    {
        id: 43,
        question: "Qu'est-ce que l'analyse de la valeur métier ?",
        options: [
            "Le calcul du coût du projet",
            "L'évaluation des bénéfices apportés par une solution",
            "L'analyse des risques",
            "La gestion du budget"
        ],
        correct: 1,
        explanation: "L'analyse de la valeur métier évalue les bénéfices et la valeur apportés par une solution.",
        babokRef: "BABOK v3 - 6.4 Définir les options de changement",
        category: "Analyse de stratégie"
    },
    {
        id: 44,
        question: "Quel type de diagramme montre les interactions entre les utilisateurs et le système ?",
        options: [
            "Diagramme de flux de données",
            "Diagramme de cas d'utilisation",
            "Diagramme de Gantt",
            "Diagramme d'état"
        ],
        correct: 1,
        explanation: "Le diagramme de cas d'utilisation montre les interactions entre les acteurs et le système.",
        babokRef: "BABOK v3 - 10.45 Cas d'utilisation et scénarios",
        category: "Techniques"
    },
    {
        id: 45,
        question: "Qu'est-ce que la gestion du changement organisationnel ?",
        options: [
            "La modification du code informatique",
            "L'accompagnement des personnes dans l'adoption du changement",
            "La gestion de projet",
            "L'analyse technique"
        ],
        correct: 1,
        explanation: "La gestion du changement organisationnel accompagne les personnes dans l'adoption du changement.",
        babokRef: "BABOK v3 - 8.3 Évaluer les limitations de la solution",
        category: "Évaluation de solution"
    },
    {
        id: 46,
        question: "Quelle est la différence entre un livrable et un produit de travail ?",
        options: [
            "Il n'y a pas de différence",
            "Un livrable est formel, un produit de travail peut être informel",
            "Un produit de travail est formel, un livrable peut être informel",
            "Les deux sont toujours formels"
        ],
        correct: 1,
        explanation: "Un livrable est un produit de travail formel qui doit être approuvé, un produit de travail peut être informel.",
        babokRef: "BABOK v3 - Glossaire",
        category: "Concepts fondamentaux"
    },
    {
        id: 47,
        question: "Qu'est-ce que l'estimation en analyse métier ?",
        options: [
            "Le calcul du coût des licences logicielles",
            "L'évaluation de l'effort nécessaire pour les activités BA",
            "Le calcul du ROI",
            "L'évaluation des risques"
        ],
        correct: 1,
        explanation: "L'estimation en AB évalue l'effort, le temps et les ressources nécessaires pour les activités d'analyse métier.",
        babokRef: "BABOK v3 - 3.2 Planifier l'engagement des parties prenantes",
        category: "Planification et surveillance de l'analyse métier"
    },
    {
        id: 48,
        question: "Quel est l'objectif principal de la communication avec les parties prenantes ?",
        options: [
            "Informer sur l'avancement du projet",
            "S'assurer que l'information appropriée est disponible au bon moment",
            "Organiser des réunions",
            "Rédiger des documents"
        ],
        correct: 1,
        explanation: "La communication vise à s'assurer que la bonne information est disponible aux bonnes personnes au bon moment.",
        babokRef: "BABOK v3 - 4.5 Communiquer l'information sur l'analyse métier",
        category: "Élicitation et collaboration"
    },
    {
        id: 49,
        question: "Qu'est-ce qu'une solution ?",
        options: [
            "Un logiciel uniquement",
            "Toute approche pour répondre à un besoin",
            "Un processus métier",
            "Une base de données"
        ],
        correct: 1,
        explanation: "Une solution est toute approche pour répondre à un besoin, incluant les processus, personnes et technologies.",
        babokRef: "BABOK v3 - Glossaire",
        category: "Concepts fondamentaux"
    },
    {
        id: 50,
        question: "Quel est le rôle de l'analyste métier dans la transition vers la solution ?",
        options: [
            "Former tous les utilisateurs",
            "Faciliter le déploiement et l'adoption de la solution",
            "Programmer la solution",
            "Gérer le projet"
        ],
        correct: 1,
        explanation: "L'analyste métier facilite la transition en s'assurant que la solution répond aux besoins et est adoptée.",
        babokRef: "BABOK v3 - 8.2 Analyser la performance de la solution",
        category: "Évaluation de solution"
    }
];

// Utility functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    
    // Remove previous event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    newConfirmBtn.addEventListener('click', () => {
        hideModal('confirm-modal');
        onConfirm();
    });
    
    newCancelBtn.addEventListener('click', () => {
        hideModal('confirm-modal');
    });
    
    showModal('confirm-modal');
}

// Timer functions
function startTimer() {
    examState.startTime = Date.now();
    examState.timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (examState.timeRemaining <= 0) {
        finishExam();
        return;
    }
    
    examState.timeRemaining--;
    const timerElement = document.getElementById('time-remaining');
    const timerContainer = document.querySelector('.timer');
    
    if (timerElement) {
        timerElement.textContent = formatTime(examState.timeRemaining);
        
        // Add warning classes
        timerContainer.classList.remove('warning', 'critical');
        if (examState.timeRemaining <= 300) { // 5 minutes
            timerContainer.classList.add('critical');
        } else if (examState.timeRemaining <= 1800) { // 30 minutes
            timerContainer.classList.add('warning');
        }
        
        // Show alerts
        if (examState.timeRemaining === 1800) { // 30 minutes
            alert('⚠️ Il vous reste 30 minutes !');
        } else if (examState.timeRemaining === 900) { // 15 minutes
            alert('⚠️ Il vous reste 15 minutes !');
        } else if (examState.timeRemaining === 300) { // 5 minutes
            alert('🚨 Il vous reste seulement 5 minutes !');
        }
    }
}

function stopTimer() {
    if (examState.timerInterval) {
        clearInterval(examState.timerInterval);
        examState.timerInterval = null;
    }
}

// Question management
function renderQuestion() {
    const question = questionBank[examState.currentQuestion];
    if (!question) return;
    
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('current-question').textContent = examState.currentQuestion + 1;
    document.getElementById('total-questions').textContent = questionBank.length;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        
        // Check if this option is selected
        if (examState.answers[examState.currentQuestion] === index) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    updateNavigationButtons();
    updateQuestionGrid();
    updateMarkButton();
    updateProgress();
}

function selectOption(optionIndex) {
    examState.answers[examState.currentQuestion] = optionIndex;
    
    // Update visual selection
    document.querySelectorAll('.option').forEach((option, index) => {
        option.classList.toggle('selected', index === optionIndex);
    });
    
    updateQuestionGrid();
    updateProgress();
}

function markQuestion() {
    const questionId = examState.currentQuestion;
    
    if (examState.markedQuestions.has(questionId)) {
        examState.markedQuestions.delete(questionId);
    } else {
        examState.markedQuestions.add(questionId);
    }
    
    updateMarkButton();
    updateQuestionGrid();
    updateMarkedCount();
}

function updateMarkButton() {
    const markBtn = document.getElementById('mark-question');
    const isMarked = examState.markedQuestions.has(examState.currentQuestion);
    
    if (isMarked) {
        markBtn.innerHTML = '<span class="star">⭐</span> Marquée';
        markBtn.classList.add('marked');
    } else {
        markBtn.innerHTML = '<span class="star">⭐</span> Marquer';
        markBtn.classList.remove('marked');
    }
}

function updateMarkedCount() {
    const markedCountEl = document.getElementById('marked-count');
    if (markedCountEl) {
        markedCountEl.textContent = examState.markedQuestions.size;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const finishBtn = document.getElementById('finish-exam');
    
    prevBtn.disabled = examState.currentQuestion === 0;
    
    if (examState.currentQuestion === questionBank.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        finishBtn.style.display = 'none';
    }
}

function updateQuestionGrid() {
    const grid = document.getElementById('questions-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    questionBank.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'question-dot';
        dot.textContent = index + 1;
        
        // Determine status
        if (index === examState.currentQuestion) {
            dot.classList.add('current');
        } else if (examState.answers.hasOwnProperty(index)) {
            dot.classList.add('answered');
        } else {
            dot.classList.add('unanswered');
        }
        
        if (examState.markedQuestions.has(index)) {
            dot.classList.add('marked');
        }
        
        dot.addEventListener('click', () => navigateToQuestion(index));
        grid.appendChild(dot);
    });
}

function updateProgress() {
    const answeredCount = Object.keys(examState.answers).length;
    const progressFill = document.getElementById('progress-fill');
    const answeredCountEl = document.getElementById('answered-count');
    
    const percentage = (answeredCount / questionBank.length) * 100;
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (answeredCountEl) {
        answeredCountEl.textContent = answeredCount;
    }
}

function navigateToQuestion(questionIndex) {
    examState.currentQuestion = questionIndex;
    renderQuestion();
}

function previousQuestion() {
    if (examState.currentQuestion > 0) {
        examState.currentQuestion--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (examState.currentQuestion < questionBank.length - 1) {
        examState.currentQuestion++;
        renderQuestion();
    }
}

function showMarkedQuestions() {
    const markedList = document.getElementById('marked-questions-list');
    const noMarked = document.getElementById('no-marked');
    
    if (examState.markedQuestions.size === 0) {
        markedList.style.display = 'none';
        noMarked.style.display = 'block';
    } else {
        markedList.style.display = 'block';
        noMarked.style.display = 'none';
        
        markedList.innerHTML = '';
        
        Array.from(examState.markedQuestions).sort((a, b) => a - b).forEach(questionIndex => {
            const question = questionBank[questionIndex];
            const item = document.createElement('div');
            item.className = 'marked-question-item';
            item.innerHTML = `
                <strong>Question ${questionIndex + 1}</strong><br>
                ${question.question.substring(0, 100)}...
            `;
            item.addEventListener('click', () => {
                hideModal('marked-modal');
                navigateToQuestion(questionIndex);
            });
            markedList.appendChild(item);
        });
    }
    
    showModal('marked-modal');
}

// Exam flow
function startExam() {
    examState.currentQuestion = 0;
    examState.answers = {};
    examState.markedQuestions.clear();
    examState.timeRemaining = 3600; // 60 minutes
    examState.isExamActive = true;
    examState.showingResults = false;
    
    showScreen('exam-screen');
    renderQuestion();
    startTimer();
}

function finishExam() {
    const unansweredCount = questionBank.length - Object.keys(examState.answers).length;
    
    if (unansweredCount > 0 && examState.timeRemaining > 0) {
        showConfirmModal(
            'Terminer l\'examen',
            `Vous avez ${unansweredCount} question(s) non répondue(s). Êtes-vous sûr de vouloir terminer l'examen ?`,
            () => {
                completeExam();
            }
        );
    } else {
        completeExam();
    }
}

function completeExam() {
    stopTimer();
    examState.isExamActive = false;
    examState.showingResults = true;
    
    calculateResults();
    showScreen('results-screen');
}

function calculateResults() {
    let correctAnswers = 0;
    const failedQuestions = [];
    
    questionBank.forEach((question, index) => {
        const userAnswer = examState.answers[index];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) {
            correctAnswers++;
        } else {
            failedQuestions.push({
                index: index,
                question: question,
                userAnswer: userAnswer,
                correctAnswer: question.correct
            });
        }
    });
    
    const scorePercentage = Math.round((correctAnswers / questionBank.length) * 100);
    const passed = scorePercentage >= 75;
    const timeUsed = 5400 - examState.timeRemaining;
    
    // Update score display
    document.getElementById('score-value').textContent = `${scorePercentage}%`;
    document.getElementById('correct-answers').textContent = `${correctAnswers}/${questionBank.length}`;
    document.getElementById('time-used').textContent = formatTime(timeUsed);
    
    const resultStatus = document.getElementById('result-status');
    const scoreCircle = document.getElementById('score-circle');
    
    if (passed) {
        resultStatus.textContent = '🎉 RÉUSSI !';
        resultStatus.className = 'result-status passed';
        scoreCircle.style.background = `conic-gradient(#28a745 ${scorePercentage * 3.6}deg, #e9ecef 0deg)`;
    } else {
        resultStatus.textContent = '❌ ÉCHOUÉ';
        resultStatus.className = 'result-status failed';
        scoreCircle.style.background = `conic-gradient(#dc3545 ${scorePercentage * 3.6}deg, #e9ecef 0deg)`;
    }
    
    // Render question review
    renderQuestionReview();
    
    // Render failed questions if any
    if (failedQuestions.length > 0) {
        renderFailedQuestions(failedQuestions);
        document.getElementById('failed-section').style.display = 'block';
    } else {
        document.getElementById('failed-section').style.display = 'none';
    }
}

function renderQuestionReview() {
    const reviewList = document.getElementById('questions-review-list');
    reviewList.innerHTML = '';
    
    questionBank.forEach((question, index) => {
        const userAnswer = examState.answers[index];
        const isCorrect = userAnswer === question.correct;
        const wasAnswered = userAnswer !== undefined;
        
        const item = document.createElement('div');
        item.className = `question-review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        let statusIcon = '❓';
        if (wasAnswered) {
            statusIcon = isCorrect ? '✅' : '❌';
        }
        
        item.innerHTML = `
            <span class="question-number">Q${index + 1}</span>
            <span class="question-status">${statusIcon}</span>
            <span class="question-summary">${question.question.substring(0, 50)}...</span>
        `;
        
        reviewList.appendChild(item);
    });
}

function renderFailedQuestions(failedQuestions) {
    const failedList = document.getElementById('failed-questions-list');
    failedList.innerHTML = '';
    
    failedQuestions.forEach(failed => {
        const item = document.createElement('div');
        item.className = 'failed-item';
        
        const userAnswerText = failed.userAnswer !== undefined 
            ? failed.question.options[failed.userAnswer] 
            : 'Non répondue';
            
        const correctAnswerText = failed.question.options[failed.correctAnswer];
        
        item.innerHTML = `
            <div class="failed-header">
                Question ${failed.index + 1} - ${failed.question.category}
            </div>
            <div class="failed-body">
                <p><strong>Question :</strong> ${failed.question.question}</p>
                <p><strong>Votre réponse :</strong> ${userAnswerText}</p>
                <p><strong>Bonne réponse :</strong> ${correctAnswerText}</p>
                <div class="failed-explanation">
                    <strong>Explication :</strong> ${failed.question.explanation}
                </div>
                <div class="babok-ref">
                    📖 Référence : ${failed.question.babokRef}
                </div>
            </div>
        `;
        
        failedList.appendChild(item);
    });
}

// Excel Import/Export (Simulated)
function showExcelModal(mode) {
    document.getElementById('excel-title').textContent = mode === 'import' ? 'Importer Questions Excel' : 'Exporter Questions Excel';
    
    const content = document.getElementById('excel-content');
    
    if (mode === 'import') {
        content.innerHTML = `
            <div class="form-group">
                <label class="form-label">Fichier Excel (.xlsx)</label>
                <input type="file" class="form-control" accept=".xlsx,.xls" id="excel-file">
                <small>Format attendu : Question | Option A | Option B | Option C | Option D | Bonne Réponse (0-3) | Explication | Référence BABOK</small>
            </div>
            <div class="modal-actions">
                <button class="btn btn--primary" onclick="importExcel()">Importer</button>
                <button class="btn btn--outline" onclick="hideModal('excel-modal')">Annuler</button>
            </div>
        `;
    } else {
        content.innerHTML = `
            <p>Cette fonction permettra d'exporter les questions actuelles au format Excel.</p>
            <div class="modal-actions">
                <button class="btn btn--primary" onclick="exportExcel()">Télécharger Excel</button>
                <button class="btn btn--outline" onclick="hideModal('excel-modal')">Fermer</button>
            </div>
        `;
    }
    
    showModal('excel-modal');
}

function importExcel() {
    const fileInput = document.getElementById('excel-file');
    if (!fileInput.files[0]) {
        alert('Veuillez sélectionner un fichier Excel.');
        return;
    }
    
    // Simulation of Excel import
    alert('📥 Import simulé ! Dans une vraie application, le fichier Excel serait traité ici.');
    hideModal('excel-modal');
}

function exportExcel() {
    // Simulation of Excel export
    const csvContent = generateCSVContent();
    downloadCSV(csvContent, 'questions-ecba.csv');
    hideModal('excel-modal');
}

function generateCSVContent() {
    let csv = 'Question,Option A,Option B,Option C,Option D,Bonne Réponse,Explication,Référence BABOK,Catégorie\n';
    
    questionBank.forEach(q => {
        const row = [
            `"${q.question.replace(/"/g, '""')}"`,
            `"${q.options[0].replace(/"/g, '""')}"`,
            `"${q.options[1].replace(/"/g, '""')}"`,
            `"${q.options[2].replace(/"/g, '""')}"`,
            `"${q.options[3].replace(/"/g, '""')}"`,
            q.correct,
            `"${q.explanation.replace(/"/g, '""')}"`,
            `"${q.babokRef.replace(/"/g, '""')}"`,
            `"${q.category.replace(/"/g, '""')}"`
        ].join(',');
        csv += row + '\n';
    });
    
    return csv;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('📊 Questions exportées avec succès !');
    }
}

function exportResults() {
    const correctAnswers = Object.keys(examState.answers).filter(
        key => examState.answers[key] === questionBank[key].correct
    ).length;
    
    const scorePercentage = Math.round((correctAnswers / questionBank.length) * 100);
    const passed = scorePercentage >= 75;
    const timeUsed = 5400 - examState.timeRemaining;
    
    let content = `RÉSULTATS EXAMEN ECBA - IIBA CAMEROUN\n`;
    content += `Date: ${new Date().toLocaleDateString('fr-FR')}\n`;
    content += `Heure: ${new Date().toLocaleTimeString('fr-FR')}\n\n`;
    content += `SCORE FINAL: ${scorePercentage}%\n`;
    content += `STATUT: ${passed ? 'RÉUSSI' : 'ÉCHOUÉ'}\n`;
    content += `Bonnes réponses: ${correctAnswers}/${questionBank.length}\n`;
    content += `Temps utilisé: ${formatTime(timeUsed)}\n`;
    content += `Questions marquées: ${examState.markedQuestions.size}\n\n`;
    
    content += `DÉTAIL DES RÉPONSES:\n`;
    questionBank.forEach((question, index) => {
        const userAnswer = examState.answers[index];
        const isCorrect = userAnswer === question.correct;
        const status = userAnswer === undefined ? 'Non répondue' : (isCorrect ? 'Correcte' : 'Incorrecte');
        
        content += `Q${index + 1}: ${status}\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `resultats-ecba-${new Date().toISOString().split('T')[0]}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('📊 Résultats exportés avec succès !');
    }
}

function restartExam() {
    showConfirmModal(
        'Recommencer l\'examen',
        'Êtes-vous sûr de vouloir recommencer un nouvel examen ? Tous les résultats actuels seront perdus.',
        () => {
            showScreen('welcome-screen');
        }
    );
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Welcome screen buttons
    document.getElementById('start-exam').addEventListener('click', startExam);
    document.getElementById('import-excel').addEventListener('click', () => showExcelModal('import'));
    document.getElementById('export-excel').addEventListener('click', () => showExcelModal('export'));
    
    // Exam navigation
    document.getElementById('prev-question').addEventListener('click', previousQuestion);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('finish-exam').addEventListener('click', finishExam);
    document.getElementById('mark-question').addEventListener('click', markQuestion);
    document.getElementById('show-marked').addEventListener('click', showMarkedQuestions);
    
    // Results screen
    document.getElementById('restart-exam').addEventListener('click', restartExam);
    document.getElementById('export-results').addEventListener('click', exportResults);
    
    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', () => hideModal('confirm-modal'));
    document.getElementById('close-marked').addEventListener('click', () => hideModal('marked-modal'));
    document.getElementById('close-excel').addEventListener('click', () => hideModal('excel-modal'));
    
    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Prevent accidental page refresh during exam
    window.addEventListener('beforeunload', (e) => {
        if (examState.isExamActive) {
            e.preventDefault();
            e.returnValue = 'Vous êtes en cours d\'examen. Êtes-vous sûr de vouloir quitter ?';
        }
    });
    
    // Initialize UI
    updateMarkedCount();
    
    console.log('✅ Simulateur ECBA IIBA Cameroun initialisé avec succès !');
    console.log(`📊 ${questionBank.length} questions chargées`);
});