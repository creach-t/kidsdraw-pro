/**
 * Outil Plume - Dessin libre
 */

import type { Point } from "../types";
import { createShape } from "../utils/shapes";
import { BaseTool } from "./baseTool";

export class PenTool extends BaseTool {
  private isDrawing = false;
  private currentPoints: Point[] = [];

  getName(): string {
    return "pen";
  }

  setCursor(): void {
    const wrapper = document.getElementById("canvas-wrapper");
    if (wrapper) {
      wrapper.style.cursor = "crosshair";
    }
  }

  onMouseDown(e: MouseEvent, coords: { x: number; y: number }): void {
    this.isDrawing = true;
    this.currentPoints = [];
    this.currentPoints.push({
      x: coords.x,
      y: coords.y,
      type: "anchor",
    });
  }

  onMouseMove(e: MouseEvent, coords: { x: number; y: number }): void {
    if (!this.isDrawing) return;

    const lastPoint = this.currentPoints[this.currentPoints.length - 1];
    const distance = Math.sqrt(
      Math.pow(coords.x - lastPoint.x, 2) + Math.pow(coords.y - lastPoint.y, 2)
    );

    // Ajouter un point si on a bougé suffisamment
    if (distance > 5) {
      this.currentPoints.push({
        x: coords.x,
        y: coords.y,
        type: "anchor",
      });

      // Prévisualisation optionnelle
      this.drawPreview();
    }
  }

  onMouseUp(e: MouseEvent, coords: { x: number; y: number }): void {
    if (!this.isDrawing || this.currentPoints.length < 2) {
      this.isDrawing = false;
      return;
    }

    // Créer une forme de type "path"
    const shape = createShape("path", 0, 0, 100);
    shape.points = this.currentPoints;
    shape.fill.type = "none"; // Pas de remplissage pour un trait
    shape.stroke.color = this.app.currentStrokeColor;
    shape.stroke.width = this.app.currentStrokeWidth;

    this.app.layerManager.addShape(shape);
    this.app.historyManager.save();
    this.app.render();

    this.isDrawing = false;
    this.currentPoints = [];
  }

  private drawPreview(): void {
    // TODO: Dessiner une prévisualisation temporaire du trait
  }
}
