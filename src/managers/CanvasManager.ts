/**
 * Gestionnaire du canvas SVG
 */

import { SVG, Svg, Element as SVGElement } from '@svgdotjs/svg.js';
import type { CanvasFormat, Layer, Shape } from '../types';
import { CANVAS_FORMATS, MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '../config';

export class CanvasManager {
  private canvas: Svg;
  private currentFormat: CanvasFormat = 'a4-portrait';
  private zoom: number = 1;
  private panX: number = 0;
  private panY: number = 0;
  private gridEnabled: boolean = false;
  private rulersEnabled: boolean = false;
  
  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    
    const format = CANVAS_FORMATS[this.currentFormat];
    this.canvas = SVG().addTo(container).size(format.width, format.height);
    
    // Configurer le canvas
    this.canvas.attr({
      'xmlns': 'http://www.w3.org/2000/svg',
      'version': '1.1'
    });
  }
  
  /**
   * Définit le format du canvas
   */
  setFormat(format: CanvasFormat): void {
    this.currentFormat = format;
    const config = CANVAS_FORMATS[format];
    this.canvas.size(config.width, config.height);
    this.fitToScreen();
  }
  
  /**
   * Définit une taille personnalisée
   */
  setCustomSize(width: number, height: number): void {
    this.currentFormat = 'custom';
    this.canvas.size(width, height);
    this.fitToScreen();
  }
  
  /**
   * Définit le niveau de zoom
   */
  setZoom(level: number): void {
    this.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
    this.applyTransform();
  }
  
  /**
   * Zoom avant
   */
  zoomIn(): void {
    this.setZoom(this.zoom + ZOOM_STEP);
  }
  
  /**
   * Zoom arrière
   */
  zoomOut(): void {
    this.setZoom(this.zoom - ZOOM_STEP);
  }
  
  /**
   * Réinitialise le zoom à 100%
   */
  resetZoom(): void {
    this.setZoom(1);
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  }
  
  /**
   * Panoramique
   */
  pan(dx: number, dy: number): void {
    this.panX += dx;
    this.panY += dy;
    this.applyTransform();
  }
  
  /**
   * Ajuste le canvas à la fenêtre
   */
  fitToScreen(): void {
    const container = this.canvas.node.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const canvasWidth = this.canvas.width() as number;
    const canvasHeight = this.canvas.height() as number;
    
    const scaleX = (containerWidth - 100) / canvasWidth;
    const scaleY = (containerHeight - 100) / canvasHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    this.setZoom(scale);
    this.panX = 0;
    this.panY = 0;
  }
  
  /**
   * Applique la transformation (zoom + pan)
   */
  private applyTransform(): void {
    this.canvas.attr({
      transform: `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`
    });
  }
  
  /**
   * Efface le canvas
   */
  clear(): void {
    this.canvas.clear();
  }
  
  /**
   * Dessine un calque
   */
  drawLayer(layer: Layer): void {
    if (!layer.visible) return;
    
    const group = this.canvas.group().attr({
      id: `layer-${layer.id}`,
      opacity: layer.opacity / 100
    });
    
    for (const shape of layer.shapes) {
      this.drawShape(shape, group);
    }
  }
  
  /**
   * Dessine une forme
   */
  private drawShape(shape: Shape, container: SVGElement): void {
    let element: SVGElement | null = null;
    
    switch (shape.type) {
      case 'circle':
        if (shape.points.length >= 2) {
          const center = shape.points[0];
          const radiusPoint = shape.points[1];
          element = container.circle(radiusPoint.x * 2)
            .center(center.x, center.y);
        }
        break;
        
      case 'square':
      case 'rectangle':
        if (shape.points.length >= 2) {
          const x = Math.min(shape.points[0].x, shape.points[2].x);
          const y = Math.min(shape.points[0].y, shape.points[2].y);
          const width = Math.abs(shape.points[2].x - shape.points[0].x);
          const height = Math.abs(shape.points[2].y - shape.points[0].y);
          element = container.rect(width, height).move(x, y);
        }
        break;
        
      case 'triangle':
      case 'star':
      case 'heart':
      case 'polygon':
        const points = shape.points
          .filter(p => p.type === 'anchor')
          .map(p => [p.x, p.y]);
        element = container.polygon(points);
        break;
        
      case 'line':
        if (shape.points.length >= 2) {
          element = container.line(
            shape.points[0].x,
            shape.points[0].y,
            shape.points[1].x,
            shape.points[1].y
          );
        }
        break;
    }
    
    if (!element) return;
    
    // Appliquer les styles
    element.attr({ id: `shape-${shape.id}` });
    
    // Remplissage
    if (shape.fill.type === 'solid' && shape.fill.color) {
      element.fill(shape.fill.color);
    } else if (shape.fill.gradient) {
      // TODO: Implémenter les dégradés
      element.fill(shape.fill.gradient.stops[0]?.color || '#000');
    }
    
    // Contour
    element.stroke({
      width: shape.stroke.width,
      color: shape.stroke.color,
      dasharray: shape.stroke.dashArray
    });
    
    // Transformation
    element.transform({
      rotate: shape.transform.rotation,
      scale: [shape.transform.scaleX, shape.transform.scaleY]
    });
    
    // Ombre
    if (shape.shadow) {
      // TODO: Implémenter les ombres avec filtres SVG
    }
  }
  
  /**
   * Rend tous les calques
   */
  render(layers: Layer[]): void {
    this.clear();
    
    // Dessiner dans l'ordre inverse (du bas vers le haut)
    const sortedLayers = [...layers].sort((a, b) => a.order - b.order);
    
    for (const layer of sortedLayers) {
      this.drawLayer(layer);
    }
  }
  
  /**
   * Exporte le canvas en SVG
   */
  exportSVG(): string {
    return this.canvas.svg();
  }
  
  /**
   * Exporte le canvas en PNG
   */
  async exportPNG(): Promise<Blob> {
    const svgData = this.exportSVG();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = this.canvas.width() as number;
        canvas.height = this.canvas.height() as number;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not create blob'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not load image'));
      };
      
      img.src = url;
    });
  }
  
  /**
   * Active/désactive la grille
   */
  toggleGrid(): void {
    this.gridEnabled = !this.gridEnabled;
    // TODO: Implémenter l'affichage de la grille
  }
  
  /**
   * Active/désactive les règles
   */
  toggleRulers(): void {
    this.rulersEnabled = !this.rulersEnabled;
    // TODO: Implémenter l'affichage des règles
  }
  
  /**
   * Récupère le niveau de zoom actuel
   */
  getZoom(): number {
    return this.zoom;
  }
  
  /**
   * Récupère la position du pan
   */
  getPan(): { x: number; y: number } {
    return { x: this.panX, y: this.panY };
  }
  
  /**
   * Récupère le format actuel
   */
  getCurrentFormat(): CanvasFormat {
    return this.currentFormat;
  }
  
  /**
   * Récupère les dimensions du canvas
   */
  getDimensions(): { width: number; height: number } {
    return {
      width: this.canvas.width() as number,
      height: this.canvas.height() as number
    };
  }
  
  /**
   * Convertit des coordonnées écran en coordonnées canvas
   */
  screenToCanvas(screenX: number, screenY: number): { x: number; y: number } {
    const point = this.canvas.node.createSVGPoint();
    point.x = screenX;
    point.y = screenY;
    
    const ctm = this.canvas.node.getScreenCTM();
    if (!ctm) return { x: screenX, y: screenY };
    
    const transformed = point.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }
  
  /**
   * Récupère l'instance SVG.js
   */
  getCanvas(): Svg {
    return this.canvas;
  }
}
