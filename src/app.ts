/**
 * Application principale KidsDraw Pro
 */

import './styles.css';
import { LayerManager } from './managers/LayerManager';
import { CanvasManager } from './managers/CanvasManager';
import { StorageManager } from './managers/StorageManager';
import { ShortcutManager } from './managers/ShortcutManager';
import { createShape } from './utils/shapes';
import type { Project, Tool, ShapeType, HistoryState } from './types';
import { 
  CANVAS_FORMATS, 
  COLORS, 
  TOOLS, 
  SHAPES, 
  AUTOSAVE_INTERVAL,
  MAX_HISTORY,
  MESSAGES 
} from './config';

class App {
  // Managers
  private layerManager: LayerManager;
  private canvasManager: CanvasManager;
  private storageManager: StorageManager;
  private shortcutManager: ShortcutManager;
  
  // État
  private currentProject: Project | null = null;
  private activeTool: Tool = 'select';
  private selectedShapeIds: string[] = [];
  private history: HistoryState[] = [];
  private historyIndex: number = -1;
  private autoSaveInterval: number | null = null;
  
  // Éléments DOM
  private welcomeScreen: HTMLElement;
  private projectsGallery: HTMLElement;
  private editor: HTMLElement;
  private newProjectModal: HTMLElement;
  
  constructor() {
    // Initialiser les managers
    this.layerManager = new LayerManager();
    this.canvasManager = new CanvasManager('canvas');
    this.storageManager = new StorageManager();
    this.shortcutManager = new ShortcutManager();
    
    // Récupérer les éléments DOM
    this.welcomeScreen = this.getElement('welcome-screen');
    this.projectsGallery = this.getElement('projects-gallery');
    this.editor = this.getElement('editor');
    this.newProjectModal = this.getElement('new-project-modal');
    
    this.initialize();
  }
  
  /**
   * Initialise l'application
   */
  private initialize(): void {
    this.setupWelcomeScreen();
    this.setupProjectsGallery();
    this.setupEditor();
    this.setupShortcuts();
    
    // Afficher l'écran d'accueil
    this.showWelcomeScreen();
  }
  
  /**
   * Configure l'écran d'accueil
   */
  private setupWelcomeScreen(): void {
    const newProjectBtn = this.getElement('new-project');
    const loadProjectBtn = this.getElement('load-project');
    const importSvgBtn = this.getElement('import-svg');
    
    newProjectBtn.addEventListener('click', () => this.showNewProjectModal());
    loadProjectBtn.addEventListener('click', () => this.showProjectsGallery());
    importSvgBtn.addEventListener('click', () => this.handleImportSVG());
  }
  
  /**
   * Configure la galerie de projets
   */
  private setupProjectsGallery(): void {
    const backBtn = this.getElement('back-to-welcome');
    const searchInput = this.getElement('search') as HTMLInputElement;
    const sortSelect = this.getElement('sort') as HTMLSelectElement;
    
    backBtn.addEventListener('click', () => this.showWelcomeScreen());
    
    searchInput.addEventListener('input', () => this.renderProjectsGallery());
    sortSelect.addEventListener('change', () => this.renderProjectsGallery());
  }
  
  /**
   * Configure l'éditeur
   */
  private setupEditor(): void {
    // Boutons header
    this.getElement('save').addEventListener('click', () => this.saveProject());
    this.getElement('export').addEventListener('click', () => this.exportProject());
    this.getElement('back-to-gallery').addEventListener('click', () => this.showProjectsGallery());
    
    // Boutons canvas
    this.getElement('zoom-in').addEventListener('click', () => {
      this.canvasManager.zoomIn();
      this.updateZoomLevel();
    });
    
    this.getElement('zoom-out').addEventListener('click', () => {
      this.canvasManager.zoomOut();
      this.updateZoomLevel();
    });
    
    this.getElement('zoom-fit').addEventListener('click', () => {
      this.canvasManager.fitToScreen();
      this.updateZoomLevel();
    });
    
    // Bouton nouveau calque
    this.getElement('new-layer').addEventListener('click', () => this.createLayer());
    
    // Format selector
    const formatSelector = this.getElement('format-selector') as HTMLSelectElement;
    Object.entries(CANVAS_FORMATS).forEach(([key, value]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = value.label;
      formatSelector.appendChild(option);
    });
    
    formatSelector.addEventListener('change', (e) => {
      const format = (e.target as HTMLSelectElement).value as any;
      this.canvasManager.setFormat(format);
      this.render();
    });
    
    // Outils
    this.renderTools();
    this.renderShapes();
    this.renderColors();
  }
  
  /**
   * Configure les raccourcis clavier
   */
  private setupShortcuts(): void {
    this.shortcutManager.registerAppShortcuts({
      // Sélection
      selectAll: () => console.log('Select all'),
      nextShape: () => console.log('Next shape'),
      previousShape: () => console.log('Previous shape'),
      deselect: () => this.deselectAll(),
      
      // Édition
      undo: () => this.undo(),
      redo: () => this.redo(),
      copy: () => console.log('Copy'),
      cut: () => console.log('Cut'),
      paste: () => console.log('Paste'),
      duplicate: () => console.log('Duplicate'),
      delete: () => this.deleteSelected(),
      group: () => console.log('Group'),
      ungroup: () => console.log('Ungroup'),
      
      // Déplacement
      moveUp: () => console.log('Move up'),
      moveDown: () => console.log('Move down'),
      moveLeft: () => console.log('Move left'),
      moveRight: () => console.log('Move right'),
      moveUpFast: () => console.log('Move up fast'),
      moveDownFast: () => console.log('Move down fast'),
      moveLeftFast: () => console.log('Move left fast'),
      moveRightFast: () => console.log('Move right fast'),
      
      // Transformation
      rotateLeft: () => console.log('Rotate left'),
      rotateRight: () => console.log('Rotate right'),
      scaleDown: () => console.log('Scale down'),
      scaleUp: () => console.log('Scale up'),
      
      // Outils
      selectTool: () => this.setActiveTool('select'),
      pointEditTool: () => this.setActiveTool('point-edit'),
      eraserTool: () => this.setActiveTool('eraser'),
      handTool: () => this.setActiveTool('hand'),
      zoomTool: () => this.setActiveTool('zoom'),
      lineTool: () => this.setActiveTool('line'),
      textTool: () => this.setActiveTool('text'),
      brushTool: () => this.setActiveTool('brush'),
      eyedropperTool: () => this.setActiveTool('eyedropper'),
      
      // Calques
      newLayer: () => this.createLayer(),
      duplicateLayer: () => this.duplicateLayer(),
      layerUp: () => this.layerManager.moveActiveLayerUp(),
      layerDown: () => this.layerManager.moveActiveLayerDown(),
      
      // Fichier
      save: () => this.saveProject(),
      export: () => this.exportProject(),
      newProject: () => this.showNewProjectModal(),
      
      // Vue
      zoomReset: () => {
        this.canvasManager.resetZoom();
        this.updateZoomLevel();
      },
      zoomIn: () => {
        this.canvasManager.zoomIn();
        this.updateZoomLevel();
      },
      zoomOut: () => {
        this.canvasManager.zoomOut();
        this.updateZoomLevel();
      },
      fitToScreen: () => {
        this.canvasManager.fitToScreen();
        this.updateZoomLevel();
      }
    });
  }
  
  /**
   * Affiche l'écran d'accueil
   */
  private showWelcomeScreen(): void {
    this.welcomeScreen.classList.remove('hidden');
    this.projectsGallery.classList.add('hidden');
    this.editor.classList.add('hidden');
  }
  
  /**
   * Affiche le modal nouveau projet
   */
  private showNewProjectModal(): void {
    this.newProjectModal.classList.remove('hidden');
    
    const userNameInput = this.getElement('user-name') as HTMLInputElement;
    const projectNameInput = this.getElement('project-name') as HTMLInputElement;
    const startBtn = this.getElement('start-drawing');
    const cancelBtn = this.getElement('cancel-new-project');
    
    userNameInput.value = '';
    projectNameInput.value = '';
    userNameInput.focus();
    
    const handleStart = () => {
      const userName = userNameInput.value.trim();
      const projectName = projectNameInput.value.trim();
      
      if (!userName || !projectName) {
        this.showToast('Veuillez remplir tous les champs', 'error');
        return;
      }
      
      this.createNewProject(userName, projectName);
      this.newProjectModal.classList.add('hidden');
    };
    
    const handleCancel = () => {
      this.newProjectModal.classList.add('hidden');
    };
    
    startBtn.onclick = handleStart;
    cancelBtn.onclick = handleCancel;
  }
  
  /**
   * Affiche la galerie de projets
   */
  private showProjectsGallery(): void {
    this.welcomeScreen.classList.add('hidden');
    this.projectsGallery.classList.remove('hidden');
    this.editor.classList.add('hidden');
    
    this.renderProjectsGallery();
  }
  
  /**
   * Affiche l'éditeur
   */
  private showEditor(): void {
    this.welcomeScreen.classList.add('hidden');
    this.projectsGallery.classList.add('hidden');
    this.editor.classList.remove('hidden');
    
    this.startAutoSave();
    this.render();
  }
  
  /**
   * Crée un nouveau projet
   */
  private async createNewProject(userName: string, projectName: string): Promise<void> {
    try {
      this.currentProject = {
        id: '',
        userName,
        projectName,
        svgContent: '',
        thumbnail: '',
        layers: [],
        canvasFormat: 'a4-portrait',
        createdAt: Date.now(),
        lastModified: Date.now()
      };
      
      this.layerManager.reset();
      this.history = [];
      this.historyIndex = -1;
      
      await this.saveProject();
      this.showEditor();
      
      this.updateProjectTitle();
    } catch (error) {
      console.error('Error creating project:', error);
      this.showToast('Erreur lors de la création du projet', 'error');
    }
  }
  
  /**
   * Charge un projet
   */
  private async loadProject(projectId: string): Promise<void> {
    try {
      const project = this.storageManager.getProject(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      this.currentProject = project;
      this.layerManager.loadLayers(project.layers);
      this.canvasManager.setFormat(project.canvasFormat);
      
      this.history = [];
      this.historyIndex = -1;
      this.saveHistory();
      
      this.showEditor();
      this.updateProjectTitle();
    } catch (error) {
      console.error('Error loading project:', error);
      this.showToast('Erreur lors du chargement du projet', 'error');
    }
  }
  
  /**
   * Sauvegarde le projet
   */
  private async saveProject(): Promise<void> {
    if (!this.currentProject) return;
    
    try {
      const svgContent = this.canvasManager.exportSVG();
      const thumbnail = await this.storageManager.generateThumbnail(svgContent);
      
      const projectId = await this.storageManager.saveProject({
        ...this.currentProject,
        svgContent,
        thumbnail,
        layers: this.layerManager.export()
      });
      
      if (this.currentProject.id !== projectId) {
        this.currentProject.id = projectId;
      }
      
      this.showToast(MESSAGES.SAVED, 'success');
    } catch (error) {
      console.error('Error saving project:', error);
      this.showToast(MESSAGES.ERROR_SAVE, 'error');
    }
  }
  
  /**
   * Exporte le projet
   */
  private exportProject(): void {
    if (!this.currentProject) return;
    
    try {
      this.storageManager.exportSVG(this.currentProject);
      this.showToast(MESSAGES.EXPORTED, 'success');
    } catch (error) {
      console.error('Error exporting project:', error);
      this.showToast(MESSAGES.ERROR_EXPORT, 'error');
    }
  }
  
  /**
   * Gère l'import SVG
   */
  private handleImportSVG(): void {
    const input = this.getElement('svg-file-input') as HTMLInputElement;
    
    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      
      const file = input.files[0];
      
      try {
        const userName = prompt('Ton prénom :');
        if (!userName) return;
        
        const project = await this.storageManager.importSVG(file, userName);
        
        await this.storageManager.saveProject(project);
        await this.loadProject(project.id);
        
        this.showToast('SVG importé avec succès', 'success');
      } catch (error) {
        console.error('Error importing SVG:', error);
        this.showToast('Erreur lors de l\'import SVG', 'error');
      }
      
      input.value = '';
    };
    
    input.click();
  }
  
  /**
   * Démarre la sauvegarde automatique
   */
  private startAutoSave(): void {
    this.stopAutoSave();
    
    this.autoSaveInterval = window.setInterval(() => {
      this.saveProject();
    }, AUTOSAVE_INTERVAL);
  }
  
  /**
   * Arrête la sauvegarde automatique
   */
  private stopAutoSave(): void {
    if (this.autoSaveInterval !== null) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
  
  /**
   * Rend la galerie de projets
   */
  private renderProjectsGallery(): void {
    const searchInput = this.getElement('search') as HTMLInputElement;
    const sortSelect = this.getElement('sort') as HTMLSelectElement;
    const grid = this.getElement('projects-grid');
    const noProjects = this.getElement('no-projects');
    
    let projects = this.storageManager.searchProjects(searchInput.value);
    projects = this.storageManager.sortProjects(projects, sortSelect.value as any);
    
    if (projects.length === 0) {
      grid.innerHTML = '';
      noProjects.classList.remove('hidden');
      return;
    }
    
    noProjects.classList.add('hidden');
    
    grid.innerHTML = projects.map(project => `
      <div class="project-card" data-id="${project.id}">
        <div class="project-thumbnail">
          ${project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.projectName}">` : '📄'}
        </div>
        <div class="project-info">
          <div class="project-name">${this.escapeHtml(project.projectName)}</div>
          <div class="project-meta">
            Par ${this.escapeHtml(project.userName)} • 
            ${new Date(project.lastModified).toLocaleDateString('fr-FR')}
          </div>
          <div class="project-actions">
            <button class="btn-open" onclick="app.loadProject('${project.id}')">Ouvrir</button>
            <button class="btn-export" onclick="app.exportProjectById('${project.id}')">Exporter</button>
            <button class="btn-delete" onclick="app.deleteProjectById('${project.id}')">Supprimer</button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  /**
   * Exporte un projet par ID
   */
  public exportProjectById(id: string): void {
    const project = this.storageManager.getProject(id);
    if (project) {
      this.storageManager.exportSVG(project);
    }
  }
  
  /**
   * Supprime un projet par ID
   */
  public deleteProjectById(id: string): void {
    if (confirm('Supprimer ce dessin ?')) {
      this.storageManager.deleteProject(id);
      this.renderProjectsGallery();
      this.showToast(MESSAGES.PROJECT_DELETED, 'success');
    }
  }
  
  /**
   * Rend les outils
   */
  private renderTools(): void {
    const container = this.getElement('tools-list');
    
    container.innerHTML = TOOLS.map(tool => `
      <button 
        class="tool-btn ${this.activeTool === tool.id ? 'active' : ''}" 
        data-tool="${tool.id}"
        title="${tool.label}"
      >
        ${tool.icon}
      </button>
    `).join('');
    
    container.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = (e.currentTarget as HTMLElement).dataset.tool as Tool;
        this.setActiveTool(tool);
      });
    });
  }
  
  /**
   * Rend les formes
   */
  private renderShapes(): void {
    const container = this.getElement('shapes-list');
    
    container.innerHTML = SHAPES.map(shape => `
      <button 
        class="shape-btn" 
        data-shape="${shape.type}"
        title="${shape.label}"
      >
        ${shape.icon}
      </button>
    `).join('');
    
    container.querySelectorAll('.shape-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const shapeType = (e.currentTarget as HTMLElement).dataset.shape as ShapeType;
        this.addShape(shapeType);
      });
    });
  }
  
  /**
   * Rend les couleurs
   */
  private renderColors(): void {
    const container = this.getElement('colors-list');
    
    container.innerHTML = COLORS.map(color => `
      <button 
        class="color-btn" 
        data-color="${color}"
        style="background-color: ${color}"
        title="${color}"
      ></button>
    `).join('');
    
    container.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = (e.currentTarget as HTMLElement).dataset.color || '#000';
        this.setColor(color);
      });
    });
  }
  
  /**
   * Ajoute une forme
   */
  private addShape(type: ShapeType): void {
    const dims = this.canvasManager.getDimensions();
    const shape = createShape(type, dims.width / 2, dims.height / 2);
    
    this.layerManager.addShape(shape);
    this.saveHistory();
    this.render();
  }
  
  /**
   * Définit l'outil actif
   */
  private setActiveTool(tool: Tool): void {
    this.activeTool = tool;
    this.renderTools();
  }
  
  /**
   * Définit la couleur
   */
  private setColor(color: string): void {
    // TODO: Appliquer la couleur aux formes sélectionnées
    console.log('Set color:', color);
  }
  
  /**
   * Crée un calque
   */
  private createLayer(): void {
    try {
      this.layerManager.createLayer();
      this.renderLayers();
      this.showToast(MESSAGES.LAYER_CREATED, 'success');
    } catch (error) {
      this.showToast(MESSAGES.MAX_LAYERS_REACHED, 'warning');
    }
  }
  
  /**
   * Duplique le calque actif
   */
  private duplicateLayer(): void {
    try {
      const activeLayer = this.layerManager.getActiveLayer();
      if (activeLayer) {
        this.layerManager.duplicateLayer(activeLayer.id);
        this.renderLayers();
      }
    } catch (error) {
      this.showToast(MESSAGES.MAX_LAYERS_REACHED, 'warning');
    }
  }
  
  /**
   * Rend les calques
   */
  private renderLayers(): void {
    const container = this.getElement('layers-list');
    const layers = this.layerManager.getAllLayers();
    
    container.innerHTML = layers.map(layer => `
      <div class="layer-item ${layer.id === this.layerManager.getActiveLayer()?.id ? 'active' : ''}" data-id="${layer.id}">
        <div class="layer-thumbnail">🎨</div>
        <div class="layer-info">
          <div class="layer-name">${this.escapeHtml(layer.name)}</div>
        </div>
        <div class="layer-controls">
          <button onclick="app.toggleLayerVisibility('${layer.id}')" title="Visibilité">
            ${layer.visible ? '👁️' : '👁️‍🗨️'}
          </button>
          <button onclick="app.toggleLayerLock('${layer.id}')" title="Verrouiller">
            ${layer.locked ? '🔒' : '🔓'}
          </button>
          <button onclick="app.deleteLayer('${layer.id}')" title="Supprimer">🗑️</button>
        </div>
      </div>
    `).join('');
    
    container.querySelectorAll('.layer-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const layerId = (e.currentTarget as HTMLElement).dataset.id || '';
        this.layerManager.setActiveLayer(layerId);
        this.renderLayers();
      });
    });
  }
  
  /**
   * Bascule la visibilité d'un calque
   */
  public toggleLayerVisibility(layerId: string): void {
    this.layerManager.toggleVisibility(layerId);
    this.renderLayers();
    this.render();
  }
  
  /**
   * Bascule le verrouillage d'un calque
   */
  public toggleLayerLock(layerId: string): void {
    this.layerManager.toggleLock(layerId);
    this.renderLayers();
  }
  
  /**
   * Supprime un calque
   */
  public deleteLayer(layerId: string): void {
    if (confirm('Supprimer ce calque ?')) {
      this.layerManager.deleteLayer(layerId);
      this.renderLayers();
      this.render();
    }
  }
  
  /**
   * Désélectionne tout
   */
  private deselectAll(): void {
    this.selectedShapeIds = [];
    this.render();
  }
  
  /**
   * Supprime les éléments sélectionnés
   */
  private deleteSelected(): void {
    for (const id of this.selectedShapeIds) {
      this.layerManager.removeShape(id);
    }
    
    this.selectedShapeIds = [];
    this.saveHistory();
    this.render();
  }
  
  /**
   * Sauvegarde dans l'historique
   */
  private saveHistory(): void {
    // Supprimer l'historique après l'index actuel
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Ajouter le nouvel état
    const state: HistoryState = {
      layers: JSON.parse(JSON.stringify(this.layerManager.export())),
      timestamp: Date.now()
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
   * Annuler
   */
  private undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreHistory();
    }
  }
  
  /**
   * Rétablir
   */
  private redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreHistory();
    }
  }
  
  /**
   * Restaure l'historique
   */
  private restoreHistory(): void {
    const state = this.history[this.historyIndex];
    if (state) {
      this.layerManager.loadLayers(state.layers);
      this.render();
    }
  }
  
  /**
   * Rend le canvas
   */
  private render(): void {
    const layers = this.layerManager.getAllLayers();
    this.canvasManager.render(layers);
    this.renderLayers();
  }
  
  /**
   * Met à jour le titre du projet
   */
  private updateProjectTitle(): void {
    if (this.currentProject) {
      const titleEl = this.getElement('project-title');
      titleEl.textContent = this.currentProject.projectName;
    }
  }
  
  /**
   * Met à jour le niveau de zoom
   */
  private updateZoomLevel(): void {
    const zoomLevel = this.getElement('zoom-level');
    const zoom = Math.round(this.canvasManager.getZoom() * 100);
    zoomLevel.textContent = `${zoom}%`;
  }
  
  /**
   * Affiche un toast
   */
  private showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    const container = this.getElement('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  
  /**
   * Récupère un élément DOM
   */
  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element #${id} not found`);
    }
    return element;
  }
  
  /**
   * Échappe les caractères HTML
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialiser l'application
const app = new App();

// Exposer l'instance globalement pour les event handlers inline
(window as any).app = app;
