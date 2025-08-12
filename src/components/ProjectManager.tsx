import React, { useState, useEffect } from 'react';
import { Project, User } from '../types';
import { Plus, Users, Settings, Trash2, Edit, FolderOpen } from 'lucide-react';
import { storage } from '../utils/storage';

interface ProjectManagerProps {
  currentUser: User;
  onProjectSelect: (project: Project) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ currentUser, onProjectSelect }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'Active'
  });

  // Load projects from storage on component mount
  useEffect(() => {
    const savedProjects = storage.getProjects();
    setProjects(savedProjects);
  }, []);

  const createProject = () => {
    if (!newProject.name || !newProject.description) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      owner: currentUser.id,
      team: [],
      members: [{
        userId: currentUser.id,
        role: currentUser.role,
        joinedAt: new Date(),
        permissions: currentUser.permissions
      }],
      createdAt: new Date(),
      status: newProject.status as 'Active' | 'Completed' | 'On Hold' | 'Cancelled',
      settings: {
        sprintDuration: 2,
        defaultVelocity: 25,
        workingHoursPerDay: 8,
        workingDaysPerWeek: 5,
        storyPointScale: 'Fibonacci',
        maxActiveStories: 3
      }
    };

    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    storage.saveProject(project);
    
    setShowCreateModal(false);
    setNewProject({
      name: '',
      description: '',
      status: 'Active'
    });
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    storage.deleteProject(projectId);
  };

  const addTeamMember = (projectId: string, member: any) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          team: [...project.team, member],
          members: [...project.members, {
            userId: member.id,
            role: member.role,
            joinedAt: new Date(),
            permissions: []
          }]
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    updatedProjects.forEach(p => storage.saveProject(p));
    setShowTeamModal(null);
  };

  const canManageProjects = currentUser.permissions.some(p => 
    p.resource === 'project' && p.action === 'manage'
  );

  const canCreateProjects = currentUser.permissions.some(p => 
    p.resource === 'project' && p.action === 'create'
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your Scrum projects</p>
        </div>
        {canCreateProjects && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'Active' ? 'bg-green-100 text-green-800' :
                project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {project.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-2" />
                <span>{project.team.length} team members</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Settings size={16} className="mr-2" />
                <span>{project.settings.sprintDuration} week sprints</span>
              </div>
              <div className="text-sm text-gray-500">
                Created {project.createdAt.toLocaleDateString()}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onProjectSelect(project)}
                className="flex-1 btn-primary flex items-center justify-center space-x-1"
              >
                <FolderOpen size={16} />
                <span>Open</span>
              </button>
              
              {canManageProjects && (
                <>
                  <button
                    onClick={() => setShowTeamModal(project.id)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  >
                    <Users size={16} />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-4">Create your first Scrum project to get started</p>
          {canCreateProjects && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Project
            </button>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewProject({ name: '', description: '', status: 'Active' });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Manage Team</h2>
            <p className="text-gray-600 mb-4">Add team members to your project</p>
            
            {/* Team member form would go here */}
            <div className="text-center py-4 text-gray-500">
              Team management functionality coming soon...
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowTeamModal(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
