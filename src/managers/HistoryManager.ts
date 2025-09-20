/**
 * Gestionnaire de l'historique (undo/redo)
 */

import { MAX_HISTORY } from "../config";
import type { HistoryState } from "../types";

export class HistoryManager {
  private layerManager: any;
  private history: HistoryState[] = [];
  private historyIndex: number = -1;

  constructor(layerManager: any) {
    this.layerManager = layerManager;
  }

  /**
   * Sauvegarde l'état actuel
   */
  public save(): void {
    // Supprimer l'historique après l'index actuel
    this.history = this.history.slice(0, this.historyIndex + 1);

    // Créer un snapshot de l'état actuel
    const state: HistoryState = {
      layers: JSON.parse(JSON.stringify(this.layerManager.export())),
      timestamp: Date.now(),
    };

    this.history.push(state);

    // Limiter la taille de l'historique
    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  /**
   * Annule la dernière action
   */
  public undo(): boolean {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restore();
      return true;
    }
    return false;
  }

  /**
   * Rétablit l'action annulée
   */
  public redo(): boolean {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restore();
      return true;
    }
    return false;
  }

  /**
   * Restaure un état de l'historique
   */
  private restore(): void {
    const state = this.history[this.historyIndex];
    if (state) {
      this.layerManager.loadLayers(state.layers);
    }
  }

  /**
   * Efface l'historique
   */
  public clear(): void {
    this.history = [];
    this.historyIndex = -1;
  }

  /**
   * Vérifie si on peut annuler
   */
  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  /**
   * Vérifie si on peut rétablir
   */
  public canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }
}
