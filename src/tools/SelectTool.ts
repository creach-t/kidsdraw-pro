/**
 * Outil Sélection - Sélectionner et déplacer les formes
 */

import { BaseTool } from './baseTool';

export class SelectTool extends BaseTool {
  private selectedShapeId: string | null = null;
  private isDragging = false;
  private startX = 0;
  private startY = 0;

  getName(): string {
    return 'select';
  }

  setCursor(): void {
    const wrapper = document.getElementById('canvas-wrapper');
    if (wrapper) {
      wrapper.style.cursor = 'default';
    }
  }

  onMouseDown(e: MouseEvent, coords: { x: number; y: number }): void {
    this.isDragging = true;
    this.startX = coords.x;
    this.startY = coords.y;

    // TODO: Détecter quelle forme est cliquée
    // Pour l'instant, juste un placeholder
    console.log('Select tool: mouse down at', coords);
  }

  onMouseMove(e: MouseEvent, coords: { x: number; y: number }): void {
    if (!this.isDragging) return;

    const dx = coords.x - this.startX;
    const dy = coords.y - this.startY;

    // TODO: Déplacer la forme sélectionnée
    if (this.selectedShapeId) {
      console.log('Moving shape', this.selectedShapeId, 'by', dx, dy);
    }
  }

  onMouseUp(e: MouseEvent, coords: { x: number; y: number }): void {
    this.isDragging = false;
  }
}