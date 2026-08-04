# HONOR — Atelier & Cours de Couture

Site officiel de la maison **HONOR**. HONOR propose des cours de couture en ligne (vêtements et linge de maison) et un service d'atelier de confection sur mesure réalisé dans des étoffes d'exception.

## Technologies

- **Framework** : [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router)
- **UI & Style** : React 19, Tailwind CSS v4, Radix UI & Lucide Icons
- **Language** : TypeScript
- **Bundler / Build** : Vite

## Développement local

### Prérequis
- Node.js (version 20 ou supérieure)

### Installation
```sh
npm install
```

### Lancer le serveur de développement
```sh
npm run dev
```

### Build pour la production
```sh
npm run build
```

## Structure du projet

- `src/routes/` : Routes de l'application (Accueil, Cours, Sur-mesure, Mentions Légales)
- `src/components/` : Composants UI réutilisables (Navigation, Pied de page, Modales)
- `src/lib/` : Catalogue des cours et confection, utilitaires
- `src/assets/` : Photographies d'atelier et visuels des pièces
