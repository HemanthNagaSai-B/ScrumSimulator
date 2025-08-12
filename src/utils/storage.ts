import { User, Project, UserStory, Sprint } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'scrum_simulator_users',
  PROJECTS: 'scrum_simulator_projects',
  STORIES: 'scrum_simulator_stories',
  SPRINTS: 'scrum_simulator_sprints',
  CURRENT_USER: 'scrum_simulator_current_user',
  SIMULATION_RESULTS: 'scrum_simulator_results',
  TRAINING_RESULTS: 'scrum_simulator_training_results'
} as const;

// Data interfaces for storage
interface StorageData {
  users: User[];
  projects: Project[];
  stories: Record<string, UserStory[]>; // projectId -> stories
  sprints: Record<string, Sprint[]>; // projectId -> sprints
  currentUser: User | null;
}

// Storage utility class
class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Generic storage methods
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save data to localStorage (${key}):`, error);
      // Fallback: try to clear some space and retry
      this.clearOldData();
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (retryError) {
        console.error(`Failed to save data after cleanup (${key}):`, retryError);
      }
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to load data from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  private clearOldData(): void {
    // Remove old simulation results to free up space
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('simulation') || key.includes('training')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // User management
  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  getUsers(): User[] {
    return this.getItem(STORAGE_KEYS.USERS, []);
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  // Current user management
  saveCurrentUser(user: User): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  getCurrentUser(): User | null {
    return this.getItem(STORAGE_KEYS.CURRENT_USER, null);
  }

  // Project management
  saveProject(project: Project): void {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    this.setItem(STORAGE_KEYS.PROJECTS, projects);
  }

  getProjects(): Project[] {
    return this.getItem(STORAGE_KEYS.PROJECTS, []);
  }

  getProjectById(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find(project => project.id === id) || null;
  }

  deleteProject(projectId: string): void {
    const projects = this.getProjects().filter(p => p.id !== projectId);
    this.setItem(STORAGE_KEYS.PROJECTS, projects);
    
    // Also delete associated stories and sprints
    this.deleteProjectStories(projectId);
    this.deleteProjectSprints(projectId);
  }

  // Story management
  saveProjectStories(projectId: string, stories: UserStory[]): void {
    const allStories = this.getAllStories();
    allStories[projectId] = stories;
    this.setItem(STORAGE_KEYS.STORIES, allStories);
  }

  getProjectStories(projectId: string): UserStory[] {
    const allStories = this.getAllStories();
    return allStories[projectId] || [];
  }

  getAllStories(): Record<string, UserStory[]> {
    return this.getItem(STORAGE_KEYS.STORIES, {});
  }

  deleteProjectStories(projectId: string): void {
    const allStories = this.getAllStories();
    delete allStories[projectId];
    this.setItem(STORAGE_KEYS.STORIES, allStories);
  }

  // Sprint management
  saveProjectSprints(projectId: string, sprints: Sprint[]): void {
    const allSprints = this.getAllSprints();
    allSprints[projectId] = sprints;
    this.setItem(STORAGE_KEYS.SPRINTS, allSprints);
  }

  getProjectSprints(projectId: string): Sprint[] {
    const allSprints = this.getAllSprints();
    return allSprints[projectId] || [];
  }

  getAllSprints(): Record<string, Sprint[]> {
    return this.getItem(STORAGE_KEYS.SPRINTS, {});
  }

  deleteProjectSprints(projectId: string): void {
    const allSprints = this.getAllSprints();
    delete allSprints[projectId];
    this.setItem(STORAGE_KEYS.SPRINTS, allSprints);
  }

  // Simulation results
  saveSimulationResults(results: any): void {
    this.setItem(STORAGE_KEYS.SIMULATION_RESULTS, results);
  }

  getSimulationResults(): any {
    return this.getItem(STORAGE_KEYS.SIMULATION_RESULTS, null);
  }

  // Training results
  saveTrainingResults(results: any): void {
    this.setItem(STORAGE_KEYS.TRAINING_RESULTS, results);
  }

  getTrainingResults(): any {
    return this.getItem(STORAGE_KEYS.TRAINING_RESULTS, null);
  }

  // Data export/import
  exportData(): StorageData {
    return {
      users: this.getUsers(),
      projects: this.getProjects(),
      stories: this.getAllStories(),
      sprints: this.getAllSprints(),
      currentUser: this.getCurrentUser()
    };
  }

  importData(data: StorageData): void {
    if (data.users) this.setItem(STORAGE_KEYS.USERS, data.users);
    if (data.projects) this.setItem(STORAGE_KEYS.PROJECTS, data.projects);
    if (data.stories) this.setItem(STORAGE_KEYS.STORIES, data.stories);
    if (data.sprints) this.setItem(STORAGE_KEYS.SPRINTS, data.sprints);
    if (data.currentUser) this.setItem(STORAGE_KEYS.CURRENT_USER, data.currentUser);
  }

  // Clear all data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    const used = new Blob([JSON.stringify(this.exportData())]).size;
    const available = 5 * 1024 * 1024; // 5MB typical localStorage limit
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance();

// Export types for external use
export type { StorageData };
