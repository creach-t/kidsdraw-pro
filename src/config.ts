/**
 * Configuration globale de l'application
 */

import type { CanvasFormat, CanvasFormatConfig } from './types';

/**
 * Formats de canvas disponibles
 */
export const CANVAS_FORMATS: Record<CanvasFormat, CanvasFormatConfig> = {
  'a4-portrait': { 
    width: 2480, 
    height: 3508, 
    label: 'A4 Portrait (21×29.7cm)' 
  },
  'a4-landscape': { 
    width: 3508, 
    height: 2480, 
    label: 'A4 Paysage (29.7×21cm)' 
  },
  'a3-portrait': { 
    width: 3508, 
    height: 4961, 
    label: 'A3 Portrait (29.7×42cm)' 
  },
  'a3-landscape': { 
    width: 4961, 
    height: 3508, 
    label: 'A3 Paysage (42×29.7cm)' 
  },
  'instagram-square': { 
    width: 1080, 
    height: 1080, 
    label: 'Instagram Carré (1080×1080px)' 
  },
  'story': { 
    width: 1080, 
    height: 1920, 
    label: 'Story (1080×1920px)' 
  },
  'custom': { 
    width: 800, 
    height: 600, 
    label: 'Personnalisé' 
  }
};

/**
 * Palette de couleurs prédéfinies
 */
export const COLORS = [
  '#FF6B6B', // Rouge
  '#4ECDC4', // Turquoise
  '#45B7D1', // Bleu ciel
  '#96CEB4', // Vert menthe
  '#FFEAA7', // Jaune
  '#DDA0DD', // Mauve
  '#FF9FF3', // Rose
  '#54A0FF', // Bleu
  '#5F27CD', // Violet
  '#00D2D3', // Cyan
  '#FF6348', // Orange
  '#1DD1A1'  // Vert
];

/**
 * Configuration des outils
 */
export const TOOLS = [
  { id: 'select', icon: '↖️', label: 'Sélection (V)', key: 'v' },
  { id: 'point-edit', icon: '✏️', label: 'Édition points (P)', key: 'p' },
  { id: 'eraser', icon: '🧹', label: 'Gomme (E)', key: 'e' },
  { id: 'hand', icon: '✋', label: 'Main (H)', key: 'h' },
  { id: 'zoom', icon: '🔍', label: 'Zoom (Z)', key: 'z' },
  { id: 'line', icon: '📏', label: 'Ligne (L)', key: 'l' },
  { id: 'text', icon: '📝', label: 'Texte (T)', key: 't' },
  { id: 'brush', icon: '🖌️', label: 'Pinceau (B)', key: 'b' },
  { id: 'eyedropper', icon: '💧', label: 'Pipette (I)', key: 'i' }
];

/**
 * Configuration des formes
 */
export const SHAPES = [
  { type: 'circle', icon: '⭕', label: 'Cercle' },
  { type: 'square', icon: '⬜', label: 'Carré' },
  { type: 'rectangle', icon: '▬', label: 'Rectangle' },
  { type: 'triangle', icon: '🔺', label: 'Triangle' },
  { type: 'star', icon: '⭐', label: 'Étoile' },
  { type: 'heart', icon: '❤️', label: 'Cœur' },
  { type: 'polygon', icon: '⬡', label: 'Polygone' },
  { type: 'line', icon: '📏', label: 'Ligne' }
];

/**
 * Constantes de l'application
 */
export const AUTOSAVE_INTERVAL = 15000; // 15 secondes
export const MAX_LAYERS = 20;
export const MAX_HISTORY = 50;
export const MAX_PROJECTS = 100;
export const STORAGE_KEY = 'kidsdraw_projects';

/**
 * Configuration des points de contrôle
 */
export const ANCHOR_POINT_RADIUS = 8;
export const CONTROL_POINT_RADIUS = 6;
export const SELECTION_PADDING = 10;

/**
 * Configuration du zoom
 */
export const MIN_ZOOM = 0.1; // 10%
export const MAX_ZOOM = 5; // 500%
export const ZOOM_STEP = 0.1; // 10%

/**
 * Configuration de la grille
 */
export const GRID_SIZE = 20;
export const SNAP_THRESHOLD = 10; // pixels

/**
 * Messages de l'application
 */
export const MESSAGES = {
  SAVED: '✓ Sauvegardé',
  EXPORTED: '✓ Projet exporté',
  ERROR_SAVE: '❌ Erreur de sauvegarde',
  ERROR_LOAD: '❌ Erreur de chargement',
  ERROR_EXPORT: '❌ Erreur d\'export',
  PROJECT_DELETED: '✓ Projet supprimé',
  LAYER_CREATED: '✓ Nouveau calque créé',
  MAX_LAYERS_REACHED: '⚠️ Nombre maximum de calques atteint',
  MAX_PROJECTS_REACHED: '⚠️ Nombre maximum de projets atteint'
};

/**
 * Valeurs par défaut
 */
export const DEFAULT_FILL = {
  type: 'solid' as const,
  color: '#FF6B6B'
};

export const DEFAULT_STROKE = {
  width: 2,
  color: '#2C3E50'
};

export const DEFAULT_TRANSFORM = {
  x: 0,
  y: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1
};

export const DEFAULT_LAYER_NAME = 'Calque';
export const DEFAULT_PROJECT_NAME = 'Mon dessin';
