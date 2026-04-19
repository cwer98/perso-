# MuscleTrack — Strava pour la musculation

## Prérequis

- Node.js (v18+)
- PostgreSQL (v14+)

---

## 1. Base de données

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE muscletrack;"

# Créer les tables
psql -U postgres -d muscletrack -f backend/db/schema.sql
```

---

## 2. Backend

```bash
cd backend

# Copier et remplir les variables d'environnement
cp .env.example .env
# Éditez .env avec vos infos PostgreSQL

# Installer les dépendances
npm install

# Insérer les exercices dans la base
npm run seed

# Démarrer le serveur (dev)
npm run dev
```

Le serveur tourne sur **http://localhost:3000**

---

## 3. Frontend

Aucune installation nécessaire. Le frontend est servi automatiquement par le serveur Express.

Ouvrez **http://localhost:3000** dans votre navigateur.

---

## Structure du projet

```
Projet 1/
├── backend/
│   ├── server.js              # Point d'entrée Express
│   ├── package.json
│   ├── .env.example
│   ├── db/
│   │   ├── schema.sql         # Schéma PostgreSQL
│   │   ├── seed.js            # ~100 exercices pré-chargés
│   │   └── connection.js
│   ├── middleware/
│   │   └── auth.js            # Vérification JWT
│   ├── routes/                # Définition des routes API
│   └── controllers/           # Logique métier
│
└── frontend/
    ├── index.html             # SPA shell
    ├── css/style.css          # Tous les styles
    └── js/
        ├── app.js             # Router + fonctions globales
        ├── api.js             # Client API
        ├── auth.js            # Gestion authentification
        └── pages/
            ├── home.js        # Fil d'actualité
            ├── workout.js     # Tracker de séance + body picker
            ├── history.js     # Historique des séances
            ├── dashboard.js   # Graphiques de progression
            └── profile.js     # Profil utilisateur
```

---

## API REST

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/feed | Fil d'actualité |
| GET/POST | /api/workouts | Séances |
| GET/PUT/DELETE | /api/workouts/:id | Séance spécifique |
| POST | /api/workouts/:id/exercises | Ajouter exercice |
| POST | /api/workouts/exercises/:id/sets | Ajouter série |
| GET | /api/exercises | Liste des exercices (filtrable) |
| GET | /api/users/:id | Profil utilisateur |
| GET | /api/users/:id/stats | Statistiques |
| POST/DELETE | /api/social/follow/:id | Suivre/Ne plus suivre |
| POST/DELETE | /api/social/kudos/:id | Kudos |
| GET/POST | /api/social/comments/:id | Commentaires |
