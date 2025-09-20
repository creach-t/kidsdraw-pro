/**
 * Outil Main - Déplacer la vue (pan)
 */

import { BaseTool } from "./baseTool";

export class HandTool extends BaseTool {
  private isDragging = false;
  private startX = 0;
  private startY = 0;

  getName(): string {
    return "hand";
  }

  setCursor(): void {
    const wrapper = document.getElementById("canvas-wrapper");
    if (wrapper) {
      wrapper.style.cursor = "grab";
    }
  }

  onMouseDown(e: MouseEvent, coords: { x: number; y: number }): void {
    this.isDragging = true;
    this.startX = coords.x;
    this.startY = coords.y;

    const wrapper = document.getElementById("canvas-wrapper");
    if (wrapper) {
      wrapper.style.cursor = "grabbing";
    }
  }

  onMouseMove(e: MouseEvent, coords: { x: number; y: number }): void {
    if (!this.isDragging) return;

    const dx = coords.x - this.startX;
    const dy = coords.y - this.startY;

    this.app.canvasManager.pan(dx, dy);

    this.startX = coords.x;
    this.startY = coords.y;
  }

  onMouseUp(e: MouseEvent, coords: { x: number; y: number }): void {
    this.isDragging = false;

    const wrapper = document.getElementById("canvas-wrapper");
    if (wrapper) {
      wrapper.style.cursor = "grab";
    }
  }
}
