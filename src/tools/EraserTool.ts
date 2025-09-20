/**
 * Outil Gomme - Effacer les formes
 */

import { BaseTool } from './BaseTool';

export class EraserTool extends BaseTool {

  getName(): string {
    return 'eraser';
  }

  setCursor(): void {
    const wrapper = document.getElementById('canvas-wrapper');
    if (wrapper) {
      wrapper.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\'><circle cx=\'10\' cy=\'10\' r=\'8\' fill=\'none\' stroke=\'black\' stroke-width=\'2\'/></svg>") 10 10, auto';
    }
  }

  onMouseDown(e: MouseEvent, coords: { x: number; y: number }): void {
    this.deleteShapeAtPosition(coords);
  }

  onMouseMove(e: MouseEvent, coords: { x: number; y: number }): void {
    // Continue d'effacer si le bouton est enfoncé
    if (e.buttons === 1) {
      this.deleteShapeAtPosition(coords);
    }
  }

  onMouseUp(e: MouseEvent, coords: { x: number; y: number }): void {
    // Rien à faire
  }

  private deleteShapeAtPosition(coords: { x: number; y: number }): void {
    // TODO: Détecter et supprimer la forme à cette position
    console.log('Eraser: trying to delete shape at', coords);

    // Placeholder: supprimer la dernière forme du calque actif
    const activeLayer = this.app.layerManager.getActiveLayer();
    if (activeLayer && activeLayer.shapes.length > 0) {
      const lastShape = activeLayer.shapes[activeLayer.shapes.length - 1];
      this.app.layerManager.removeShape(lastShape.id);
      this.app.historyManager.save();
      this.app.render();
    }
  }
}