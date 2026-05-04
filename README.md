# 🛍️ Application E-CommerceApplication
 e-commerce complète développée avec **React.js** (frontend) et API backend (Node.js / Express).
 
 ---## 📁 Structure du projet SHOP/
├── frontend/               # Application React (Vite)
│   ├── src/
│   │   ├── pages/          # Pages principales (Connexion, Inscription, Catalogue, etc.)
│   │   ├── Styles/         # Fichiers CSS
│   │   ├── contexte/       # Context API (User, Panier)
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── test/               # Tests (Vitest)
│   │   ├── connexion.test.jsx
│   │   └── inscription.test.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # 
│   ├── routes/
│   ├── models/
│   ├── server.js
│   └── package.json
│
└── .gitlab-ci.yml          # Pipeline GitLab CI/CD

##  Fonctionnalités

- ✅ Inscription avec validation stricte du mot de passe
- ✅ Connexion avec système anti-brute-force (5 tentatives)
- ✅ Catalogue de produits
- ✅ Panier d'achat avec gestion des quantités
- ✅ Contextes React (User, Panier)
- ✅ Tests unitaires complets

##  Tests

Le projet utilise **Vitest** avec **React Testing Library**.

- Tests d'inscription (validation mot de passe)
- Tests de connexion (anti-brute-force)
- Pipeline CI/CD GitLab exécute automatiquement les tests


##  Installation ###

  Frontend
 ``bash
 cd frontend
 npm install
 npm run dev

➡️ L'application démarre sur :
http://localhost:5173

##  Base de données

- **MongoDB** : Base de données locale ou MongoDB Atlas
- **Collections** :
  - `users` : Utilisateurs inscrits
  - `produits` : Catalogue produits

##  Auteur

Radouani Wiam
