/**
 * Configuration complète - KidsDraw Pro
 */

import type { CanvasFormat, CanvasFormatConfig, Fill, Stroke, Transform } from './types';

// Formats de canvas
export const CANVAS_FORMATS: Record<CanvasFormat, CanvasFormatConfig> = {
  'a4-portrait': {
    width: 2480,
    height: 3508,
    label: 'A4 Portrait (210×297mm)'
  },
  'a4-landscape': {
    width: 3508,
    height: 2480,
    label: 'A4 Paysage (297×210mm)'
  },
  'a3-portrait': {
    width: 3508,
    height: 4961,
    label: 'A3 Portrait (297×420mm)'
  },
  'a3-landscape': {
    width: 4961,
    height: 3508,
    label: 'A3 Paysage (420×297mm)'
  },
  'instagram-square': {
    width: 1080,
    height: 1080,
    label: 'Instagram Carré (1:1)'
  },
  'instagram-story': {
    width: 1080,
    height: 1920,
    label: 'Instagram Story (9:16)'
  },
  'custom': {
    width: 800,
    height: 600,
    label: 'Personnalisé'
  }
};

// Outils disponibles
export const TOOLS = [
  { id: 'select', icon: '▲', label: 'Sélection (V)', key: 'v' },
  { id: 'pen', icon: '✏️', label: 'Plume (P)', key: 'p' },
  { id: 'edit-points', icon: '📍', label: 'Édition points (A)', key: 'a' },
  { id: 'eraser', icon: '🧹', label: 'Gomme (E)', key: 'e' },
  { id: 'hand', icon: '✋', label: 'Main (H)', key: 'h' },
  { id: 'zoom', icon: '🔍', label: 'Zoom (Z)', key: 'z' },
  { id: 'text', icon: 'T', label: 'Texte (T)', key: 't' },
  { id: 'brush', icon: '🖌️', label: 'Pinceau (B)', key: 'b' },
  { id: 'eyedropper', icon: '💧', label: 'Pipette (I)', key: 'i' }
];

// Formes disponibles
export const SHAPES = [
  { id: 'circle', icon: '⭕', label: 'Cercle' },
  { id: 'square', icon: '⬜', label: 'Carré' },
  { id: 'rectangle', icon: '▭', label: 'Rectangle' },
  { id: 'triangle', icon: '▲', label: 'Triangle' },
  { id: 'star', icon: '⭐', label: 'Étoile' },
  { id: 'heart', icon: '❤️', label: 'Cœur' },
  { id: 'polygon', icon: '⬡', label: 'Polygone' },
  { id: 'line', icon: '📏', label: 'Ligne (L)', key: 'l' }
];

// Palette de couleurs
export const COLORS = [
  '#FF6B6B', // Rouge
  '#4ECDC4', // Turquoise
  '#45B7D1', // Bleu
  '#96CEB4', // Vert
  '#FFEAA7', // Jaune
  '#DDA0DD', // Mauve
  '#FF9FF3', // Rose
  '#FFA726', // Orange
  '#000000', // Noir
  '#FFFFFF', // Blanc
  '#808080', // Gris
  '#A0522D'  // Marron
];

// Configuration du zoom
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 10;
export const ZOOM_STEP = 0.1;

// Configuration des points
export const POINT_RADIUS = 6;
export const HANDLE_RADIUS = 5;
export const POINT_COLOR = '#007AFF';
export const POINT_HOVER_COLOR = '#FF3B30';
export const HANDLE_COLOR = '#34C759';

// Configuration des calques
export const DEFAULT_LAYER_NAME = 'Calque';
export const MAX_LAYERS = 20;

// Configuration générale
export const AUTOSAVE_INTERVAL = 15000; // 15 secondes
export const MAX_HISTORY = 50;
export const STORAGE_KEY = 'kidsdraw_projects';
export const MAX_PROJECTS = 100;

// Messages
export const MESSAGES = {
  SAVED: '✓ Sauvegardé',
  EXPORTED: '✓ Exporté',
  ERROR_SAVE: '❌ Erreur sauvegarde',
  ERROR_EXPORT: '❌ Erreur export',
  PROJECT_DELETED: '✓ Projet supprimé',
  PROJECT_CREATED: '✓ Projet créé',
  LAYER_CREATED: '✓ Calque créé',
  LAYER_DELETED: '✓ Calque supprimé',
  MAX_LAYERS: `❌ Maximum ${MAX_LAYERS} calques`,
  MAX_PROJECTS: `❌ Maximum ${MAX_PROJECTS} projets`
};

// Valeurs par défaut pour les formes
export const DEFAULT_FILL: Fill = {
  type: 'solid',
  color: '#FF6B6B'
};

export const DEFAULT_STROKE: Stroke = {
  width: 2,
  color: '#000000',
  lineCap: 'round',
  lineJoin: 'round'
};

export const DEFAULT_TRANSFORM: Transform = {
  x: 0,
  y: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1
};

// Grille
export const GRID_SIZE = 20;
export const GRID_COLOR = '#e0e0e0';

// Sélection
export const SELECTION_COLOR = '#007AFF';
export const SELECTION_WIDTH = 2;