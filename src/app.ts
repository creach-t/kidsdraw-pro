/**
 * Application principale KidsDraw Pro - Architecture modulaire
 */

import { AUTOSAVE_INTERVAL, MESSAGES } from "./config";
import { CanvasManager } from "./managers/CanvasManager";
import { EventManager } from "./managers/EventManager";
import { HistoryManager } from "./managers/HistoryManager";
import { LayerManager } from "./managers/LayerManager";
import { ShortcutManager } from "./managers/ShortcutManager";
import { StorageManager } from "./managers/StorageManager";
import { ToolManager } from "./managers/ToolManager";
import { UIManager } from "./managers/UIManager";
import "./styles.css";
import type { CanvasFormat, Project, ShapeType, Tool } from "./types";
import { createShape } from "./utils/shapes";

class App {
  // Managers
  public layerManager: LayerManager;
  public canvasManager: CanvasManager;
  public storageManager: StorageManager;
  public shortcutManager: ShortcutManager;
  public uiManager: UIManager;
  public eventManager: EventManager;
  public historyManager: HistoryManager;
  public toolManager: ToolManager;

  // État
  public currentProject: Project | null = null;
  public activeTool: Tool = "select";
  public currentFillColor: string = "#FF6B6B";
  public currentStrokeColor: string = "#000000";
  public currentStrokeWidth: number = 2;
  private autoSaveInterval: number | null = null;

  constructor() {
    // Initialiser les managers
    this.layerManager = new LayerManager();
    this.canvasManager = new CanvasManager("canvas");
    this.storageManager = new StorageManager();
    this.shortcutManager = new ShortcutManager();
    this.historyManager = new HistoryManager(this.layerManager);
    this.toolManager = new ToolManager(this);
    this.eventManager = new EventManager(this);
    this.uiManager = new UIManager(this);

    this.initialize();
  }

  private initialize(): void {
    this.uiManager.initialize();
    this.eventManager.initialize();
    this.shortcutManager.registerAppShortcuts(this.getShortcutHandlers());
    this.uiManager.showWelcomeScreen();
  }

  // ============ PROJECT METHODS ============

  public createNewProject(
    userName: string,
    projectName: string,
    format: CanvasFormat = "a4-portrait"
  ): void {
    this.currentProject = {
      id: Date.now().toString(),
      userName,
      projectName,
      layers: this.layerManager.export(),
      canvasFormat: format,
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    this.layerManager.reset();
    this.historyManager.clear();
    this.canvasManager.setFormat(format);

    // Sauvegarder immédiatement le nouveau projet
    this.saveProject();

    this.uiManager.showEditor();
    this.render();
    this.startAutoSave();
    this.uiManager.showToast(MESSAGES.PROJECT_CREATED);
  }

  public loadProject(id: string): void {
    const project = this.storageManager.getProject(id);
    if (!project) {
      this.uiManager.showToast("❌ Projet introuvable");
      return;
    }

    this.currentProject = project;
    this.layerManager.loadLayers(project.layers);
    this.canvasManager.setFormat(project.canvasFormat);
    this.historyManager.clear();
    this.historyManager.save();

    this.uiManager.showEditor();
    this.render();
    this.startAutoSave();
  }

  public saveProject(): void {
    if (!this.currentProject) return;

    try {
      this.currentProject.layers = this.layerManager.export();
      this.currentProject.lastModified = Date.now();

      this.storageManager.saveProject(this.currentProject);
      this.uiManager.showToast(MESSAGES.SAVED);
    } catch (error) {
      console.error("Error saving project:", error);
      this.uiManager.showToast("❌ Erreur lors de la sauvegarde");
    }
  }

  public exportProject(): void {
    if (!this.currentProject) return;

    const svg = this.canvasManager.exportSVG();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${this.currentProject.projectName}.svg`;
    a.click();
    URL.revokeObjectURL(url);

    this.uiManager.showToast(MESSAGES.EXPORTED);
  }

  public deleteProject(id: string): void {
    if (!confirm("Supprimer ce projet ?")) return;

    this.storageManager.deleteProject(id);
    this.uiManager.renderProjectsGallery();
    this.uiManager.showToast(MESSAGES.PROJECT_DELETED);
  }

  // ============ SHAPE METHODS ============

  public addShape(type: ShapeType): void {
    const dims = this.canvasManager.getDimensions();
    const shape = createShape(type, dims.width / 2, dims.height / 2, 100);

    shape.fill.color = this.currentFillColor;
    shape.stroke.color = this.currentStrokeColor;
    shape.stroke.width = this.currentStrokeWidth;

    this.layerManager.addShape(shape);
    this.historyManager.save();
    this.render();
  }

  // ============ LAYER METHODS ============

  public createLayer(): void {
    try {
      this.layerManager.createLayer();
      this.render();
      this.uiManager.showToast(MESSAGES.LAYER_CREATED);
    } catch (error) {
      this.uiManager.showToast(MESSAGES.MAX_LAYERS);
    }
  }

  public deleteLayer(id: string): void {
    if (!confirm("Supprimer ce calque ?")) return;

    if (this.layerManager.deleteLayer(id)) {
      this.historyManager.save();
      this.render();
      this.uiManager.showToast(MESSAGES.LAYER_DELETED);
    }
  }

  public duplicateLayer(): void {
    const activeLayer = this.layerManager.getActiveLayer();
    if (!activeLayer) return;

    try {
      this.layerManager.duplicateLayer(activeLayer.id);
      this.historyManager.save();
      this.render();
    } catch (error) {
      this.uiManager.showToast(MESSAGES.MAX_LAYERS);
    }
  }

  public toggleLayerVisibility(id: string): void {
    this.layerManager.toggleVisibility(id);
    this.render();
  }

  public toggleLayerLock(id: string): void {
    this.layerManager.toggleLock(id);
    this.render();
  }

  public setLayerOpacity(id: string, opacity: number): void {
    this.layerManager.setOpacity(id, opacity);
    this.render();
  }

  // ============ TOOL METHODS ============

  public setActiveTool(tool: Tool): void {
    this.activeTool = tool;
    this.toolManager.setActiveTool(tool);
    this.uiManager.renderTools();
  }

  public setFillColor(color: string): void {
    this.currentFillColor = color;
  }

  public setStrokeColor(color: string): void {
    this.currentStrokeColor = color;
  }

  public setStrokeWidth(width: number): void {
    this.currentStrokeWidth = width;
  }

  // ============ HISTORY METHODS ============

  public undo(): void {
    if (this.historyManager.undo()) {
      this.render();
    }
  }

  public redo(): void {
    if (this.historyManager.redo()) {
      this.render();
    }
  }

  // ============ VIEW METHODS ============

  public render(): void {
    const layers = this.layerManager.getAllLayers();
    this.canvasManager.render(layers);
    this.uiManager.renderLayers();
  }

  public zoomIn(): void {
    this.canvasManager.zoomIn();
    this.uiManager.updateZoomLevel();
  }

  public zoomOut(): void {
    this.canvasManager.zoomOut();
    this.uiManager.updateZoomLevel();
  }

  public zoomFit(): void {
    this.canvasManager.fitToScreen();
    this.uiManager.updateZoomLevel();
  }

  public zoomReset(): void {
    this.canvasManager.resetZoom();
    this.uiManager.updateZoomLevel();
  }

  // ============ AUTO-SAVE ============

  private startAutoSave(): void {
    this.stopAutoSave();
    this.autoSaveInterval = window.setInterval(() => {
      this.saveProject();
    }, AUTOSAVE_INTERVAL);
  }

  private stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // ============ SHORTCUTS HANDLERS ============

  private getShortcutHandlers() {
    return {
      // Fichier
      save: () => this.saveProject(),
      export: () => this.exportProject(),
      newProject: () => this.uiManager.showNewProjectModal(),

      // Édition
      undo: () => this.undo(),
      redo: () => this.redo(),
      delete: () => console.log("Delete selected"),
      duplicate: () => console.log("Duplicate"),
      copy: () => console.log("Copy"),
      paste: () => console.log("Paste"),
      cut: () => console.log("Cut"),
      selectAll: () => console.log("Select all"),
      deselect: () => console.log("Deselect"),

      // Outils
      selectTool: () => this.setActiveTool("select"),
      pointEditTool: () => this.setActiveTool("edit-points"),
      eraserTool: () => this.setActiveTool("eraser"),
      handTool: () => this.setActiveTool("hand"),
      zoomTool: () => this.setActiveTool("zoom"),
      textTool: () => this.setActiveTool("text"),
      brushTool: () => this.setActiveTool("brush"),
      eyedropperTool: () => this.setActiveTool("eyedropper"),

      // Calques
      newLayer: () => this.createLayer(),
      duplicateLayer: () => this.duplicateLayer(),
      layerUp: () => {
        this.layerManager.moveActiveLayerUp();
        this.render();
      },
      layerDown: () => {
        this.layerManager.moveActiveLayerDown();
        this.render();
      },

      // Vue
      zoomIn: () => this.zoomIn(),
      zoomOut: () => this.zoomOut(),
      zoomReset: () => this.zoomReset(),
      fitToScreen: () => this.zoomFit(),

      // Transformations
      rotateLeft: () => console.log("Rotate left"),
      rotateRight: () => console.log("Rotate right"),
      scaleUp: () => console.log("Scale up"),
      scaleDown: () => console.log("Scale down"),

      // Déplacement
      moveUp: () => console.log("Move up"),
      moveDown: () => console.log("Move down"),
      moveLeft: () => console.log("Move left"),
      moveRight: () => console.log("Move right"),

      // Groupement
      group: () => console.log("Group"),
      ungroup: () => console.log("Ungroup"),
    };
  }
}

// Initialiser l'application
const app = new App();
(window as any).app = app;
