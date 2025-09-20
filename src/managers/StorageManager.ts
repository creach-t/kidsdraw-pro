/**
 * Gestionnaire de stockage local et export de projets
 */

import type { Project, CanvasFormat } from '../types';
import { nanoid } from 'nanoid';
import { saveAs } from 'file-saver';
import { STORAGE_KEY, MAX_PROJECTS } from '../config';

export class StorageManager {
  /**
   * Sauvegarde un projet
   */
  async saveProject(project: Partial<Project>): Promise<string> {
    try {
      const projects = this.getAllProjects();
      const timestamp = Date.now();
      
      let savedProject: Project;
      
      if (project.id) {
        // Mise à jour d'un projet existant
        const index = projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
          savedProject = {
            ...projects[index],
            ...project,
            lastModified: timestamp
          };
          projects[index] = savedProject;
        } else {
          throw new Error('Project not found');
        }
      } else {
        // Nouveau projet
        if (projects.length >= MAX_PROJECTS) {
          // Supprimer le plus ancien si limite atteinte
          projects.sort((a, b) => a.lastModified - b.lastModified);
          projects.shift();
        }
        
        savedProject = {
          id: nanoid(),
          userName: project.userName || '',
          projectName: project.projectName || 'Sans titre',
          svgContent: project.svgContent || '',
          thumbnail: project.thumbnail || '',
          layers: project.layers || [],
          canvasFormat: project.canvasFormat || 'a4-portrait',
          createdAt: timestamp,
          lastModified: timestamp
        };
        
        projects.push(savedProject);
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      
      return savedProject.id;
    } catch (error) {
      console.error('Error saving project:', error);
      throw new Error('Failed to save project');
    }
  }
  
  /**
   * Récupère tous les projets
   */
  getAllProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const projects: Project[] = JSON.parse(data);
      return projects;
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }
  
  /**
   * Récupère un projet par son ID
   */
  getProject(id: string): Project | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }
  
  /**
   * Supprime un projet
   */
  deleteProject(id: string): boolean {
    try {
      const projects = this.getAllProjects();
      const index = projects.findIndex(p => p.id === id);
      
      if (index === -1) return false;
      
      projects.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }
  
  /**
   * Recherche des projets
   */
  searchProjects(query: string): Project[] {
    const projects = this.getAllProjects();
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) return projects;
    
    return projects.filter(p => 
      p.projectName.toLowerCase().includes(lowerQuery) ||
      p.userName.toLowerCase().includes(lowerQuery)
    );
  }
  
  /**
   * Trie les projets
   */
  sortProjects(
    projects: Project[], 
    sortBy: 'recent' | 'oldest' | 'name'
  ): Project[] {
    const sorted = [...projects];
    
    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => b.lastModified - a.lastModified);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.lastModified - b.lastModified);
        break;
      case 'name':
        sorted.sort((a, b) => 
          a.projectName.localeCompare(b.projectName, 'fr')
        );
        break;
    }
    
    return sorted;
  }
  
  /**
   * Exporte un projet en SVG
   */
  exportSVG(project: Project): void {
    try {
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `${project.userName}_${project.projectName}_${timestamp}.svg`;
      
      const blob = new Blob([project.svgContent], { 
        type: 'image/svg+xml;charset=utf-8' 
      });
      
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting SVG:', error);
      throw new Error('Failed to export SVG');
    }
  }
  
  /**
   * Importe un fichier SVG
   */
  async importSVG(file: File, userName?: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const svgContent = e.target?.result as string;
          
          if (!svgContent || !svgContent.includes('<svg')) {
            throw new Error('Invalid SVG file');
          }
          
          // Générer une miniature
          const thumbnail = await this.generateThumbnail(svgContent);
          
          // Extraire les dimensions du SVG
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgContent, 'image/svg+xml');
          const svgElement = doc.querySelector('svg');
          
          let canvasFormat: CanvasFormat = 'custom';
          if (svgElement) {
            const width = parseInt(svgElement.getAttribute('width') || '800');
            const height = parseInt(svgElement.getAttribute('height') || '600');
            
            // Détecter le format si possible
            if (width === 2480 && height === 3508) canvasFormat = 'a4-portrait';
            else if (width === 3508 && height === 2480) canvasFormat = 'a4-landscape';
            else if (width === 1080 && height === 1080) canvasFormat = 'instagram-square';
            else if (width === 1080 && height === 1920) canvasFormat = 'story';
          }
          
          const project: Project = {
            id: nanoid(),
            userName: userName || 'Anonyme',
            projectName: file.name.replace('.svg', ''),
            svgContent,
            thumbnail,
            layers: [], // Les calques seront reconstruits par l'application
            canvasFormat,
            createdAt: Date.now(),
            lastModified: Date.now()
          };
          
          resolve(project);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Génère une miniature en base64 à partir du contenu SVG
   */
  async generateThumbnail(svgContent: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 150;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(''); // Retourner une chaîne vide si pas de contexte
          return;
        }
        
        const img = new Image();
        const svgBlob = new Blob([svgContent], { 
          type: 'image/svg+xml;charset=utf-8' 
        });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          // Dessiner avec aspect ratio préservé
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          URL.revokeObjectURL(url);
          
          const thumbnail = canvas.toDataURL('image/png');
          resolve(thumbnail);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(''); // Retourner une chaîne vide en cas d'erreur
        };
        
        img.src = url;
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        resolve('');
      }
    });
  }
  
  /**
   * Obtient des statistiques sur le stockage
   */
  getStorageStats(): {
    projectCount: number;
    totalSize: number;
    availableSpace: number;
  } {
    const projects = this.getAllProjects();
    const data = localStorage.getItem(STORAGE_KEY) || '';
    const totalSize = new Blob([data]).size;
    
    // Estimation de l'espace disponible (5MB - limite typique de localStorage)
    const maxSize = 5 * 1024 * 1024;
    const availableSpace = maxSize - totalSize;
    
    return {
      projectCount: projects.length,
      totalSize,
      availableSpace
    };
  }
  
  /**
   * Nettoie les projets anciens si nécessaire
   */
  cleanupOldProjects(maxAge: number = 90): number {
    const projects = this.getAllProjects();
    const now = Date.now();
    const maxAgeMs = maxAge * 24 * 60 * 60 * 1000;
    
    const toKeep = projects.filter(p => 
      (now - p.lastModified) < maxAgeMs
    );
    
    const removed = projects.length - toKeep.length;
    
    if (removed > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toKeep));
    }
    
    return removed;
  }
  
  /**
   * Exporte tous les projets en JSON
   */
  exportAllProjects(): void {
    const projects = this.getAllProjects();
    const data = JSON.stringify(projects, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const timestamp = new Date().toISOString().slice(0, 10);
    
    saveAs(blob, `kidsdraw_backup_${timestamp}.json`);
  }
  
  /**
   * Importe des projets depuis un fichier JSON
   */
  async importProjects(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (!Array.isArray(data)) {
            throw new Error('Invalid backup file');
          }
          
          const currentProjects = this.getAllProjects();
          const newProjects = data.filter(p => 
            !currentProjects.some(cp => cp.id === p.id)
          );
          
          const merged = [...currentProjects, ...newProjects].slice(0, MAX_PROJECTS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          
          resolve(newProjects.length);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Efface tous les projets
   */
  clearAllProjects(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
