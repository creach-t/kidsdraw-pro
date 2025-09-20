# 🎨 KidsDraw Pro

## Éditeur de dessin vectoriel 2D pour enfants de 6-10 ans

Application web interactive conçue pour l'apprentissage du dessin numérique en milieu scolaire.

## 🚀 Fonctionnalités principales

### Système de projets
- **Nouveau dessin** : Créer un projet avec prénom et nom
- **Galerie de travaux** : Visualiser et gérer tous les projets sauvegardés
- **Import SVG** : Importer des fichiers SVG existants
- **Sauvegarde automatique** : Enregistrement toutes les 15 secondes
- **Export SVG** : Télécharger les créations au format vectoriel

### Système de calques
- Jusqu'à 20 calques par projet
- Gestion de la visibilité et du verrouillage
- Contrôle de l'opacité (0-100%)
- Réorganisation par drag & drop
- Duplication et suppression de calques

### Outils de dessin
- **Formes** : Cercle, carré, rectangle, triangle, étoile, cœur, polygone, ligne
- **Édition de points** : Mode avancé avec courbes de Bézier
- **Styles** : Couleurs, dégradés, contours, ombres
- **Transformations** : Rotation, échelle, déformation

### Formats de canvas
- A4 Portrait (2480×3508px)
- A4 Paysage (3508×2480px)
- A3 Portrait (3508×4961px)
- A3 Paysage (4961×3508px)
- Instagram Carré (1080×1080px)
- Story (1080×1920px)
- Format personnalisé

### Raccourcis clavier complets

#### Sélection
- `Ctrl+A` : Tout sélectionner
- `Tab` : Forme suivante
- `Shift+Tab` : Forme précédente
- `Escape` : Désélectionner

#### Édition
- `Ctrl+Z` : Annuler (50 niveaux)
- `Ctrl+Y` / `Ctrl+Shift+Z` : Rétablir
- `Ctrl+C` : Copier
- `Ctrl+X` : Couper
- `Ctrl+V` : Coller
- `Ctrl+D` : Dupliquer
- `Delete/Backspace` : Supprimer
- `Ctrl+G` : Grouper
- `Ctrl+Shift+G` : Dégrouper

#### Déplacement
- `Flèches` : Déplacer 1px
- `Shift+Flèches` : Déplacer 10px
- `Ctrl+Flèches` : Dupliquer et déplacer

#### Transformation
- `[` : Rotation -15°
- `]` : Rotation +15°
- `<` : Réduire 10%
- `>` : Agrandir 10%

#### Outils
- `V` : Sélection
- `P` : Édition points
- `E` : Gomme
- `H` : Main (pan)
- `Z` : Zoom
- `L` : Ligne
- `T` : Texte
- `B` : Pinceau
- `I` : Pipette

#### Calques
- `Ctrl+Shift+N` : Nouveau calque
- `Ctrl+J` : Dupliquer calque
- `Ctrl+[` : Calque dessous
- `Ctrl+]` : Calque dessus

#### Fichier
- `Ctrl+S` : Sauvegarder
- `Ctrl+E` : Exporter SVG
- `Ctrl+N` : Nouveau projet

#### Vue
- `Ctrl+0` : Zoom 100%
- `Ctrl++` : Zoom avant
- `Ctrl+-` : Zoom arrière
- `Ctrl+1` : Ajuster fenêtre
- `Espace+Drag` : Pan
- `Molette` : Zoom

## 🛠️ Stack technique

- **TypeScript 5.0+** : Typage statique strict
- **Vite** : Build tool et dev server ultra-rapide
- **SVG.js** : Manipulation avancée de SVG
- **File Saver** : Export de fichiers
- **Nanoid** : Génération d'IDs uniques
- **Lodash-es** : Utilitaires optimisés
- **IndexedDB** : Stockage local performant

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/creach-t/kidsdraw-pro.git
cd kidsdraw-pro

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## 📁 Structure du projet

```
kidsdraw-pro/
├── src/
│   ├── managers/           # Gestionnaires principaux
│   │   ├── CanvasManager.ts
│   │   ├── LayerManager.ts
│   │   ├── StorageManager.ts
│   │   └── ShortcutManager.ts
│   ├── utils/              # Utilitaires
│   │   └── shapes.ts
│   ├── types.ts            # Définitions TypeScript
│   ├── config.ts           # Configuration globale
│   ├── styles.css          # Styles CSS
│   └── app.ts              # Point d'entrée application
├── index.html              # Page HTML principale
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 Utilisation

### Créer un nouveau dessin

1. Cliquez sur "Nouveau dessin"
2. Entrez votre prénom et le nom du projet
3. Commencez à dessiner !

### Reprendre un travail

1. Cliquez sur "Reprendre un travail"
2. Parcourez la galerie de vos projets
3. Cliquez sur "Ouvrir" pour continuer

### Importer un SVG

1. Cliquez sur "Importer SVG"
2. Sélectionnez votre fichier
3. Entrez votre prénom si demandé
4. Modifiez et exportez

## 💾 Stockage

- **LocalStorage** : Stockage principal des projets
- **IndexedDB** : Fallback pour gros fichiers
- **Limite** : 100 projets maximum
- **Auto-save** : Toutes les 15 secondes

## 🎨 Interface utilisateur

- Design coloré et intuitif pour enfants
- Icônes grandes et claires
- Feedback visuel immédiat
- Messages d'aide contextuels
- Interface responsive

## 🔒 Sécurité et performance

- TypeScript strict mode
- Gestion d'erreurs complète
- Validation des entrées utilisateur
- Optimisation des rendus SVG
- Limitation du nombre de projets
- Compression des données

## 🌐 Compatibilité

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

MIT

## 👨‍💻 Développement

### Commandes disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm run preview      # Preview du build
npm run lint         # Linter TypeScript
npm run type-check   # Vérification des types
```

### Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -am 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Créer une Pull Request

## 🐛 Rapporter un bug

Ouvrez une issue sur GitHub avec :
- Description du problème
- Étapes pour reproduire
- Screenshots si possible
- Navigateur et version

## 🙏 Remerciements

- SVG.js pour la manipulation SVG
- Vite pour le build ultra-rapide
- La communauté TypeScript

---

**Fait avec ❤️ pour l'éducation des enfants**
