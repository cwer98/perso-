# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**MuscleTrack** — application web de suivi d'entraînement avec réseau social. Stack : Node.js/Express (backend) + HTML/CSS/JS vanilla (frontend), SQLite via sql.js (WebAssembly, sans compilation native).

## Commands

```bash
# Démarrer le serveur de développement (depuis /backend)
cd backend && npm run dev     # nodemon, rechargement auto

# Démarrer en production
cd backend && npm start

# Peupler la base (si vide)
node backend/db/seed.js
```

Le frontend est servi statiquement par Express — pas de build step, pas de bundler.

## Architecture

```
backend/
  server.js          # Point d'entrée Express, monte toutes les routes
  db/connection.js   # Singleton sql.js — toute la BDD passe par ce module
  middleware/auth.js # Vérification JWT Bearer token
  controllers/       # Logique métier (un fichier par domaine)
  routes/            # Définition des routes Express (un fichier par domaine)
frontend/
  index.html         # SPA unique, charge tous les scripts
  js/
    api.js           # Client HTTP centralisé (window.api), BASE = localhost:3000/api
    auth.js          # Gestion token JWT dans localStorage (window.auth)
    app.js           # Router hash-based (#/home, #/workout…), helpers globaux
    pages/           # Fonctions renderXxx() appelées par le router
  css/style.css      # CSS monolithique avec variables CSS (thème dark/light)
```

### Points clés

- **Base de données** : `sql.js` tourne en WebAssembly côté Node. Chaque écriture appelle `save()` qui persiste le fichier `muscletrack.sqlite` à la racine. Pas de connexion async — l'API `db` exposée est **synchrone** (wrapper autour du mode synchrone de sql.js).
- **Auth** : JWT signé avec `JWT_SECRET`. Le middleware `auth.js` décode le token et injecte `req.user`. Le frontend stocke le token dans `localStorage` et l'envoie via `Authorization: Bearer`.
- **Frontend SPA** : routing via `window.location.hash`. Chaque page est une fonction `renderXxx()` dans `frontend/js/pages/`. Les helpers globaux (`api`, `auth`, `toast`, `navigate`, `avatarHtml`, `formatDate`, etc.) sont exposés sur `window` depuis `app.js` et `api.js`.
- **Pas de framework frontend** : manipulation DOM directe, `innerHTML` pour le rendu des pages.

## Env

Copier `.env.example` → `.env` dans `/backend` et renseigner :
- `JWT_SECRET` : clé secrète longue et aléatoire
- `PORT` : défaut 3000 (le frontend `api.js` pointe en dur sur `localhost:3000`)
