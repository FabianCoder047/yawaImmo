# 🏠 YawaImmo - Plateforme Immobilière

Une plateforme moderne de gestion immobilière construite avec Laravel, Inertia.js et React.

## ✨ Fonctionnalités

### 👥 Gestion des utilisateurs

- **Inscription sans vérification d'email** - Connexion automatique après création de compte
- **3 types d'utilisateurs** : Clients, Propriétaires, Administrateurs
- **Avatar avec dropdown** sur la page d'accueil pour les utilisateurs connectés

### 🏢 Espace Propriétaire

- **Dashboard complet** avec statistiques des biens
- **Gestion des biens** (CRUD complet)
- **Système d'abonnement** avec plans Premium
- **Statistiques détaillées** de performance
- **Modération automatique** des biens

### 🏠 Espace Client

- **Recherche de biens** avec filtres
- **Système de favoris**
- **Demandes de propriétés** avec messagerie
- **Historique des demandes**

### 👨‍💼 Espace Administrateur

- **Dashboard de gestion** avec métriques
- **Modération des biens** (approuver/rejeter)
- **Gestion des utilisateurs** (clients et propriétaires)
- **Gestion des catégories** et abonnements
- **Statistiques globales** de la plateforme

## 🚀 Installation

### Prérequis

- PHP 8.1+
- Composer
- Node.js 16+
- MySQL/PostgreSQL

### Étapes d'installation

1. **Cloner le projet**

```bash
git clone [url-du-repo]
cd yawaImmo
```

2. **Installer les dépendances PHP**

```bash
composer install
```

3. **Installer les dépendances Node.js**

```bash
npm install
```

4. **Configurer l'environnement**

```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurer la base de données**

```bash
# Modifier .env avec vos paramètres de base de données
Créer la base de données et importer le fichier yawaimmo.sql 
```

6. **Créer le lien symbolique pour le stockage**

```bash
php artisan storage:link
```

7. **Compiler les assets**

```bash
npm run build
```

8. **Lancer le serveur**

```bash
php artisan serve
```

## 📁 Structure du projet

```
yawaImmo/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/          # Contrôleurs admin
│   │   ├── Auth/           # Authentification
│   │   ├── Client/         # Contrôleurs client
│   │   └── Proprietaire/   # Contrôleurs propriétaire
│   ├── Models/             # Modèles Eloquent
│   └── Middleware/         # Middlewares personnalisés
├── resources/js/
│   ├── components/         # Composants React
│   ├── layouts/           # Layouts avec sidebar
│   └── pages/             # Pages Inertia
├── routes/
│   ├── web.php           # Routes principales
│   ├── auth.php          # Routes d'authentification
│   └── settings.php      # Routes des paramètres
└── database/
    ├── migrations/        # Migrations de base de données
    └── seeders/          # Seeders pour les données de test
```

## 🎨 Interface utilisateur

### Design System

- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants
- **React Icons** pour les icônes
- **Responsive design** mobile-first

### Layouts

- **ClientLayout** - Sidebar verte pour les clients
- **ProprietaireLayout** - Sidebar bleue pour les propriétaires
- **AdminLayout** - Sidebar rouge pour les administrateurs

## 🔐 Authentification & Autorisation

### Middlewares

- `auth` - Vérification de connexion
- `check.subscription` - Vérification d'abonnement actif
- `HandleInertiaRequests` - Gestion des props Inertia

### Rôles utilisateurs

- **Client** : Recherche, favoris, demandes
- **Propriétaire** : Gestion des biens, statistiques
- **Admin** : Modération, gestion utilisateurs

## 📊 Base de données

### Tables principales

- `users` - Utilisateurs (clients, propriétaires, admins)
- `properties` - Biens immobiliers
- `subscriptions` - Plans d'abonnement
- `user_subscriptions` - Abonnements des utilisateurs
- `property_requests` - Demandes de propriétés
- `categories` - Catégories de biens

## 🛠️ Technologies utilisées

### Backend

- **Laravel 11** - Framework PHP
- **Inertia.js** - SPA sans API
- **MySQL/PostgreSQL** - Base de données

### Frontend

- **React 18** - Interface utilisateur
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Shadcn/ui** - Composants UI

### Outils

- **Vite** - Build tool
- **Laravel Mix** - Compilation d'assets
- **PHPUnit** - Tests unitaires

## 🧪 Tests

```bash
# Tests unitaires
php artisan test

# Tests avec couverture
php artisan test --coverage
```

## 📝 Scripts disponibles

```bash
# Développement
npm run dev

# Production
npm run build

# Linting
npm run lint

# Formatage
npm run format
```

## 🚀 Déploiement

### Production

1. Configurer les variables d'environnement
2. Optimiser l'autoloader : `composer install --optimize-autoloader --no-dev`
3. Compiler les assets : `npm run build`
4. Configurer le cache : `php artisan config:cache`

### Variables d'environnement importantes

```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
MAIL_MAILER=smtp
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**YawaImmo** - Votre plateforme immobilière moderne 🏠✨
