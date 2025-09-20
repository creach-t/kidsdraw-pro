/**
 * Utilitaires pour la génération et manipulation de formes
 */

import type { ShapeType, Point, Shape } from '../types';
import { DEFAULT_FILL, DEFAULT_STROKE, DEFAULT_TRANSFORM } from '../config';
import { nanoid } from 'nanoid';

/**
 * Génère les points pour un cercle
 */
export function generateCirclePoints(cx: number, cy: number, radius: number): Point[] {
  return [
    { x: cx, y: cy, type: 'anchor' },
    { x: radius, y: 0, type: 'control' }
  ];
}

/**
 * Génère les points pour un carré
 */
export function generateSquarePoints(x: number, y: number, size: number): Point[] {
  return [
    { x, y, type: 'anchor' },
    { x: x + size, y, type: 'anchor' },
    { x: x + size, y: y + size, type: 'anchor' },
    { x, y: y + size, type: 'anchor' }
  ];
}

/**
 * Génère les points pour un rectangle
 */
export function generateRectanglePoints(x: number, y: number, width: number, height: number): Point[] {
  return [
    { x, y, type: 'anchor' },
    { x: x + width, y, type: 'anchor' },
    { x: x + width, y: y + height, type: 'anchor' },
    { x, y: y + height, type: 'anchor' }
  ];
}

/**
 * Génère les points pour un triangle équilatéral
 */
export function generateTrianglePoints(x: number, y: number, size: number): Point[] {
  const height = (Math.sqrt(3) / 2) * size;
  return [
    { x: x + size / 2, y, type: 'anchor' },
    { x: x + size, y: y + height, type: 'anchor' },
    { x, y: y + height, type: 'anchor' }
  ];
}

/**
 * Génère les points pour une étoile à 5 branches
 */
export function generateStarPoints(cx: number, cy: number, outerRadius: number, innerRadius?: number): Point[] {
  const points: Point[] = [];
  const inner = innerRadius || outerRadius * 0.4;
  const numPoints = 5;
  
  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (i * Math.PI) / numPoints - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : inner;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      type: 'anchor'
    });
  }
  
  return points;
}

/**
 * Génère les points pour un cœur
 */
export function generateHeartPoints(cx: number, cy: number, size: number): Point[] {
  const points: Point[] = [];
  const scale = size / 100;
  
  // Utilise une courbe de Bézier pour créer un cœur
  return [
    { x: cx, y: cy + 30 * scale, type: 'anchor' },
    { 
      x: cx - 50 * scale, 
      y: cy - 20 * scale, 
      type: 'anchor',
      cp1: { x: cx - 20 * scale, y: cy - 40 * scale },
      cp2: { x: cx - 50 * scale, y: cy - 40 * scale }
    },
    { 
      x: cx, 
      y: cy - 50 * scale, 
      type: 'anchor',
      cp1: { x: cx - 50 * scale, y: cy - 50 * scale },
      cp2: { x: cx, y: cy - 50 * scale }
    },
    { 
      x: cx + 50 * scale, 
      y: cy - 20 * scale, 
      type: 'anchor',
      cp1: { x: cx + 50 * scale, y: cy - 50 * scale },
      cp2: { x: cx + 50 * scale, y: cy - 40 * scale }
    },
    { 
      x: cx, 
      y: cy + 30 * scale, 
      type: 'anchor',
      cp1: { x: cx + 20 * scale, y: cy - 40 * scale }
    }
  ];
}

/**
 * Génère les points pour un polygone régulier
 */
export function generatePolygonPoints(cx: number, cy: number, radius: number, sides: number = 6): Point[] {
  const points: Point[] = [];
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      type: 'anchor'
    });
  }
  
  return points;
}

/**
 * Génère les points pour une ligne
 */
export function generateLinePoints(x1: number, y1: number, x2: number, y2: number): Point[] {
  return [
    { x: x1, y: y1, type: 'anchor' },
    { x: x2, y: y2, type: 'anchor' }
  ];
}

/**
 * Crée une nouvelle forme
 */
export function createShape(
  type: ShapeType,
  x: number,
  y: number,
  size: number = 100
): Shape {
  let points: Point[];
  
  switch (type) {
    case 'circle':
      points = generateCirclePoints(x, y, size / 2);
      break;
    case 'square':
      points = generateSquarePoints(x - size / 2, y - size / 2, size);
      break;
    case 'rectangle':
      points = generateRectanglePoints(x - size / 2, y - size / 4, size, size / 2);
      break;
    case 'triangle':
      points = generateTrianglePoints(x - size / 2, y - size / 2, size);
      break;
    case 'star':
      points = generateStarPoints(x, y, size / 2);
      break;
    case 'heart':
      points = generateHeartPoints(x, y, size);
      break;
    case 'polygon':
      points = generatePolygonPoints(x, y, size / 2);
      break;
    case 'line':
      points = generateLinePoints(x - size / 2, y, x + size / 2, y);
      break;
    default:
      points = generateCirclePoints(x, y, size / 2);
  }
  
  return {
    id: nanoid(),
    type,
    points,
    fill: { ...DEFAULT_FILL },
    stroke: { ...DEFAULT_STROKE },
    transform: { ...DEFAULT_TRANSFORM }
  };
}

/**
 * Calcule le centre d'une forme
 */
export function getShapeCenter(shape: Shape): { x: number; y: number } {
  const points = shape.points.filter(p => p.type === 'anchor');
  
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }
  
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
}

/**
 * Calcule les limites (bounding box) d'une forme
 */
export function getShapeBounds(shape: Shape): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const points = shape.points.filter(p => p.type === 'anchor');
  
  if (points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Vérifie si un point est à l'intérieur d'une forme
 */
export function isPointInShape(shape: Shape, x: number, y: number, threshold: number = 5): boolean {
  const bounds = getShapeBounds(shape);
  
  // Vérification simple par bounding box + threshold
  return (
    x >= bounds.x - threshold &&
    x <= bounds.x + bounds.width + threshold &&
    y >= bounds.y - threshold &&
    y <= bounds.y + bounds.height + threshold
  );
}

/**
 * Clone une forme
 */
export function cloneShape(shape: Shape): Shape {
  return {
    ...shape,
    id: nanoid(),
    points: shape.points.map(p => ({ ...p })),
    fill: { ...shape.fill },
    stroke: { ...shape.stroke },
    transform: { ...shape.transform },
    shadow: shape.shadow ? { ...shape.shadow } : undefined
  };
}

/**
 * Transforme une forme (translation)
 */
export function translateShape(shape: Shape, dx: number, dy: number): Shape {
  return {
    ...shape,
    points: shape.points.map(p => ({
      ...p,
      x: p.x + dx,
      y: p.y + dy
    })),
    transform: {
      ...shape.transform,
      x: shape.transform.x + dx,
      y: shape.transform.y + dy
    }
  };
}

/**
 * Fait pivoter une forme autour de son centre
 */
export function rotateShape(shape: Shape, angle: number): Shape {
  const center = getShapeCenter(shape);
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  
  return {
    ...shape,
    points: shape.points.map(p => {
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      return {
        ...p,
        x: center.x + dx * cos - dy * sin,
        y: center.y + dx * sin + dy * cos
      };
    }),
    transform: {
      ...shape.transform,
      rotation: (shape.transform.rotation + angle) % 360
    }
  };
}

/**
 * Redimensionne une forme
 */
export function scaleShape(shape: Shape, scaleX: number, scaleY: number): Shape {
  const center = getShapeCenter(shape);
  
  return {
    ...shape,
    points: shape.points.map(p => ({
      ...p,
      x: center.x + (p.x - center.x) * scaleX,
      y: center.y + (p.y - center.y) * scaleY
    })),
    transform: {
      ...shape.transform,
      scaleX: shape.transform.scaleX * scaleX,
      scaleY: shape.transform.scaleY * scaleY
    }
  };
}
