# Gestionnaire d'Achats - API Backend

## Présentation du Projet

Notre projet est une API de gestion de dépenses qui permet aux utilisateurs d’enregistrer leurs dépenses et leurs achats et d'appliquer des filtres pour mieux gérer leur argent.

## Architecture du Projet

### Technologies Utilisées

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **ES Modules** (`import/export`)
- **dotenv** - Gestion des variables d'environnement
- **ValidatorJS** - Validation des données

### Structure des Dossiers

```
gestion-depenses-backend/
├── config/
│   └── database.js 
├── routes/
│   ├── users.routes.js 
│   ├── depenses.routes.js
│   └── achats.routes.js  
├── models/
│   ├── User.js
│   ├── Depense.js
│   └── Achat.js
├── data/
│   ├── depenses_import.json
│   └── stats_export.json
├── server.js             
├── package.json
├── .env
└── README.md
```

---

## Modèle de Données

### Collections MongoDB

#### 1. Users (Utilisateurs)
```javascript
{
  _id: ObjectId,
  firstName: String,        // Prénom (obligatoire)
  lastName: String,         // Nom (obligatoire)
  salary: Number,           // Salaire (≥ 0, obligatoire)
  job: String              // Métier (défaut: "Non renseigné")
}
```

**Validations:**
- `firstName` : obligatoire, chaîne sans espaces inutiles
- `lastName` : obligatoire, chaîne sans espaces inutiles
- `salary` : obligatoire, nombre positif ou nul
- `job` : optionnel, valeur par défaut si non renseigné

#### 2. Depenses (Catégories de dépenses)
```javascript
{
  _id: ObjectId,
  name: String,            // Nom de la catégorie (obligatoire)
  description: String      // Description (optionnel)
}
```

**Validations:**
- `name` : obligatoire, chaîne sans espaces inutiles
- `description` : optionnel, chaîne sans espaces inutiles


#### 3. Achats (Transactions d'achat)
```javascript
{
  _id: ObjectId,
  user: ObjectId,          // Référence vers Users (obligatoire)
  depense: ObjectId,       // Référence vers Depenses (obligatoire)
  amount: Number,          // Montant de l'achat (≥ 0, obligatoire)
  date: Date,              // Date de l'achat (obligatoire)
  description: String      // Description de l'achat (optionnel)
}
```

**Validations:**
- `user` : référence obligatoire vers la collection Users
- `depense` : référence obligatoire vers la collection Depenses
- `amount` : obligatoire, nombre positif ou nul
- `date` : obligatoire, format Date
- `description` : optionnel, chaîne sans espaces inutiles

### Relations entre Collections

- **Users** ↔️ **Achats** : Relation 1-N (un utilisateur peut avoir plusieurs achats)
- **Depenses** ↔️ **Achats** : Relation 1-N (une catégorie de dépense peut être liée à plusieurs achats)
- **Achats** : Collection centrale qui référence à la fois Users et Depenses via `populate()`

---

## Installation et Configuration

### Prérequis

- Node.js
- MongoDB (Atlas)
- npm

### Étapes d'Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du projet :
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/[nom_database]
NODE_ENV=development
```

3. **Importer les données initiales**
```bash
node scripts/importData.js
```

5. **Lancer le serveur**
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

---

## Documentation des Routes API

### Base URL
```
http://localhost:5000/api
```

---

### [Collection achat]

#### 1. Récupérer tous les achats d'un user par objectid (GET) Philippe
```
GET //localhost:5000/api/achats/filter?user=69374a2ddef7e4f5b7ec6927
```

#### 2. Créer un achat (POST) Kevin
```
POST //localhost:5000/api/achats/

{
  "user": "<USER_OBJECT_ID>",
  "depense": "<DEPENSE_OBJECT_ID>",
  "amount": 50,
  "date": "2025-12-18",
  "description": "Texte descriptif"
}
```

#### 3. Récupérer les stats globales des achats (GET) Kevin
```
GET //localhost:5000/api/achats/stats/total
```
#### 4. Exporter les statistiques globales en JSON (GET) Tatiana
```
Calcule le total et l'écrit dans le fichier "data/stats_export.json" sur le serveur.

GET //localhost:5000/api/achats/export
```

---

### [Collection dépense] (Categorie)

#### 1. Créer une dépense/categorie (POST) Philippe
```
POST //localhost:5000/api/depenses/

{
  "name": "valeur1",
  "description": "valeur2" (optionnel)
}
```

#### 3. Récupérer les stats globales par catégories de dépense (GET) Tatiana
```
http://localhost:5000/stats/by-category

GET //localhost:5000/api/depenses/stats/usage
```
#### 4. Lister toutes les catégories (GET) Kevin
```
GET //localhost:5000/api/depenses/
```

### [Collection user]

#### 1. Récupérer tous les users avec leurs statistiques salaire moyen... (GET) Philippe
```
GET //localhost:5000/api/users/stats/salary
```
#### 2. Créer un user (POST) Tatiana
```
POST //localhost:5000/api/users/
```

---

## Auteurs

- **[Membre 1]** - Philippe Peng
- **[Membre 2]** - Tatiana Blisac
- **[Membre 3]** - Kévin Nguyen
- **[Membre 4]** - Rémi Paillaud-Iwabuchi

---

**Date de réalisation:** Décembre - 2025
**Formation:** Skills4Mind - M.TAALBI RABAH

**Projet:** Gestion dépenses















