/**
 * Gestionnaire des outils
 * Gère les outils disponibles et délègue les événements au bon outil
 */

import { BaseTool } from "../tools/";
import { EraserTool } from "../tools/EraserTool";
import { HandTool } from "../tools/HandTool";
import { PenTool } from "../tools/PenTool";
import { SelectTool } from "../tools/SelectTool";
import { ZoomTool } from "../tools/ZoomTool";
import type { Tool } from "../types";

export class ToolManager {
  private app: any;
  private tools: Map<Tool, BaseTool> = new Map();
  private activeTool: BaseTool | null = null;

  constructor(app: any) {
    this.app = app;
    this.initializeTools();
  }

  private initializeTools(): void {
    // Enregistrer tous les outils
    this.tools.set("pen", new PenTool(this.app));
    this.tools.set("select", new SelectTool(this.app));
    this.tools.set("hand", new HandTool(this.app));
    this.tools.set("zoom", new ZoomTool(this.app));
    this.tools.set("eraser", new EraserTool(this.app));

    // Activer l'outil sélection par défaut
    this.setActiveTool("select");
  }

  /**
   * Délègue mousedown au tool actif
   */
  public handleMouseDown(
    e: MouseEvent,
    coords: { x: number; y: number }
  ): void {
    if (this.activeTool) {
      this.activeTool.onMouseDown(e, coords);
    }
  }

  /**
   * Délègue mousemove au tool actif
   */
  public handleMouseMove(
    e: MouseEvent,
    coords: { x: number; y: number }
  ): void {
    if (this.activeTool) {
      this.activeTool.onMouseMove(e, coords);
    }
  }

  /**
   * Délègue mouseup au tool actif
   */
  public handleMouseUp(e: MouseEvent, coords: { x: number; y: number }): void {
    if (this.activeTool) {
      this.activeTool.onMouseUp(e, coords);
    }
  }

  /**
   * Change l'outil actif
   */
  public setActiveTool(toolName: Tool): void {
    // Désactiver l'outil actuel
    if (this.activeTool) {
      this.activeTool.deactivate();
    }

    // Activer le nouvel outil
    const tool = this.tools.get(toolName);
    if (tool) {
      this.activeTool = tool;
      this.activeTool.activate();
    }
  }

  /**
   * Récupère l'outil actif
   */
  public getActiveTool(): BaseTool | null {
    return this.activeTool;
  }

  /**
   * Récupère un outil par son nom
   */
  public getTool(toolName: Tool): BaseTool | undefined {
    return this.tools.get(toolName);
  }

  /**
   * Récupère tous les outils
   */
  public getAllTools(): Map<Tool, BaseTool> {
    return this.tools;
  }
}
