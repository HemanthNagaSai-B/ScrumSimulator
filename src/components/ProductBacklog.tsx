import React, { useState } from 'react';
import { UserStory, Project, User } from '../types';
import { Plus, Edit, Trash2, Save, X, Star, Clock, User as UserIcon } from 'lucide-react';

interface ProductBacklogProps {
  project: Project;
  currentUser: User;
  stories: UserStory[];
  onStoriesChange: (stories: UserStory[]) => void;
}

const ProductBacklog: React.FC<ProductBacklogProps> = ({ 
  project, 
  currentUser, 
  stories, 
  onStoriesChange 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [newStory, setNewStory] = useState<Partial<UserStory>>({
    title: '',
    description: '',
    priority: 'Medium',
    storyPoints: 3,
    complexity: 'Medium',
    businessValue: 5,
    technicalDebt: 0,
    status: 'Backlog'
  });

  const canManageStories = currentUser.permissions.some(p => 
    p.resource === 'story' && p.action === 'manage'
  );

  const canEditStories = currentUser.permissions.some(p => 
    p.resource === 'story' && p.action === 'update'
  );

  const storyPointOptions = [1, 2, 3, 5, 8, 13, 21];
  const businessValueOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const addStory = () => {
    if (!newStory.title || !newStory.description) return;

    const story: UserStory = {
      id: Date.now().toString(),
      title: newStory.title,
      description: newStory.description,
      priority: newStory.priority as 'High' | 'Medium' | 'Low',
      storyPoints: newStory.storyPoints || 3,
      complexity: newStory.complexity as 'Simple' | 'Medium' | 'Complex',
      businessValue: newStory.businessValue || 5,
      technicalDebt: newStory.technicalDebt || 0,
      status: 'Backlog',
      dependencies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser.id
    };

    onStoriesChange([...stories, story]);
    setShowAddModal(false);
    setNewStory({
      title: '',
      description: '',
      priority: 'Medium',
      storyPoints: 3,
      complexity: 'Medium',
      businessValue: 5,
      technicalDebt: 0,
      status: 'Backlog'
    });
  };

  const updateStory = () => {
    if (!editingStory) return;

    const updatedStories = stories.map(story => 
      story.id === editingStory.id 
        ? { ...editingStory, updatedAt: new Date() }
        : story
    );

    onStoriesChange(updatedStories);
    setEditingStory(null);
  };

  const deleteStory = (storyId: string) => {
    const updatedStories = stories.filter(story => story.id !== storyId);
    onStoriesChange(updatedStories);
    setShowDeleteConfirm(null);
  };

  const clearAllStories = () => {
    onStoriesChange([]);
    setShowClearConfirm(false);
  };

  const updateStoryValue = (storyId: string, field: keyof UserStory, value: any) => {
    const updatedStories = stories.map(story => 
      story.id === storyId 
        ? { ...story, [field]: value, updatedAt: new Date() }
        : story
    );
    onStoriesChange(updatedStories);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Complex': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Simple': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sortedStories = [...stories].sort((a, b) => {
    // Sort by priority first, then by business value
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.businessValue - a.businessValue;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Backlog</h1>
        <div className="flex space-x-2">
          {canManageStories && (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Story
              </button>
              {stories.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {sortedStories.map(story => (
          <div key={story.id} className="bg-white rounded-lg shadow-md p-6 border">
            {editingStory?.id === story.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <input
                    type="text"
                    value={editingStory.title}
                    onChange={(e) => setEditingStory({...editingStory, title: e.target.value})}
                    className="text-lg font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={updateStory}
                      className="p-1 text-green-600 hover:text-green-800"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingStory(null)}
                      className="p-1 text-gray-600 hover:text-gray-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={editingStory.description}
                  onChange={(e) => setEditingStory({...editingStory, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={editingStory.priority}
                      onChange={(e) => setEditingStory({...editingStory, priority: e.target.value as any})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                    <select
                      value={editingStory.storyPoints}
                      onChange={(e) => setEditingStory({...editingStory, storyPoints: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {storyPointOptions.map(points => (
                        <option key={points} value={points}>{points}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Value</label>
                    <select
                      value={editingStory.businessValue}
                      onChange={(e) => setEditingStory({...editingStory, businessValue: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {businessValueOptions.map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                    <select
                      value={editingStory.complexity}
                      onChange={(e) => setEditingStory({...editingStory, complexity: e.target.value as any})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Simple">Simple</option>
                      <option value="Medium">Medium</option>
                      <option value="Complex">Complex</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{story.title}</h3>
                  <div className="flex space-x-2">
                    {canEditStories && (
                      <button
                        onClick={() => setEditingStory(story)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canManageStories && (
                      <button
                        onClick={() => setShowDeleteConfirm(story.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{story.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(story.priority)}`}>
                      {story.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{story.storyPoints} pts</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{story.businessValue}/10</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getComplexityColor(story.complexity)}`}>
                      {story.complexity}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {story.assignedTo ? 'Assigned' : 'Unassigned'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      story.status === 'Done' ? 'bg-green-100 text-green-800' :
                      story.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      story.status === 'Sprint Backlog' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {story.status}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Created: {story.createdAt.toLocaleDateString()} | 
                  Updated: {story.updatedAt.toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {stories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No user stories yet.</p>
            {canManageStories && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Story
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Story Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add User Story</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="As a user, I want to..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newStory.description}
                  onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Detailed description of the user story..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newStory.priority}
                    onChange={(e) => setNewStory({...newStory, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                  <select
                    value={newStory.storyPoints}
                    onChange={(e) => setNewStory({...newStory, storyPoints: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {storyPointOptions.map(points => (
                      <option key={points} value={points}>{points}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Value</label>
                  <select
                    value={newStory.businessValue}
                    onChange={(e) => setNewStory({...newStory, businessValue: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {businessValueOptions.map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                  <select
                    value={newStory.complexity}
                    onChange={(e) => setNewStory({...newStory, complexity: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Medium">Medium</option>
                    <option value="Complex">Complex</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={addStory}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Story</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user story? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteStory(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Clear All Stories</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all user stories? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={clearAllStories}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductBacklog;
