/**
 * Gestionnaire des événements canvas
 * Capture les événements bruts et les transmet au ToolManager
 */

export class EventManager {
  private app: any;
  private canvasWrapper!: HTMLElement;

  constructor(app: any) {
    this.app = app;
  }

  public initialize(): void {
    setTimeout(() => {
      this.canvasWrapper = document.getElementById('canvas-wrapper') as HTMLElement;
      if (this.canvasWrapper) {
        this.setupCanvasEvents();
      }
    }, 100);
  }

  private setupCanvasEvents(): void {
    this.canvasWrapper.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvasWrapper.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvasWrapper.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvasWrapper.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    this.canvasWrapper.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvasWrapper.addEventListener('contextmenu', this.handleContextMenu.bind(this));

    // Afficher les coordonnées
    this.canvasWrapper.addEventListener('mousemove', (e) => {
      const coords = this.getCanvasCoordinates(e);
      const coordsEl = document.getElementById('coordinates');
      if (coordsEl) {
        coordsEl.textContent = `x: ${Math.round(coords.x)}, y: ${Math.round(coords.y)}`;
      }
    });
  }

  private getCanvasCoordinates(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvasWrapper.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  private handleMouseDown(e: MouseEvent): void {
    e.preventDefault();
    const coords = this.getCanvasCoordinates(e);

    // Déléguer au ToolManager
    this.app.toolManager.handleMouseDown(e, coords);
  }

  private handleMouseMove(e: MouseEvent): void {
    const coords = this.getCanvasCoordinates(e);

    // Déléguer au ToolManager
    this.app.toolManager.handleMouseMove(e, coords);
  }

  private handleMouseUp(e: MouseEvent): void {
    const coords = this.getCanvasCoordinates(e);

    // Déléguer au ToolManager
    this.app.toolManager.handleMouseUp(e, coords);
  }

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();

    // Zoom avec la molette
    if (e.deltaY < 0) {
      this.app.zoomIn();
    } else {
      this.app.zoomOut();
    }
  }

  private handleContextMenu(e: MouseEvent): void {
    e.preventDefault(); // Empêcher le menu contextuel
  }
}