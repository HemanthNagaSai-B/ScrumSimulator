import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { SimulationPage } from './pages/SimulationPage';
import { ResultsPage } from './pages/ResultsPage';
import { TrainingPage } from './pages/TrainingPage';
import ProjectManager from './components/ProjectManager';
import ProductBacklog from './components/ProductBacklog';
import SprintPlanning from './components/SprintPlanning';
import SprintSimulation from './components/SprintSimulation';
import DataManager from './components/DataManager';
import StorageConfig from './components/StorageConfig';
import { User, Project, UserStory, Sprint } from './types';
import { storage } from './utils/storage';

function App() {
  // Load data from storage on app startup
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [completedSprints, setCompletedSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app data on startup
  useEffect(() => {
    const initializeApp = () => {
      try {
        // Load current user from storage
        const savedUser = storage.getCurrentUser();
        if (savedUser) {
          setCurrentUser(savedUser);
        } else {
          // Create default user if none exists
          const defaultUser: User = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Scrum Master',
            permissions: [
              { resource: 'project', action: 'create', scope: 'all' },
              { resource: 'project', action: 'read', scope: 'all' },
              { resource: 'project', action: 'update', scope: 'all' },
              { resource: 'project', action: 'delete', scope: 'all' },
              { resource: 'sprint', action: 'create', scope: 'all' },
              { resource: 'sprint', action: 'read', scope: 'all' },
              { resource: 'sprint', action: 'update', scope: 'all' },
              { resource: 'sprint', action: 'delete', scope: 'all' },
              { resource: 'story', action: 'create', scope: 'all' },
              { resource: 'story', action: 'read', scope: 'all' },
              { resource: 'story', action: 'update', scope: 'all' },
              { resource: 'story', action: 'delete', scope: 'all' },
              { resource: 'team', action: 'manage', scope: 'all' },
              { resource: 'metrics', action: 'read', scope: 'all' }
            ]
          };
          setCurrentUser(defaultUser);
          storage.saveCurrentUser(defaultUser);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Save current user when it changes
  useEffect(() => {
    if (currentUser) {
      storage.saveCurrentUser(currentUser);
    }
  }, [currentUser]);

  // Save stories when they change
  useEffect(() => {
    if (selectedProject && stories.length > 0) {
      storage.saveProjectStories(selectedProject.id, stories);
    }
  }, [stories, selectedProject]);

  // Save sprints when they change
  useEffect(() => {
    if (selectedProject) {
      const allSprints = [...completedSprints];
      if (currentSprint) {
        allSprints.push(currentSprint);
      }
      storage.saveProjectSprints(selectedProject.id, allSprints);
    }
  }, [currentSprint, completedSprints, selectedProject]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentSprint(null);
    setCompletedSprints([]);
    
    // Load project-specific data from storage
    const projectStories = storage.getProjectStories(project.id);
    const projectSprints = storage.getProjectSprints(project.id);
    
    if (projectStories.length > 0) {
      setStories(projectStories);
    } else {
      // Initialize with sample stories if none exist
      const sampleStories: UserStory[] = [
        {
          id: '1',
          title: 'User Authentication System',
          description: 'Implement secure user login and registration functionality',
          priority: 'High',
          storyPoints: 8,
          complexity: 'Complex',
          dependencies: [],
          technicalDebt: 2,
          businessValue: 9,
          status: 'Backlog',
          estimatedHours: 40,
          actualHours: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser?.id || '1'
        },
        {
          id: '2',
          title: 'Dashboard Analytics',
          description: 'Create comprehensive dashboard with key performance metrics',
          priority: 'High',
          storyPoints: 5,
          complexity: 'Medium',
          dependencies: ['1'],
          technicalDebt: 1,
          businessValue: 8,
          status: 'Backlog',
          estimatedHours: 24,
          actualHours: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser?.id || '1'
        },
        {
          id: '3',
          title: 'Mobile Responsive Design',
          description: 'Ensure the application works seamlessly on mobile devices',
          priority: 'Medium',
          storyPoints: 3,
          complexity: 'Simple',
          dependencies: [],
          technicalDebt: 0,
          businessValue: 6,
          status: 'Backlog',
          estimatedHours: 16,
          actualHours: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser?.id || '1'
        },
        {
          id: '4',
          title: 'API Documentation',
          description: 'Create comprehensive API documentation for developers',
          priority: 'Medium',
          storyPoints: 2,
          complexity: 'Simple',
          dependencies: [],
          technicalDebt: 0,
          businessValue: 5,
          status: 'Backlog',
          estimatedHours: 8,
          actualHours: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser?.id || '1'
        },
        {
          id: '5',
          title: 'Performance Optimization',
          description: 'Optimize application performance and reduce load times',
          priority: 'Low',
          storyPoints: 6,
          complexity: 'Complex',
          dependencies: ['1', '2'],
          technicalDebt: 3,
          businessValue: 7,
          status: 'Backlog',
          estimatedHours: 32,
          actualHours: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser?.id || '1'
        }
      ];
      setStories(sampleStories);
      storage.saveProjectStories(project.id, sampleStories);
    }

    // Load sprints if they exist
    if (projectSprints.length > 0) {
      const activeSprint = projectSprints.find(s => s.status === 'Active' || s.status === 'Planning');
      const completedSprints = projectSprints.filter(s => s.status === 'Completed');
      
      if (activeSprint) {
        setCurrentSprint(activeSprint);
      }
      if (completedSprints.length > 0) {
        setCompletedSprints(completedSprints);
      }
    }
  };

  const handleSprintUpdate = (updatedSprint: Sprint) => {
    setCurrentSprint(updatedSprint);
  };

  const handleSprintCreate = (newSprint: Sprint) => {
    setCurrentSprint(newSprint);
  };

  const handleSprintComplete = (completedSprint: Sprint) => {
    setCompletedSprints(prev => [...prev, completedSprint]);
    setCurrentSprint(null);
  };

  // Show loading state while initializing
  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Scrum Simulator...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentUser={currentUser} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/projects" element={
              <ProjectManager
                currentUser={currentUser}
                onProjectSelect={handleProjectSelect}
              />
            } />
            <Route path="/backlog" element={
              selectedProject ? (
                <ProductBacklog
                  project={selectedProject}
                  currentUser={currentUser}
                  stories={stories}
                  onStoriesChange={setStories}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Please select a project first.</p>
                  <button
                    onClick={() => window.location.href = '/projects'}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Projects
                  </button>
                </div>
              )
            } />
            <Route path="/planning" element={
              selectedProject ? (
                <SprintPlanning
                  project={selectedProject}
                  currentUser={currentUser}
                  stories={stories}
                  onSprintCreate={handleSprintCreate}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Please select a project first.</p>
                  <button
                    onClick={() => window.location.href = '/projects'}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Projects
                  </button>
                </div>
              )
            } />
            <Route path="/sprint" element={
              selectedProject && currentSprint ? (
                <SprintSimulation
                  sprint={currentSprint}
                  project={selectedProject}
                  currentUser={currentUser}
                  onSprintUpdate={handleSprintUpdate}
                  onSprintComplete={handleSprintComplete}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {!selectedProject ? 'Please select a project first.' : 'Please create a sprint first.'}
                  </p>
                  <div className="mt-4 space-x-4">
                    {!selectedProject && (
                      <button
                        onClick={() => window.location.href = '/projects'}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Go to Projects
                      </button>
                    )}
                    {selectedProject && (
                      <button
                        onClick={() => window.location.href = '/planning'}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Create Sprint
                      </button>
                    )}
                  </div>
                </div>
              )
            } />
            <Route path="/final-results" element={
              selectedProject && completedSprints.length > 0 ? (
                <FinalResultsPage
                  project={selectedProject}
                  completedSprints={completedSprints}
                  stories={stories}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No completed sprints to show results for.</p>
                  <button
                    onClick={() => window.location.href = '/projects'}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Projects
                  </button>
                </div>
              )
            } />
                          <Route path="/data" element={<DataManager />} />
              <Route path="/storage-config" element={<StorageConfig />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Final Results Page Component
const FinalResultsPage: React.FC<{
  project: Project;
  completedSprints: Sprint[];
  stories: UserStory[];
}> = ({ project, completedSprints, stories }) => {
  const totalStoryPoints = stories.reduce((sum, s) => sum + s.storyPoints, 0);
  const completedStoryPoints = completedSprints.reduce((sum, sprint) => 
    sum + sprint.stories.filter(s => s.status === 'Done').reduce((sprintSum, s) => sprintSum + s.storyPoints, 0), 0
  );
  const totalHours = stories.reduce((sum, s) => sum + (s.actualHours || 0), 0);
  const estimatedHours = stories.reduce((sum, s) => sum + (s.estimatedHours || 0), 0);

  const velocityData = completedSprints.map((sprint, index) => ({
    sprint: `Sprint ${index + 1}`,
    planned: sprint.stories.reduce((sum, s) => sum + s.storyPoints, 0),
    completed: sprint.stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + s.storyPoints, 0),
    velocity: sprint.stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + s.storyPoints, 0)
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Final Project Results</h1>
        <p className="text-gray-600 mt-2">{project.name}</p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sprints</h3>
          <p className="text-3xl font-bold text-blue-600">{completedSprints.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Story Points</h3>
          <p className="text-3xl font-bold text-green-600">{completedStoryPoints}/{totalStoryPoints}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hours Spent</h3>
          <p className="text-3xl font-bold text-yellow-600">{totalHours}h</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Efficiency</h3>
          <p className="text-3xl font-bold text-purple-600">
            {estimatedHours > 0 ? Math.round((totalHours / estimatedHours) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Velocity Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sprint Velocity</h2>
        <div className="h-64">
          {/* Add chart component here */}
          <div className="flex items-center justify-center h-full text-gray-500">
            Velocity chart will be displayed here
          </div>
        </div>
      </div>

      {/* Sprint Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sprint Details</h2>
        <div className="space-y-4">
          {completedSprints.map((sprint, index) => (
            <div key={sprint.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{sprint.name}</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Stories:</span>
                  <span className="ml-2 font-medium">
                    {sprint.stories.filter(s => s.status === 'Done').length}/{sprint.stories.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Points:</span>
                  <span className="ml-2 font-medium">
                    {sprint.stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + s.storyPoints, 0)}/{sprint.stories.reduce((sum, s) => sum + s.storyPoints, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">{sprint.duration} weeks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
