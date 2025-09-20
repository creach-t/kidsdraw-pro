/**
 * Types complets pour KidsDraw Pro
 */

// Outils disponibles
export type Tool =
  | 'select'    // Sélection
  | 'pen'       // Plume/dessin libre
  | 'eraser'    // Gomme
  | 'hand'      // Main (pan)
  | 'zoom'      // Zoom
  | 'text'      // Texte
  | 'brush'     // Pinceau
  | 'eyedropper' // Pipette
  | 'edit-points'; // Édition de points

// Types de formes
export type ShapeType =
  | 'circle'
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'polygon'
  | 'line'
  | 'path'
  | 'text';

// Point avec coordonnées
export interface Point {
  x: number;
  y: number;
  type?: 'anchor' | 'control';
  cp1?: { x: number; y: number }; // Point de contrôle 1 (Bézier)
  cp2?: { x: number; y: number }; // Point de contrôle 2 (Bézier)
}

// Dégradé
export interface Gradient {
  type: 'linear' | 'radial';
  stops: Array<{
    offset: number;
    color: string;
  }>;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

// Remplissage
export interface Fill {
  type: 'solid' | 'gradient' | 'none';
  color?: string;
  gradient?: Gradient;
}

// Contour
export interface Stroke {
  width: number;
  color: string;
  dashArray?: string;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
}

// Transformation
export interface Transform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  skewX?: number;
  skewY?: number;
}

// Ombre
export interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

// Forme
export interface Shape {
  id: string;
  type: ShapeType;
  points: Point[];
  fill: Fill;
  stroke: Stroke;
  transform: Transform;
  shadow?: Shadow;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  name?: string;
  order?: number;
}

// Calque
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  shapes: Shape[];
  order: number;
}

// Formats de canvas
export interface CanvasFormatConfig {
  width: number;
  height: number;
  label: string;
}

export type CanvasFormat =
  | 'a4-portrait'
  | 'a4-landscape'
  | 'a3-portrait'
  | 'a3-landscape'
  | 'instagram-square'
  | 'instagram-story'
  | 'custom';

// Projet
export interface Project {
  id: string;
  userName: string;
  projectName: string;
  layers: Layer[];
  canvasFormat: CanvasFormat;
  customWidth?: number;
  customHeight?: number;
  createdAt: number;
  lastModified: number;
}

// État de l'historique
export interface HistoryState {
  layers: Layer[];
  timestamp: number;
}

// Configuration de l'application
export interface AppConfig {
  canvasFormat: CanvasFormat;
  gridEnabled: boolean;
  rulersEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

// Événement de sélection
export interface SelectionEvent {
  shapeIds: string[];
  layerId: string;
}