import { User, Project, UserStory, Sprint } from '../types';
import { storage } from './storage';
import { cloudStorage, CloudConfig } from './cloudStorage';

// Storage mode configuration
export type StorageMode = 'local' | 'cloud' | 'hybrid';

export interface HybridStorageConfig {
  mode: StorageMode;
  cloudConfig?: CloudConfig;
  syncInterval?: number; // milliseconds
  enableOfflineMode?: boolean;
}

// Hybrid storage manager
class HybridStorageManager {
  private static instance: HybridStorageManager;
  private config: HybridStorageConfig;
  private isCloudInitialized = false;
  private syncTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      mode: 'local',
      syncInterval: 30000, // 30 seconds
      enableOfflineMode: true
    };
  }

  static getInstance(): HybridStorageManager {
    if (!HybridStorageManager.instance) {
      HybridStorageManager.instance = new HybridStorageManager();
    }
    return HybridStorageManager.instance;
  }

  async initialize(config: HybridStorageConfig): Promise<void> {
    this.config = { ...this.config, ...config };

    if (this.config.mode === 'cloud' || this.config.mode === 'hybrid') {
      if (!this.config.cloudConfig) {
        throw new Error('Cloud configuration required for cloud/hybrid mode');
      }
      
      try {
        await cloudStorage.initialize(this.config.cloudConfig);
        this.isCloudInitialized = true;
        console.log('Cloud storage initialized successfully');
      } catch (error) {
        console.error('Failed to initialize cloud storage:', error);
        if (this.config.mode === 'cloud') {
          throw error;
        }
        // In hybrid mode, fall back to local storage
        this.config.mode = 'local';
      }
    }

    // Start sync timer for hybrid mode
    if (this.config.mode === 'hybrid' && this.isCloudInitialized) {
      this.startSyncTimer();
    }
  }

  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      this.syncData();
    }, this.config.syncInterval);
  }

  private async syncData(): Promise<void> {
    try {
      // Sync local data to cloud
      const localData = storage.exportData();
      await cloudStorage.importData(localData);
      console.log('Data synced to cloud');
    } catch (error) {
      console.error('Failed to sync data to cloud:', error);
    }
  }

  // User management
  async saveUser(user: User): Promise<void> {
    // Always save to local storage first
    storage.saveUser(user);

    // Save to cloud if available
    if (this.isCloudInitialized) {
      try {
        await cloudStorage.saveUser(user);
      } catch (error) {
        console.error('Failed to save user to cloud:', error);
      }
    }
  }

  async getUsers(): Promise<User[]> {
    // Try cloud first, fall back to local
    if (this.isCloudInitialized) {
      try {
        const cloudUsers = await cloudStorage.getUsers();
        // Update local storage with cloud data
        cloudUsers.forEach(user => storage.saveUser(user));
        return cloudUsers;
      } catch (error) {
        console.error('Failed to get users from cloud, using local:', error);
      }
    }
    
    return storage.getUsers();
  }

  // Project management
  async saveProject(project: Project): Promise<void> {
    // Always save to local storage first
    storage.saveProject(project);

    // Save to cloud if available
    if (this.isCloudInitialized) {
      try {
        await cloudStorage.saveProject(project);
      } catch (error) {
        console.error('Failed to save project to cloud:', error);
      }
    }
  }

  async getProjects(): Promise<Project[]> {
    // Try cloud first, fall back to local
    if (this.isCloudInitialized) {
      try {
        const cloudProjects = await cloudStorage.getProjects();
        // Update local storage with cloud data
        cloudProjects.forEach(project => storage.saveProject(project));
        return cloudProjects;
      } catch (error) {
        console.error('Failed to get projects from cloud, using local:', error);
      }
    }
    
    return storage.getProjects();
  }

  async deleteProject(projectId: string): Promise<void> {
    // Delete from local storage
    storage.deleteProject(projectId);

    // Delete from cloud if available
    if (this.isCloudInitialized) {
      try {
        await cloudStorage.deleteProject(projectId);
      } catch (error) {
        console.error('Failed to delete project from cloud:', error);
      }
    }
  }

  // Story management
  async saveProjectStories(projectId: string, stories: UserStory[]): Promise<void> {
    // Always save to local storage first
    storage.saveProjectStories(projectId, stories);

    // Save to cloud if available
    if (this.isCloudInitialized) {
      try {
        await cloudStorage.saveProjectStories(projectId, stories);
      } catch (error) {
        console.error('Failed to save stories to cloud:', error);
      }
    }
  }

  async getProjectStories(projectId: string): Promise<UserStory[]> {
    // Try cloud first, fall back to local
    if (this.isCloudInitialized) {
      try {
        const cloudStories = await cloudStorage.getProjectStories(projectId);
        // Update local storage with cloud data
        storage.saveProjectStories(projectId, cloudStories);
        return cloudStories;
      } catch (error) {
        console.error('Failed to get stories from cloud, using local:', error);
      }
    }
    
    return storage.getProjectStories(projectId);
  }

  // Sprint management
  async saveProjectSprints(projectId: string, sprints: Sprint[]): Promise<void> {
    // Always save to local storage first
    storage.saveProjectSprints(projectId, sprints);

    // Save to cloud if available
    if (this.isCloudInitialized) {
      try {
        await cloudStorage.saveProjectSprints(projectId, sprints);
      } catch (error) {
        console.error('Failed to save sprints to cloud:', error);
      }
    }
  }

  async getProjectSprints(projectId: string): Promise<Sprint[]> {
    // Try cloud first, fall back to local
    if (this.isCloudInitialized) {
      try {
        const cloudSprints = await cloudStorage.getProjectSprints(projectId);
        // Update local storage with cloud data
        storage.saveProjectSprints(projectId, cloudSprints);
        return cloudSprints;
      } catch (error) {
        console.error('Failed to get sprints from cloud, using local:', error);
      }
    }
    
    return storage.getProjectSprints(projectId);
  }

  // Data export/import
  async exportData(): Promise<any> {
    if (this.isCloudInitialized) {
      try {
        return await cloudStorage.exportData();
      } catch (error) {
        console.error('Failed to export from cloud, using local:', error);
      }
    }
    
    return storage.exportData();
  }

  async importData(data: any): Promise<void> {
    // Import to local storage
    storage.importData(data);

    // Import to cloud if available
    if (this.isCloudInitialized) {
      try {
        await cloudStorage.importData(data);
      } catch (error) {
        console.error('Failed to import data to cloud:', error);
      }
    }
  }

  // Storage info
  getStorageInfo(): { mode: StorageMode; cloudConnected: boolean; localSize: number } {
    const localData = storage.exportData();
    const localSize = new Blob([JSON.stringify(localData)]).size;
    
    return {
      mode: this.config.mode,
      cloudConnected: this.isCloudInitialized,
      localSize
    };
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    // Clear local storage
    storage.clearAllData();

    // Clear cloud storage if available
    if (this.isCloudInitialized) {
      try {
        await cloudStorage.importData({ users: [], projects: [], stories: {}, sprints: {}, currentUser: null });
      } catch (error) {
        console.error('Failed to clear cloud data:', error);
      }
    }
  }

  // Cleanup
  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
}

// Export singleton instance
export const hybridStorage = HybridStorageManager.getInstance();

// Export types
export type { HybridStorageConfig };
