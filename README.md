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

Le serveur démarre sur `http://localhost:3000`

---

## Documentation des Routes API

### Base URL
```
http://localhost:3000/api
```

---

### [Collection achat]

#### 1. Créer un [élément] (POST)
```http
POST /api/[ressource]
Content-Type: application/json

{
  "champ1": "valeur1",
  "champ2": "valeur2"
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "champ1": "valeur1",
    "champ2": "valeur2"
  }
}
```

#### 2. Récupérer tous les [éléments] avec filtres (GET)
```http
GET /api/[ressource]?page=1&limit=10&sort=-createdAt&filter=valeur
```

**Paramètres de requête:**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)
- `sort` (optionnel) : Tri par champ (ex: `-createdAt` pour décroissant)
- `filter` (optionnel) : Filtre par [critère]

**Réponse (200 OK):**
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  },
  "data": [...]
}
```

#### 3. Récupérer un [élément] par ID (GET)
```http
GET /api/[ressource]/:id
```

#### 4. Mettre à jour un [élément] (PUT)
```http
PUT /api/[ressource]/:id
Content-Type: application/json

{
  "champ1": "nouvelle_valeur"
}
```

#### 5. Supprimer un [élément] (DELETE)
```http
DELETE /api/[ressource]/:id
```

---

### [Collection dépense]

### [Collection user]

### Gestion des Fichiers JSON

#### Importer des données depuis JSON

#### Exporter des données vers JSON

---

## Auteurs

- **[Membre 1]** - Philippe Peng
**Routes développées:**
1. [Route 1] - [Description]
2. [Route 2] - [Description]
3. [Route 3 avec agrégation] - [Description]
- **[Membre 2]** - Tatiana Blisac
**Routes développées:**
1. [Route 1] - [Description]
2. [Route 2] - [Description]
3. [Route 3 avec agrégation] - [Description]
- **[Membre 3]** - Kévin Nguyen
**Routes développées:**
1. [Route 1] - [Description]
2. [Route 2] - [Description]
3. [Route 3 avec agrégation] - [Description]
- **[Membre 4]** - Rémi Paillaud-Iwabuchi
**Routes développées:**
1. [Route 1] - [Description]
2. [Route 2] - [Description]
3. [Route 3 avec agrégation] - [Description]

---

**Date de réalisation:** Décembre - 2025
**Formation:** Skills4Mind - M.TAALBI RABAH

**Projet:** Gestion dépenses
