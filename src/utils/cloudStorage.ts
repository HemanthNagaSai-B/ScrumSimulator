import { User, Project, UserStory, Sprint } from '../types';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Cloud storage configuration
export interface CloudConfig {
  provider: 'firebase' | 'supabase' | 'custom';
  apiKey?: string;
  projectId?: string;
  databaseUrl?: string;
  authDomain?: string;
}

// Cloud storage interface
export interface CloudStorageProvider {
  initialize(config: CloudConfig): Promise<void>;
  saveUser(user: User): Promise<void>;
  getUsers(): Promise<User[]>;
  saveProject(project: Project): Promise<void>;
  getProjects(): Promise<Project[]>;
  deleteProject(projectId: string): Promise<void>;
  saveProjectStories(projectId: string, stories: UserStory[]): Promise<void>;
  getProjectStories(projectId: string): Promise<UserStory[]>;
  saveProjectSprints(projectId: string, sprints: Sprint[]): Promise<void>;
  getProjectSprints(projectId: string): Promise<Sprint[]>;
  exportData(): Promise<any>;
  importData(data: any): Promise<void>;
}

// Firebase implementation with real Firestore
class FirebaseStorage implements CloudStorageProvider {
  private isInitialized = false;

  async initialize(config: CloudConfig): Promise<void> {
    // Firebase is already initialized in the config file
    // We just need to verify the connection
    try {
      // Test the connection by trying to read from a test collection
      const testQuery = query(collection(db, 'test'));
      await getDocs(testQuery);
      this.isInitialized = true;
      console.log('Firebase Firestore connected successfully');
    } catch (error) {
      console.error('Failed to connect to Firebase:', error);
      throw new Error('Failed to initialize Firebase connection');
    }
  }

  async saveUser(user: User): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        ...user,
        updatedAt: serverTimestamp()
      });
      console.log('User saved to Firebase:', user.id);
    } catch (error) {
      console.error('Failed to save user to Firebase:', error);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      const usersQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(usersQuery);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          ...userData,
          id: doc.id
        } as User);
      });
      
      return users;
    } catch (error) {
      console.error('Failed to get users from Firebase:', error);
      throw error;
    }
  }

  async saveProject(project: Project): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      const projectRef = doc(db, 'projects', project.id);
      await setDoc(projectRef, {
        ...project,
        updatedAt: serverTimestamp()
      });
      console.log('Project saved to Firebase:', project.id);
    } catch (error) {
      console.error('Failed to save project to Firebase:', error);
      throw error;
    }
  }

  async getProjects(): Promise<Project[]> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      const projectsQuery = query(collection(db, 'projects'));
      const querySnapshot = await getDocs(projectsQuery);
      const projects: Project[] = [];
      
      querySnapshot.forEach((doc) => {
        const projectData = doc.data();
        projects.push({
          ...projectData,
          id: doc.id
        } as Project);
      });
      
      return projects;
    } catch (error) {
      console.error('Failed to get projects from Firebase:', error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      // Delete the project
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);
      
      // Delete associated stories
      const storiesQuery = query(collection(db, 'stories'), where('projectId', '==', projectId));
      const storiesSnapshot = await getDocs(storiesQuery);
      const deleteStoryPromises = storiesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteStoryPromises);
      
      // Delete associated sprints
      const sprintsQuery = query(collection(db, 'sprints'), where('projectId', '==', projectId));
      const sprintsSnapshot = await getDocs(sprintsQuery);
      const deleteSprintPromises = sprintsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteSprintPromises);
      
      console.log('Project and associated data deleted from Firebase:', projectId);
    } catch (error) {
      console.error('Failed to delete project from Firebase:', error);
      throw error;
    }
  }

  async saveProjectStories(projectId: string, stories: UserStory[]): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      // Delete existing stories for this project
      const existingStoriesQuery = query(collection(db, 'stories'), where('projectId', '==', projectId));
      const existingStoriesSnapshot = await getDocs(existingStoriesQuery);
      const deletePromises = existingStoriesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Save new stories
      const savePromises = stories.map(story => {
        const storyRef = doc(db, 'stories', story.id);
        return setDoc(storyRef, {
          ...story,
          projectId,
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(savePromises);
      console.log('Project stories saved to Firebase:', projectId, stories.length);
    } catch (error) {
      console.error('Failed to save stories to Firebase:', error);
      throw error;
    }
  }

  async getProjectStories(projectId: string): Promise<UserStory[]> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      const storiesQuery = query(
        collection(db, 'stories'), 
        where('projectId', '==', projectId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(storiesQuery);
      const stories: UserStory[] = [];
      
      querySnapshot.forEach((doc) => {
        const storyData = doc.data();
        stories.push({
          ...storyData,
          id: doc.id
        } as UserStory);
      });
      
      return stories;
    } catch (error) {
      console.error('Failed to get stories from Firebase:', error);
      throw error;
    }
  }

  async saveProjectSprints(projectId: string, sprints: Sprint[]): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      // Delete existing sprints for this project
      const existingSprintsQuery = query(collection(db, 'sprints'), where('projectId', '==', projectId));
      const existingSprintsSnapshot = await getDocs(existingSprintsQuery);
      const deletePromises = existingSprintsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Save new sprints
      const savePromises = sprints.map(sprint => {
        const sprintRef = doc(db, 'sprints', sprint.id);
        return setDoc(sprintRef, {
          ...sprint,
          projectId,
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(savePromises);
      console.log('Project sprints saved to Firebase:', projectId, sprints.length);
    } catch (error) {
      console.error('Failed to save sprints to Firebase:', error);
      throw error;
    }
  }

  async getProjectSprints(projectId: string): Promise<Sprint[]> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      const sprintsQuery = query(
        collection(db, 'sprints'), 
        where('projectId', '==', projectId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(sprintsQuery);
      const sprints: Sprint[] = [];
      
      querySnapshot.forEach((doc) => {
        const sprintData = doc.data();
        sprints.push({
          ...sprintData,
          id: doc.id
        } as Sprint);
      });
      
      return sprints;
    } catch (error) {
      console.error('Failed to get sprints from Firebase:', error);
      throw error;
    }
  }

  async exportData(): Promise<any> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      const [users, projects] = await Promise.all([
        this.getUsers(),
        this.getProjects()
      ]);
      
      // Get all stories and sprints
      const [allStoriesSnapshot, allSprintsSnapshot] = await Promise.all([
        getDocs(collection(db, 'stories')),
        getDocs(collection(db, 'sprints'))
      ]);
      
      const stories: Record<string, UserStory[]> = {};
      const sprints: Record<string, Sprint[]> = {};
      
      // Group stories by project
      allStoriesSnapshot.forEach((doc) => {
        const storyData = doc.data();
        const projectId = storyData.projectId;
        if (!stories[projectId]) stories[projectId] = [];
        stories[projectId].push({
          ...storyData,
          id: doc.id
        } as UserStory);
      });
      
      // Group sprints by project
      allSprintsSnapshot.forEach((doc) => {
        const sprintData = doc.data();
        const projectId = sprintData.projectId;
        if (!sprints[projectId]) sprints[projectId] = [];
        sprints[projectId].push({
          ...sprintData,
          id: doc.id
        } as Sprint);
      });
      
      return {
        users,
        projects,
        stories,
        sprints
      };
    } catch (error) {
      console.error('Failed to export data from Firebase:', error);
      throw error;
    }
  }

  async importData(data: any): Promise<void> {
    if (!this.isInitialized) throw new Error('Firebase not initialized');
    
    try {
      // Clear existing data
      await this.clearAllData();
      
      // Import users
      if (data.users) {
        const userPromises = data.users.map((user: User) => this.saveUser(user));
        await Promise.all(userPromises);
      }
      
      // Import projects
      if (data.projects) {
        const projectPromises = data.projects.map((project: Project) => this.saveProject(project));
        await Promise.all(projectPromises);
      }
      
      // Import stories
      if (data.stories) {
        for (const [projectId, stories] of Object.entries(data.stories)) {
          await this.saveProjectStories(projectId, stories as UserStory[]);
        }
      }
      
      // Import sprints
      if (data.sprints) {
        for (const [projectId, sprints] of Object.entries(data.sprints)) {
          await this.saveProjectSprints(projectId, sprints as Sprint[]);
        }
      }
      
      console.log('Data imported to Firebase successfully');
    } catch (error) {
      console.error('Failed to import data to Firebase:', error);
      throw error;
    }
  }

  private async clearAllData(): Promise<void> {
    try {
      // Clear all collections
      const collections = ['users', 'projects', 'stories', 'sprints'];
      const clearPromises = collections.map(async (collectionName) => {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      });
      
      await Promise.all(clearPromises);
      console.log('All data cleared from Firebase');
    } catch (error) {
      console.error('Failed to clear data from Firebase:', error);
      throw error;
    }
  }
}

// Supabase implementation (placeholder)
class SupabaseStorage implements CloudStorageProvider {
  private client: any;

  async initialize(config: CloudConfig): Promise<void> {
    // Supabase initialization would go here
    console.log('Initializing Supabase with config:', config);
  }

  async saveUser(user: User): Promise<void> {
    // Save user to Supabase
    console.log('Saving user to Supabase:', user);
  }

  async getUsers(): Promise<User[]> {
    // Get users from Supabase
    return [];
  }

  async saveProject(project: Project): Promise<void> {
    // Save project to Supabase
    console.log('Saving project to Supabase:', project);
  }

  async getProjects(): Promise<Project[]> {
    // Get projects from Supabase
    return [];
  }

  async deleteProject(projectId: string): Promise<void> {
    // Delete project from Supabase
    console.log('Deleting project from Supabase:', projectId);
  }

  async saveProjectStories(projectId: string, stories: UserStory[]): Promise<void> {
    // Save stories to Supabase
    console.log('Saving stories to Supabase:', { projectId, stories });
  }

  async getProjectStories(projectId: string): Promise<UserStory[]> {
    // Get stories from Supabase
    return [];
  }

  async saveProjectSprints(projectId: string, sprints: Sprint[]): Promise<void> {
    // Save sprints to Supabase
    console.log('Saving sprints to Supabase:', { projectId, sprints });
  }

  async getProjectSprints(projectId: string): Promise<Sprint[]> {
    // Get sprints from Supabase
    return [];
  }

  async exportData(): Promise<any> {
    // Export all data from Supabase
    return {};
  }

  async importData(data: any): Promise<void> {
    // Import data to Supabase
    console.log('Importing data to Supabase:', data);
  }
}

// Custom API implementation
class CustomAPIStorage implements CloudStorageProvider {
  private baseUrl: string = '';
  private apiKey: string = '';

  async initialize(config: CloudConfig): Promise<void> {
    this.baseUrl = config.databaseUrl || '';
    this.apiKey = config.apiKey || '';
    console.log('Initializing Custom API with config:', config);
  }

  async saveUser(user: User): Promise<void> {
    await this.apiCall('POST', '/users', user);
  }

  async getUsers(): Promise<User[]> {
    return await this.apiCall('GET', '/users');
  }

  async saveProject(project: Project): Promise<void> {
    await this.apiCall('POST', '/projects', project);
  }

  async getProjects(): Promise<Project[]> {
    return await this.apiCall('GET', '/projects');
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.apiCall('DELETE', `/projects/${projectId}`);
  }

  async saveProjectStories(projectId: string, stories: UserStory[]): Promise<void> {
    await this.apiCall('POST', `/projects/${projectId}/stories`, { stories });
  }

  async getProjectStories(projectId: string): Promise<UserStory[]> {
    return await this.apiCall('GET', `/projects/${projectId}/stories`);
  }

  async saveProjectSprints(projectId: string, sprints: Sprint[]): Promise<void> {
    await this.apiCall('POST', `/projects/${projectId}/sprints`, { sprints });
  }

  async getProjectSprints(projectId: string): Promise<Sprint[]> {
    return await this.apiCall('GET', `/projects/${projectId}/sprints`);
  }

  async exportData(): Promise<any> {
    return await this.apiCall('GET', '/export');
  }

  async importData(data: any): Promise<void> {
    await this.apiCall('POST', '/import', data);
  }

  private async apiCall(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Cloud storage manager
class CloudStorageManager {
  private static instance: CloudStorageManager;
  private provider: CloudStorageProvider | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): CloudStorageManager {
    if (!CloudStorageManager.instance) {
      CloudStorageManager.instance = new CloudStorageManager();
    }
    return CloudStorageManager.instance;
  }

  async initialize(config: CloudConfig): Promise<void> {
    switch (config.provider) {
      case 'firebase':
        this.provider = new FirebaseStorage();
        break;
      case 'supabase':
        this.provider = new SupabaseStorage();
        break;
      case 'custom':
        this.provider = new CustomAPIStorage();
        break;
      default:
        throw new Error(`Unsupported cloud provider: ${config.provider}`);
    }

    await this.provider.initialize(config);
    this.isInitialized = true;
  }

  private checkInitialized(): void {
    if (!this.isInitialized || !this.provider) {
      throw new Error('Cloud storage not initialized. Call initialize() first.');
    }
  }

  async saveUser(user: User): Promise<void> {
    this.checkInitialized();
    await this.provider!.saveUser(user);
  }

  async getUsers(): Promise<User[]> {
    this.checkInitialized();
    return await this.provider!.getUsers();
  }

  async saveProject(project: Project): Promise<void> {
    this.checkInitialized();
    await this.provider!.saveProject(project);
  }

  async getProjects(): Promise<Project[]> {
    this.checkInitialized();
    return await this.provider!.getProjects();
  }

  async deleteProject(projectId: string): Promise<void> {
    this.checkInitialized();
    await this.provider!.deleteProject(projectId);
  }

  async saveProjectStories(projectId: string, stories: UserStory[]): Promise<void> {
    this.checkInitialized();
    await this.provider!.saveProjectStories(projectId, stories);
  }

  async getProjectStories(projectId: string): Promise<UserStory[]> {
    this.checkInitialized();
    return await this.provider!.getProjectStories(projectId);
  }

  async saveProjectSprints(projectId: string, sprints: Sprint[]): Promise<void> {
    this.checkInitialized();
    await this.provider!.saveProjectSprints(projectId, sprints);
  }

  async getProjectSprints(projectId: string): Promise<Sprint[]> {
    this.checkInitialized();
    return await this.provider!.getProjectSprints(projectId);
  }

  async exportData(): Promise<any> {
    this.checkInitialized();
    return await this.provider!.exportData();
  }

  async importData(data: any): Promise<void> {
    this.checkInitialized();
    await this.provider!.importData(data);
  }
}

// Export singleton instance
export const cloudStorage = CloudStorageManager.getInstance();
