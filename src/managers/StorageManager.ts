/**
 * Gestionnaire du stockage local - Version simplifiée
 */

import { MAX_PROJECTS, STORAGE_KEY } from "../config";
import type { Project } from "../types";

export class StorageManager {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  /**
   * Sauvegarde un projet
   */
  saveProject(project: Project): boolean {
    try {
      const projects = this.getAllProjects();
      const index = projects.findIndex((p) => p.id === project.id);

      if (index !== -1) {
        // Mise à jour d'un projet existant
        projects[index] = project;
      } else {
        // Nouveau projet
        if (projects.length >= MAX_PROJECTS) {
          // Supprimer le plus ancien
          projects.sort((a, b) => a.lastModified - b.lastModified);
          projects.shift();
        }
        projects.push(project);
      }

      this.storage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      throw new Error("Failed to save project");
    }
  }

  /**
   * Récupère un projet par ID
   */
  getProject(id: string): Project | null {
    const projects = this.getAllProjects();
    return projects.find((p) => p.id === id) || null;
  }

  /**
   * Récupère tous les projets
   */
  getAllProjects(): Project[] {
    try {
      const data = this.storage.getItem(STORAGE_KEY);
      if (!data) return [];

      const projects = JSON.parse(data) as Project[];
      return projects.sort((a, b) => b.lastModified - a.lastModified);
    } catch (error) {
      console.error("Erreur lecture projets:", error);
      return [];
    }
  }

  /**
   * Supprime un projet
   */
  deleteProject(id: string): boolean {
    try {
      const projects = this.getAllProjects();
      const filtered = projects.filter((p) => p.id !== id);

      this.storage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Erreur suppression:", error);
      return false;
    }
  }

  /**
   * Recherche des projets
   */
  searchProjects(query: string): Project[] {
    const projects = this.getAllProjects();
    const lowerQuery = query.toLowerCase();

    return projects.filter(
      (p) =>
        p.projectName.toLowerCase().includes(lowerQuery) ||
        p.userName.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Exporte tous les projets
   */
  exportAll(): string {
    const projects = this.getAllProjects();
    return JSON.stringify(projects, null, 2);
  }

  /**
   * Importe des projets
   */
  importProjects(data: string): boolean {
    try {
      const imported = JSON.parse(data) as Project[];
      const existing = this.getAllProjects();

      // Fusionner sans doublons
      const merged = [...existing];

      for (const project of imported) {
        if (!merged.find((p) => p.id === project.id)) {
          merged.push(project);
        }
      }

      // Limiter au maximum
      if (merged.length > MAX_PROJECTS) {
        merged.sort((a, b) => b.lastModified - a.lastModified);
        merged.splice(MAX_PROJECTS);
      }

      this.storage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return true;
    } catch (error) {
      console.error("Erreur import:", error);
      return false;
    }
  }

  /**
   * Efface tous les projets
   */
  clearAll(): boolean {
    try {
      this.storage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Erreur effacement:", error);
      return false;
    }
  }

  /**
   * Récupère les statistiques de stockage
   */
  getStats(): {
    totalProjects: number;
    storageUsed: number;
    storageAvailable: number;
  } {
    const projects = this.getAllProjects();
    const data = this.storage.getItem(STORAGE_KEY) || "";
    const used = new Blob([data]).size;

    return {
      totalProjects: projects.length,
      storageUsed: used,
      storageAvailable: 5 * 1024 * 1024 - used, // 5MB typique
    };
  }
}
