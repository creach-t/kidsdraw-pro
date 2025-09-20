/**
 * Types et interfaces pour KidsDraw Pro
 */

export type ShapeType = 'circle' | 'square' | 'rectangle' | 'triangle' | 'star' | 'heart' | 'polygon' | 'line';

export type CanvasFormat = 
  | 'a4-portrait' 
  | 'a4-landscape' 
  | 'a3-portrait' 
  | 'a3-landscape' 
  | 'instagram-square' 
  | 'story' 
  | 'custom';

/**
 * Point dans l'espace 2D avec support des courbes de Bézier
 */
export interface Point {
  x: number;
  y: number;
  type: 'anchor' | 'control';
  cp1?: { x: number; y: number }; // Point de contrôle 1 pour courbes de Bézier
  cp2?: { x: number; y: number }; // Point de contrôle 2 pour courbes de Bézier
}

/**
 * Arrêt de couleur dans un dégradé
 */
export interface GradientStop {
  offset: number; // 0-1
  color: string;
}

/**
 * Configuration d'un dégradé
 */
export interface Gradient {
  stops: GradientStop[];
  angle?: number; // Angle pour dégradé linéaire (en degrés)
  cx?: number; // Centre X pour dégradé radial (0-1)
  cy?: number; // Centre Y pour dégradé radial (0-1)
}

/**
 * Configuration de remplissage
 */
export interface Fill {
  type: 'solid' | 'linear' | 'radial';
  color?: string;
  gradient?: Gradient;
}

/**
 * Configuration de contour
 */
export interface Stroke {
  width: number;
  color: string;
  dashArray?: string; // Ex: "5,5" pour tirets
}

/**
 * Configuration d'ombre portée
 */
export interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

/**
 * Transformation 2D
 */
export interface Transform {
  x: number;
  y: number;
  rotation: number; // En degrés
  scaleX: number;
  scaleY: number;
}

/**
 * Forme vectorielle
 */
export interface Shape {
  id: string;
  type: ShapeType;
  points: Point[];
  fill: Fill;
  stroke: Stroke;
  transform: Transform;
  shadow?: Shadow;
}

/**
 * Calque
 */
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0-100
  shapes: Shape[];
  order: number;
}

/**
 * Projet complet
 */
export interface Project {
  id: string;
  userName: string;
  projectName: string;
  svgContent: string;
  thumbnail: string; // Base64
  layers: Layer[];
  canvasFormat: CanvasFormat;
  lastModified: number;
  createdAt: number;
}

/**
 * Configuration d'un format de canvas
 */
export interface CanvasFormatConfig {
  width: number;
  height: number;
  label: string;
}

/**
 * Historique pour undo/redo
 */
export interface HistoryState {
  layers: Layer[];
  timestamp: number;
}

/**
 * Outil de dessin
 */
export type Tool = 'select' | 'point-edit' | 'eraser' | 'hand' | 'zoom' | 'line' | 'text' | 'brush' | 'eyedropper';

/**
 * État de l'application
 */
export interface AppState {
  currentProject: Project | null;
  activeTool: Tool;
  activeLayerId: string | null;
  selectedShapeIds: string[];
  zoom: number;
  panX: number;
  panY: number;
}
