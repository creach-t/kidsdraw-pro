/**
 * Outil Zoom - Zoomer/dézoomer en cliquant
 */

import { BaseTool } from './BaseTool';

export class ZoomTool extends BaseTool {

  getName(): string {
    return 'zoom';
  }

  setCursor(): void {
    const wrapper = document.getElementById('canvas-wrapper');
    if (wrapper) {
      wrapper.style.cursor = 'zoom-in';
    }
  }

  onMouseDown(e: MouseEvent, coords: { x: number; y: number }): void {
    // Zoom in avec clic gauche, zoom out avec Shift + clic
    if (e.shiftKey) {
      this.app.zoomOut();
    } else {
      this.app.zoomIn();
    }
  }

  onMouseMove(e: MouseEvent, coords: { x: number; y: number }): void {
    // Changer le curseur selon si Shift est pressé
    const wrapper = document.getElementById('canvas-wrapper');
    if (wrapper) {
      wrapper.style.cursor = e.shiftKey ? 'zoom-out' : 'zoom-in';
    }
  }

  onMouseUp(e: MouseEvent, coords: { x: number; y: number }): void {
    // Rien à faire
  }
}