/**
 * Classe de base pour tous les outils
 */

export abstract class BaseTool {
  protected app: any;
  protected isActive: boolean = false;

  constructor(app: any) {
    this.app = app;
  }

  /**
   * Appelé quand l'outil est activé
   */
  activate(): void {
    this.isActive = true;
    this.setCursor();
  }

  /**
   * Appelé quand l'outil est désactivé
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Définit le curseur pour cet outil
   */
  abstract setCursor(): void;

  /**
   * Gère l'événement mousedown
   */
  abstract onMouseDown(e: MouseEvent, coords: { x: number; y: number }): void;

  /**
   * Gère l'événement mousemove
   */
  abstract onMouseMove(e: MouseEvent, coords: { x: number; y: number }): void;

  /**
   * Gère l'événement mouseup
   */
  abstract onMouseUp(e: MouseEvent, coords: { x: number; y: number }): void;

  /**
   * Récupère le nom de l'outil
   */
  abstract getName(): string;
}