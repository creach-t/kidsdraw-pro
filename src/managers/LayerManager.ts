/**
 * Gestionnaire des calques
 */

import type { Layer, Shape } from '../types';
import { nanoid } from 'nanoid';
import { DEFAULT_LAYER_NAME, MAX_LAYERS } from '../config';

export class LayerManager {
  private layers: Layer[] = [];
  private activeLayerId: string | null = null;
  private layerCounter = 1;
  
  constructor() {
    // Créer le premier calque par défaut
    this.createLayer();
  }
  
  /**
   * Crée un nouveau calque
   */
  createLayer(name?: string): Layer {
    if (this.layers.length >= MAX_LAYERS) {
      throw new Error(`Maximum de ${MAX_LAYERS} calques atteint`);
    }
    
    const layer: Layer = {
      id: nanoid(),
      name: name || `${DEFAULT_LAYER_NAME} ${this.layerCounter++}`,
      visible: true,
      locked: false,
      opacity: 100,
      shapes: [],
      order: this.layers.length
    };
    
    this.layers.push(layer);
    this.activeLayerId = layer.id;
    
    return layer;
  }
  
  /**
   * Supprime un calque
   */
  deleteLayer(id: string): boolean {
    const index = this.layers.findIndex(l => l.id === id);
    
    if (index === -1 || this.layers.length === 1) {
      return false; // Ne pas supprimer le dernier calque
    }
    
    this.layers.splice(index, 1);
    
    // Mettre à jour les ordres
    this.layers.forEach((layer, i) => {
      layer.order = i;
    });
    
    // Si c'était le calque actif, sélectionner le précédent
    if (this.activeLayerId === id) {
      const newIndex = Math.max(0, index - 1);
      this.activeLayerId = this.layers[newIndex]?.id || null;
    }
    
    return true;
  }
  
  /**
   * Duplique un calque
   */
  duplicateLayer(id: string): Layer | null {
    if (this.layers.length >= MAX_LAYERS) {
      throw new Error(`Maximum de ${MAX_LAYERS} calques atteint`);
    }
    
    const layer = this.getLayer(id);
    if (!layer) return null;
    
    const duplicated: Layer = {
      id: nanoid(),
      name: `${layer.name} copie`,
      visible: layer.visible,
      locked: false,
      opacity: layer.opacity,
      shapes: layer.shapes.map(shape => ({
        ...shape,
        id: nanoid()
      })),
      order: this.layers.length
    };
    
    this.layers.push(duplicated);
    this.activeLayerId = duplicated.id;
    
    return duplicated;
  }
  
  /**
   * Réorganise les calques
   */
  reorderLayers(fromIndex: number, toIndex: number): void {
    if (fromIndex < 0 || fromIndex >= this.layers.length ||
        toIndex < 0 || toIndex >= this.layers.length) {
      return;
    }
    
    const [moved] = this.layers.splice(fromIndex, 1);
    this.layers.splice(toIndex, 0, moved);
    
    // Mettre à jour les ordres
    this.layers.forEach((layer, i) => {
      layer.order = i;
    });
  }
  
  /**
   * Active/désactive la visibilité d'un calque
   */
  toggleVisibility(id: string): boolean {
    const layer = this.getLayer(id);
    if (!layer) return false;
    
    layer.visible = !layer.visible;
    return layer.visible;
  }
  
  /**
   * Verrouille/déverrouille un calque
   */
  toggleLock(id: string): boolean {
    const layer = this.getLayer(id);
    if (!layer) return false;
    
    layer.locked = !layer.locked;
    return layer.locked;
  }
  
  /**
   * Définit l'opacité d'un calque
   */
  setOpacity(id: string, opacity: number): void {
    const layer = this.getLayer(id);
    if (!layer) return;
    
    layer.opacity = Math.max(0, Math.min(100, opacity));
  }
  
  /**
   * Renomme un calque
   */
  renameLayer(id: string, name: string): void {
    const layer = this.getLayer(id);
    if (!layer) return;
    
    layer.name = name.trim() || DEFAULT_LAYER_NAME;
  }
  
  /**
   * Ajoute une forme au calque actif
   */
  addShape(shape: Shape, layerId?: string): void {
    const targetLayerId = layerId || this.activeLayerId;
    const layer = this.getLayer(targetLayerId || '');
    
    if (!layer || layer.locked) return;
    
    layer.shapes.push(shape);
  }
  
  /**
   * Supprime une forme
   */
  removeShape(shapeId: string): boolean {
    for (const layer of this.layers) {
      const index = layer.shapes.findIndex(s => s.id === shapeId);
      if (index !== -1) {
        layer.shapes.splice(index, 1);
        return true;
      }
    }
    return false;
  }
  
  /**
   * Récupère une forme par son ID
   */
  getShape(shapeId: string): Shape | null {
    for (const layer of this.layers) {
      const shape = layer.shapes.find(s => s.id === shapeId);
      if (shape) return shape;
    }
    return null;
  }
  
  /**
   * Met à jour une forme
   */
  updateShape(shapeId: string, updates: Partial<Shape>): boolean {
    for (const layer of this.layers) {
      if (layer.locked) continue;
      
      const shapeIndex = layer.shapes.findIndex(s => s.id === shapeId);
      if (shapeIndex !== -1) {
        layer.shapes[shapeIndex] = {
          ...layer.shapes[shapeIndex],
          ...updates
        };
        return true;
      }
    }
    return false;
  }
  
  /**
   * Déplace une forme vers un autre calque
   */
  moveShapeToLayer(shapeId: string, targetLayerId: string): boolean {
    const targetLayer = this.getLayer(targetLayerId);
    if (!targetLayer || targetLayer.locked) return false;
    
    let shape: Shape | null = null;
    
    for (const layer of this.layers) {
      const index = layer.shapes.findIndex(s => s.id === shapeId);
      if (index !== -1) {
        shape = layer.shapes[index];
        layer.shapes.splice(index, 1);
        break;
      }
    }
    
    if (shape) {
      targetLayer.shapes.push(shape);
      return true;
    }
    
    return false;
  }
  
  /**
   * Récupère le calque actif
   */
  getActiveLayer(): Layer | null {
    if (!this.activeLayerId) return null;
    return this.getLayer(this.activeLayerId);
  }
  
  /**
   * Définit le calque actif
   */
  setActiveLayer(id: string): boolean {
    if (this.getLayer(id)) {
      this.activeLayerId = id;
      return true;
    }
    return false;
  }
  
  /**
   * Récupère un calque par son ID
   */
  getLayer(id: string): Layer | null {
    return this.layers.find(l => l.id === id) || null;
  }
  
  /**
   * Récupère tous les calques
   */
  getAllLayers(): Layer[] {
    return [...this.layers].sort((a, b) => b.order - a.order); // Du haut vers le bas
  }
  
  /**
   * Récupère toutes les formes visibles
   */
  getAllVisibleShapes(): Shape[] {
    const shapes: Shape[] = [];
    
    for (const layer of this.layers) {
      if (layer.visible) {
        shapes.push(...layer.shapes);
      }
    }
    
    return shapes;
  }
  
  /**
   * Charge des calques depuis des données
   */
  loadLayers(layers: Layer[]): void {
    this.layers = layers.map(layer => ({ ...layer }));
    this.activeLayerId = this.layers[0]?.id || null;
    
    // Mettre à jour le compteur
    const maxNum = Math.max(...this.layers.map(l => {
      const match = l.name.match(/Calque (\d+)/);
      return match ? parseInt(match[1]) : 0;
    }));
    this.layerCounter = maxNum + 1;
  }
  
  /**
   * Réinitialise le gestionnaire
   */
  reset(): void {
    this.layers = [];
    this.activeLayerId = null;
    this.layerCounter = 1;
    this.createLayer();
  }
  
  /**
   * Déplace le calque actif vers le haut
   */
  moveActiveLayerUp(): boolean {
    if (!this.activeLayerId) return false;
    
    const index = this.layers.findIndex(l => l.id === this.activeLayerId);
    if (index > 0) {
      this.reorderLayers(index, index - 1);
      return true;
    }
    return false;
  }
  
  /**
   * Déplace le calque actif vers le bas
   */
  moveActiveLayerDown(): boolean {
    if (!this.activeLayerId) return false;
    
    const index = this.layers.findIndex(l => l.id === this.activeLayerId);
    if (index < this.layers.length - 1) {
      this.reorderLayers(index, index + 1);
      return true;
    }
    return false;
  }
  
  /**
   * Fusionne le calque actif avec celui du dessous
   */
  mergeActiveLayerDown(): boolean {
    if (!this.activeLayerId || this.layers.length < 2) return false;
    
    const index = this.layers.findIndex(l => l.id === this.activeLayerId);
    if (index < this.layers.length - 1) {
      const currentLayer = this.layers[index];
      const belowLayer = this.layers[index + 1];
      
      if (belowLayer.locked) return false;
      
      // Ajouter toutes les formes du calque actif au calque du dessous
      belowLayer.shapes.push(...currentLayer.shapes);
      
      // Supprimer le calque actif
      this.deleteLayer(this.activeLayerId);
      
      // Le calque du dessous devient actif
      this.activeLayerId = belowLayer.id;
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Exporte les calques pour sauvegarde
   */
  export(): Layer[] {
    return this.layers.map(layer => ({ ...layer }));
  }
}
