/**
 * Gestionnaire de raccourcis clavier
 */

export class ShortcutManager {
  private shortcuts: Map<string, () => void> = new Map();
  private enabled: boolean = true;
  
  constructor() {
    this.initialize();
  }
  
  /**
   * Initialise les écouteurs d'événements
   */
  private initialize(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  /**
   * Gère les événements de touches
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.enabled) return;
    
    // Ignorer si dans un champ de saisie
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    
    const combo = this.getKeyCombo(e);
    const handler = this.shortcuts.get(combo);
    
    if (handler) {
      e.preventDefault();
      handler();
    }
  }
  
  /**
   * Convertit un événement clavier en combo de touches
   */
  getKeyCombo(e: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    
    let key = e.key.toLowerCase();
    
    // Normaliser certaines touches
    if (key === ' ') key = 'space';
    if (key === 'escape') key = 'esc';
    if (key === 'delete') key = 'del';
    
    parts.push(key);
    
    return parts.join('+');
  }
  
  /**
   * Enregistre un raccourci
   */
  register(combo: string, handler: () => void): void {
    this.shortcuts.set(combo.toLowerCase(), handler);
  }
  
  /**
   * Désenregistre un raccourci
   */
  unregister(combo: string): void {
    this.shortcuts.delete(combo.toLowerCase());
  }
  
  /**
   * Active les raccourcis
   */
  enable(): void {
    this.enabled = true;
  }
  
  /**
   * Désactive les raccourcis
   */
  disable(): void {
    this.enabled = false;
  }
  
  /**
   * Enregistre tous les raccourcis de l'application
   */
  registerAppShortcuts(callbacks: {
    // Sélection
    selectAll: () => void;
    nextShape: () => void;
    previousShape: () => void;
    deselect: () => void;
    
    // Édition
    undo: () => void;
    redo: () => void;
    copy: () => void;
    cut: () => void;
    paste: () => void;
    duplicate: () => void;
    delete: () => void;
    group: () => void;
    ungroup: () => void;
    
    // Déplacement
    moveUp: () => void;
    moveDown: () => void;
    moveLeft: () => void;
    moveRight: () => void;
    moveUpFast: () => void;
    moveDownFast: () => void;
    moveLeftFast: () => void;
    moveRightFast: () => void;
    
    // Transformation
    rotateLeft: () => void;
    rotateRight: () => void;
    scaleDown: () => void;
    scaleUp: () => void;
    
    // Outils
    selectTool: () => void;
    pointEditTool: () => void;
    eraserTool: () => void;
    handTool: () => void;
    zoomTool: () => void;
    lineTool: () => void;
    textTool: () => void;
    brushTool: () => void;
    eyedropperTool: () => void;
    
    // Calques
    newLayer: () => void;
    duplicateLayer: () => void;
    layerUp: () => void;
    layerDown: () => void;
    
    // Fichier
    save: () => void;
    export: () => void;
    newProject: () => void;
    
    // Vue
    zoomReset: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    fitToScreen: () => void;
  }): void {
    // Sélection
    this.register('ctrl+a', callbacks.selectAll);
    this.register('tab', callbacks.nextShape);
    this.register('shift+tab', callbacks.previousShape);
    this.register('esc', callbacks.deselect);
    
    // Édition
    this.register('ctrl+z', callbacks.undo);
    this.register('ctrl+y', callbacks.redo);
    this.register('ctrl+shift+z', callbacks.redo);
    this.register('ctrl+c', callbacks.copy);
    this.register('ctrl+x', callbacks.cut);
    this.register('ctrl+v', callbacks.paste);
    this.register('ctrl+d', callbacks.duplicate);
    this.register('del', callbacks.delete);
    this.register('backspace', callbacks.delete);
    this.register('ctrl+g', callbacks.group);
    this.register('ctrl+shift+g', callbacks.ungroup);
    
    // Déplacement
    this.register('arrowup', callbacks.moveUp);
    this.register('arrowdown', callbacks.moveDown);
    this.register('arrowleft', callbacks.moveLeft);
    this.register('arrowright', callbacks.moveRight);
    this.register('shift+arrowup', callbacks.moveUpFast);
    this.register('shift+arrowdown', callbacks.moveDownFast);
    this.register('shift+arrowleft', callbacks.moveLeftFast);
    this.register('shift+arrowright', callbacks.moveRightFast);
    
    // Transformation
    this.register('[', callbacks.rotateLeft);
    this.register(']', callbacks.rotateRight);
    this.register('<', callbacks.scaleDown);
    this.register('>', callbacks.scaleUp);
    
    // Outils
    this.register('v', callbacks.selectTool);
    this.register('p', callbacks.pointEditTool);
    this.register('e', callbacks.eraserTool);
    this.register('h', callbacks.handTool);
    this.register('z', callbacks.zoomTool);
    this.register('l', callbacks.lineTool);
    this.register('t', callbacks.textTool);
    this.register('b', callbacks.brushTool);
    this.register('i', callbacks.eyedropperTool);
    
    // Calques
    this.register('ctrl+shift+n', callbacks.newLayer);
    this.register('ctrl+j', callbacks.duplicateLayer);
    this.register('ctrl+[', callbacks.layerUp);
    this.register('ctrl+]', callbacks.layerDown);
    
    // Fichier
    this.register('ctrl+s', callbacks.save);
    this.register('ctrl+e', callbacks.export);
    this.register('ctrl+n', callbacks.newProject);
    
    // Vue
    this.register('ctrl+0', callbacks.zoomReset);
    this.register('ctrl++', callbacks.zoomIn);
    this.register('ctrl+=', callbacks.zoomIn); // Alternative pour +
    this.register('ctrl+-', callbacks.zoomOut);
    this.register('ctrl+1', callbacks.fitToScreen);
  }
  
  /**
   * Obtient la liste de tous les raccourcis
   */
  getAllShortcuts(): Array<{ combo: string; description: string }> {
    return [
      // Sélection
      { combo: 'Ctrl+A', description: 'Tout sélectionner' },
      { combo: 'Tab', description: 'Forme suivante' },
      { combo: 'Shift+Tab', description: 'Forme précédente' },
      { combo: 'Escape', description: 'Désélectionner' },
      
      // Édition
      { combo: 'Ctrl+Z', description: 'Annuler' },
      { combo: 'Ctrl+Y', description: 'Rétablir' },
      { combo: 'Ctrl+C', description: 'Copier' },
      { combo: 'Ctrl+X', description: 'Couper' },
      { combo: 'Ctrl+V', description: 'Coller' },
      { combo: 'Ctrl+D', description: 'Dupliquer' },
      { combo: 'Delete', description: 'Supprimer' },
      { combo: 'Ctrl+G', description: 'Grouper' },
      { combo: 'Ctrl+Shift+G', description: 'Dégrouper' },
      
      // Déplacement
      { combo: 'Flèches', description: 'Déplacer 1px' },
      { combo: 'Shift+Flèches', description: 'Déplacer 10px' },
      
      // Transformation
      { combo: '[', description: 'Rotation -15°' },
      { combo: ']', description: 'Rotation +15°' },
      { combo: '<', description: 'Réduire 10%' },
      { combo: '>', description: 'Agrandir 10%' },
      
      // Outils
      { combo: 'V', description: 'Sélection' },
      { combo: 'P', description: 'Édition points' },
      { combo: 'E', description: 'Gomme' },
      { combo: 'H', description: 'Main' },
      { combo: 'Z', description: 'Zoom' },
      { combo: 'L', description: 'Ligne' },
      { combo: 'T', description: 'Texte' },
      { combo: 'B', description: 'Pinceau' },
      { combo: 'I', description: 'Pipette' },
      
      // Calques
      { combo: 'Ctrl+Shift+N', description: 'Nouveau calque' },
      { combo: 'Ctrl+J', description: 'Dupliquer calque' },
      { combo: 'Ctrl+[', description: 'Calque dessous' },
      { combo: 'Ctrl+]', description: 'Calque dessus' },
      
      // Fichier
      { combo: 'Ctrl+S', description: 'Sauvegarder' },
      { combo: 'Ctrl+E', description: 'Exporter SVG' },
      { combo: 'Ctrl+N', description: 'Nouveau projet' },
      
      // Vue
      { combo: 'Ctrl+0', description: 'Zoom 100%' },
      { combo: 'Ctrl++', description: 'Zoom avant' },
      { combo: 'Ctrl+-', description: 'Zoom arrière' },
      { combo: 'Ctrl+1', description: 'Ajuster fenêtre' }
    ];
  }
  
  /**
   * Nettoie tous les raccourcis
   */
  cleanup(): void {
    this.shortcuts.clear();
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }
}
