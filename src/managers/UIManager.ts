/**
 * Gestionnaire de l'interface utilisateur
 */

import type { CanvasFormat } from '../types';
import { CANVAS_FORMATS, TOOLS, SHAPES, COLORS } from '../config';

export class UIManager {
  private app: any; // App reference

  // Éléments DOM
  private welcomeScreen!: HTMLElement;
  private projectsGallery!: HTMLElement;
  private editor!: HTMLElement;
  private newProjectModal!: HTMLElement;

  constructor(app: any) {
    this.app = app;
  }

  public initialize(): void {
    // Récupérer les éléments DOM
    this.welcomeScreen = this.getElement('welcome-screen');
    this.projectsGallery = this.getElement('projects-gallery');
    this.editor = this.getElement('editor');
    this.newProjectModal = this.getElement('new-project-modal');

    this.setupWelcomeScreen();
    this.setupProjectsGallery();
    this.setupEditor();
  }

  // ============ SETUP METHODS ============

  private setupWelcomeScreen(): void {
    this.getElement('new-project').addEventListener('click', () => {
      this.showNewProjectModal();
    });

    this.getElement('load-project').addEventListener('click', () => {
      this.showProjectsGallery();
    });

    this.getElement('import-svg').addEventListener('click', () => {
      this.handleImportSVG();
    });
  }

  private setupProjectsGallery(): void {
    this.getElement('back-to-welcome').addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    const searchInput = this.getElement('search') as HTMLInputElement;
    searchInput.addEventListener('input', () => this.renderProjectsGallery());

    const sortSelect = this.getElement('sort') as HTMLSelectElement;
    sortSelect.addEventListener('change', () => this.renderProjectsGallery());
  }

  private setupEditor(): void {
    // Header
    this.setupElement('save', () => this.app.saveProject());
    this.setupElement('export', () => this.app.exportProject());
    this.setupElement('back-to-gallery', () => this.showProjectsGallery());
    this.setupElement('undo', () => this.app.undo());
    this.setupElement('redo', () => this.app.redo());

    // Zoom
    this.setupElement('zoom-in', () => this.app.zoomIn());
    this.setupElement('zoom-out', () => this.app.zoomOut());
    this.setupElement('zoom-fit', () => this.app.zoomFit());

    // Layers
    this.setupElement('new-layer', () => this.app.createLayer());
    this.setupElement('delete-layer', () => {
      const activeLayer = this.app.layerManager.getActiveLayer();
      if (activeLayer) this.app.deleteLayer(activeLayer.id);
    });
    this.setupElement('duplicate-layer', () => this.app.duplicateLayer());

    // Format selector
    const formatSelector = this.getElementById('format-selector') as HTMLSelectElement | null;
    if (formatSelector) {
      formatSelector.addEventListener('change', (e) => {
        const format = (e.target as HTMLSelectElement).value as CanvasFormat;
        this.app.canvasManager.setFormat(format);
        this.app.render();
      });
    }

    // Stroke width
    const strokeWidth = this.getElementById('stroke-width') as HTMLInputElement | null;
    const strokeWidthValue = this.getElementById('stroke-width-value');
    if (strokeWidth && strokeWidthValue) {
      strokeWidth.addEventListener('input', (e) => {
        const width = parseInt((e.target as HTMLInputElement).value);
        this.app.setStrokeWidth(width);
        strokeWidthValue.textContent = width.toString();
      });
    }

    // Render UI elements
    this.renderTools();
    this.renderShapes();
    this.renderFillColors();
    this.renderStrokeColors();
    this.renderLayers();
  }

  /**
   * Configure un élément avec gestion d'erreur
   */
  private setupElement(id: string, handler: () => void): void {
    const element = this.getElementById(id);
    if (element) {
      element.addEventListener('click', handler);
    }
  }

  // ============ NAVIGATION METHODS ============

  public showWelcomeScreen(): void {
    this.welcomeScreen.classList.remove('hidden');
    this.projectsGallery.classList.add('hidden');
    this.editor.classList.add('hidden');
  }

  public showProjectsGallery(): void {
    this.welcomeScreen.classList.add('hidden');
    this.projectsGallery.classList.remove('hidden');
    this.editor.classList.add('hidden');
    this.renderProjectsGallery();
  }

  public showEditor(): void {
    this.welcomeScreen.classList.add('hidden');
    this.projectsGallery.classList.add('hidden');
    this.editor.classList.remove('hidden');

    if (this.app.currentProject) {
      const titleEl = this.getElementById('project-title');
      if (titleEl) {
        titleEl.textContent = this.app.currentProject.projectName;
      }
    }
  }

  public showNewProjectModal(): void {
    this.newProjectModal.classList.remove('hidden');

    const handleStart = () => {
      const userNameEl = this.getElementById('user-name') as HTMLInputElement | null;
      const projectNameEl = this.getElementById('project-name') as HTMLInputElement | null;
      const formatEl = this.getElementById('format-selector-modal') as HTMLSelectElement | null;

      if (!userNameEl || !projectNameEl) {
        this.showToast('❌ Erreur: champs manquants');
        return;
      }

      const userName = userNameEl.value.trim();
      const projectName = projectNameEl.value.trim();
      const format = (formatEl?.value as CanvasFormat) || 'a4-portrait';

      if (!userName || !projectName) {
        this.showToast('❌ Remplis tous les champs');
        return;
      }

      this.app.createNewProject(userName, projectName, format);
      this.newProjectModal.classList.add('hidden');
    };

    const handleCancel = () => {
      this.newProjectModal.classList.add('hidden');
    };

    const startBtn = this.getElementById('start-drawing');
    const cancelBtn = this.getElementById('cancel-new-project');

    if (startBtn) startBtn.onclick = handleStart;
    if (cancelBtn) cancelBtn.onclick = handleCancel;
  }

  // ============ RENDER METHODS ============

  public renderTools(): void {
    const container = this.getElementById('tools-list');
    if (!container) return;

    container.innerHTML = '';

    TOOLS.forEach(tool => {
      const btn = document.createElement('button');
      btn.className = 'tool-btn' + (this.app.activeTool === tool.id ? ' active' : '');
      btn.innerHTML = `<span class="icon">${tool.icon}</span>`;
      btn.title = tool.label;
      btn.addEventListener('click', () => this.app.setActiveTool(tool.id));
      container.appendChild(btn);
    });
  }

  public renderShapes(): void {
    const container = this.getElementById('shapes-list');
    if (!container) return;

    container.innerHTML = '';

    SHAPES.forEach(shape => {
      const btn = document.createElement('button');
      btn.className = 'shape-btn';
      btn.textContent = shape.icon;
      btn.title = shape.label;
      btn.addEventListener('click', () => this.app.addShape(shape.id));
      container.appendChild(btn);
    });
  }

  public renderFillColors(): void {
    const container = this.getElementById('fill-colors');
    if (!container) return;

    container.innerHTML = '';

    COLORS.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      if (color === this.app.currentFillColor) btn.classList.add('active');
      btn.style.background = color;
      btn.addEventListener('click', () => {
        this.app.setFillColor(color);
        this.renderFillColors();
      });
      container.appendChild(btn);
    });
  }

  public renderStrokeColors(): void {
    const container = this.getElementById('stroke-colors');
    if (!container) return;

    container.innerHTML = '';

    COLORS.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      if (color === this.app.currentStrokeColor) btn.classList.add('active');
      btn.style.background = color;
      btn.addEventListener('click', () => {
        this.app.setStrokeColor(color);
        this.renderStrokeColors();
      });
      container.appendChild(btn);
    });
  }

  public renderLayers(): void {
    const container = this.getElementById('layers-list');
    if (!container) return;
    container.innerHTML = '';

    const layers = this.app.layerManager.getAllLayers();
    const activeLayer = this.app.layerManager.getActiveLayer();

    layers.forEach(layer => {
      const div = document.createElement('div');
      div.className = 'layer-item' + (layer.id === activeLayer?.id ? ' active' : '');

      div.innerHTML = `
        <div class="layer-header">
          <span class="layer-name">${this.escapeHtml(layer.name)}</span>
          <div class="layer-icons">
            <button class="layer-icon ${layer.visible ? 'active' : ''}" title="Visibilité">👁️</button>
            <button class="layer-icon ${layer.locked ? 'active' : ''}" title="Verrouiller">🔒</button>
          </div>
        </div>
        <div class="opacity-slider">
          <input type="range" min="0" max="100" value="${layer.opacity}">
          <span>${layer.opacity}%</span>
        </div>
      `;

      // Click sur le calque pour l'activer
      div.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        if (target.closest('.layer-icon:nth-child(1)')) {
          e.stopPropagation();
          this.app.toggleLayerVisibility(layer.id);
        } else if (target.closest('.layer-icon:nth-child(2)')) {
          e.stopPropagation();
          this.app.toggleLayerLock(layer.id);
        } else if (target.tagName === 'INPUT') {
          e.stopPropagation();
          const value = parseInt((target as HTMLInputElement).value);
          this.app.setLayerOpacity(layer.id, value);
        } else {
          this.app.layerManager.setActiveLayer(layer.id);
          this.renderLayers();
        }
      });

      container.appendChild(div);
    });
  }

  public renderProjectsGallery(): void {
    const projects = this.app.storageManager.getAllProjects();
    const container = this.getElementById('projects-grid');
    const noProjects = this.getElementById('no-projects');

    if (!container || !noProjects) return;

    if (projects.length === 0) {
      container.classList.add('hidden');
      noProjects.classList.remove('hidden');
      return;
    }

    container.classList.remove('hidden');
    noProjects.classList.add('hidden');

    container.innerHTML = projects.map(project => `
      <div class="project-card">
        <div class="project-thumbnail">🎨</div>
        <h3>${this.escapeHtml(project.projectName)}</h3>
        <p>Par ${this.escapeHtml(project.userName)}</p>
        <button class="btn-primary" onclick="app.loadProject('${project.id}')">Ouvrir</button>
        <button class="btn-secondary" onclick="app.deleteProject('${project.id}')">🗑️</button>
      </div>
    `).join('');
  }

  // ============ UTILITY METHODS ============

  public updateZoomLevel(): void {
    const zoomEl = this.getElementById('zoom-level');
    if (!zoomEl) return;

    const zoom = Math.round(this.app.canvasManager.getZoom() * 100);
    zoomEl.textContent = `${zoom}%`;
  }

  public showToast(message: string): void {
    const container = this.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  private handleImportSVG(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg';
    input.onchange = () => {
      this.showToast('Import SVG pas encore implémenté');
    };
    input.click();
  }

  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element #${id} not found`);
    return element;
  }

  /**
   * Récupère un élément sans erreur si absent
   */
  private getElementById(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}