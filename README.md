# BillManagement

A modern React billing management app (Devis/Facturation) with Firebase authentication/real-time database, MUI/Tailwind UI, and PDF invoice generation.

## Features

- User auth via Firebase (admin + manager roles).
- Sidebar navigation and role-based page access.
- Create, preview, and save invoices in Firebase Realtime Database.
- Add articles from `json-server` catalog and assign clients from Firebase.
- Auto-calculated HT, TVA (20%), and TTC totals.
- Download invoice as PDF using `jspdf` + `jspdf-autotable`.
- Dashboard, client and article CRUD for admins via `Settings` component.
- Invoice history and payment tracking via `SuiviFacture`.
- Responsive UI built with Tailwind / Material Icons.

## Tech stack

- React 19
- Firebase (Auth + Realtime Database)
- Tailwind CSS and MUI
- React Router DOM
- jspdf and jspdf-autotable
- recharts (dashboard charts)

## Getting started

### prerequisites

- Node.js 18+
- npm 10+
- Firebase project (web app)
- Optional: `json-server` for local article catalog

### Install

```bash
npm install
```

### Environment variables

Create `.env` at project root with your Firebase config:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_DATABASE_URL=...
```

### Start json-server (required for `Facturation` catalogue)

```bash
npm install -g json-server
# from project root or a small data folder
json-server --watch db.json --port 3001
```

`db.json` example:

```json
{
  "articles": [
    { "id": "a1", "designation": "Service Web", "prix_unitaire": 1200 },
    { "id": "a2", "designation": "Maintenance", "prix_unitaire": 450 }
  ],
  "categories": []
}
```

### Run app

```bash
npm start
```

Open `http://localhost:3000`.

## Available routes

- `/` login page
- UI pages are rendered after auth inside sidebar:
  - `Dashboard` (admin only)
  - `Paramètres CRUD` (admin only)
  - `Créer Facture`
  - `Suivi & Paiements`
  - `Catalogue Articles`
  - `Clients`

## Firebase data model (expected)

- `/users/{uid}/role` = `Admin` or `Manager`
- `/clients/{id}` records with `nom`, `adresse`, `email`
- `/factures/{id}` with invoice metadata and `articles` array

## Notes

- `src/services/jsonService.js` uses `http://localhost:3001` for articles and categories.
- `src/component/Facturation.js` saves invoices to Firebase and generates a PDF.
- Auth state from `src/contexts/AuthContext.js` controls role-based nav.

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```

## Troubleshooting

- Verify Firebase API URL + keys in `.env` and restart app.
- Ensure `json-server` is running on `http://localhost:3001`.
- Clear browser storage if stale auth state persists.

## License

MIT
