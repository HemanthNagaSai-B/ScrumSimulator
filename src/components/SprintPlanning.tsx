import React, { useState } from 'react';
import { Sprint, UserStory, Project, User } from '../types';
import { Plus, Calendar, Users, Target, ArrowRight } from 'lucide-react';

interface SprintPlanningProps {
  project: Project;
  currentUser: User;
  stories: UserStory[];
  onSprintCreate: (sprint: Sprint) => void;
}

const SprintPlanning: React.FC<SprintPlanningProps> = ({ 
  project, 
  currentUser, 
  stories, 
  onSprintCreate 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSprint, setNewSprint] = useState<Partial<Sprint>>({
    name: '',
    duration: 2,
    velocity: 20,
    capacity: 160,
    stories: [],
    goals: []
  });

  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState('');

  const availableStories = stories.filter(story => story.status === 'Backlog');
  const selectedStoryObjects = availableStories.filter(story => 
    selectedStories.includes(story.id)
  );

  const totalSelectedPoints = selectedStoryObjects.reduce((sum, story) => sum + story.storyPoints, 0);

  const canManageSprints = currentUser.permissions.some(p => 
    p.resource === 'sprint' && p.action === 'manage'
  );

  const addGoal = () => {
    if (goalInput.trim()) {
      setNewSprint({
        ...newSprint,
        goals: [...(newSprint.goals || []), goalInput.trim()]
      });
      setGoalInput('');
    }
  };

  const removeGoal = (index: number) => {
    const updatedGoals = newSprint.goals?.filter((_, i) => i !== index) || [];
    setNewSprint({ ...newSprint, goals: updatedGoals });
  };

  const toggleStorySelection = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const createSprint = () => {
    if (!newSprint.name || selectedStories.length === 0) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (newSprint.duration! * 7));

    const sprint: Sprint = {
      id: Date.now().toString(),
      name: newSprint.name,
      startDate,
      endDate,
      duration: newSprint.duration!,
      velocity: newSprint.velocity!,
      capacity: newSprint.capacity!,
      stories: selectedStoryObjects.map(story => ({ ...story, status: 'Sprint Backlog' })),
      status: 'Planning',
      burndownData: [],
      impediments: [],
      goals: newSprint.goals || [],
      dailyScrums: []
    };

    onSprintCreate(sprint);
    setShowCreateModal(false);
    setNewSprint({
      name: '',
      duration: 2,
      velocity: 20,
      capacity: 160,
      stories: [],
      goals: []
    });
    setSelectedStories([]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sprint Planning</h1>
        {canManageSprints && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Sprint
          </button>
        )}
      </div>

      {/* Available Stories */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Available Stories</h2>
        <div className="grid gap-4">
          {availableStories.map(story => (
            <div 
              key={story.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedStories.includes(story.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleStorySelection(story.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{story.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{story.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">{story.storyPoints} story points</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      story.priority === 'High' ? 'bg-red-100 text-red-800' :
                      story.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {story.priority}
                    </span>
                    <span className="text-sm text-gray-500">Value: {story.businessValue}/10</span>
                  </div>
                </div>
                <div className="ml-4">
                  {selectedStories.includes(story.id) && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {availableStories.length === 0 && (
            <p className="text-gray-500 text-center py-4">No stories available for sprint planning</p>
          )}
        </div>
      </div>

      {/* Selected Stories Summary */}
      {selectedStories.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Selected for Sprint</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Total Stories</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{selectedStories.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-medium">Story Points</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalSelectedPoints}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Team Capacity</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{project.settings.defaultVelocity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Sprint Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Sprint</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sprint Name
                </label>
                <input
                  type="text"
                  value={newSprint.name}
                  onChange={(e) => setNewSprint({...newSprint, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Sprint 1 - User Authentication"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (weeks)
                  </label>
                  <select
                    value={newSprint.duration}
                    onChange={(e) => setNewSprint({...newSprint, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 week</option>
                    <option value={2}>2 weeks</option>
                    <option value={3}>3 weeks</option>
                    <option value={4}>4 weeks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Velocity (story points)
                  </label>
                  <input
                    type="number"
                    value={newSprint.velocity}
                    onChange={(e) => setNewSprint({...newSprint, velocity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sprint Goals
                </label>
                <div className="space-y-2">
                  {newSprint.goals?.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1 px-3 py-2 bg-gray-100 rounded">{goal}</span>
                      <button
                        onClick={() => removeGoal(index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a sprint goal..."
                      onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                    />
                    <button
                      onClick={addGoal}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Selected Stories ({selectedStories.length})</h4>
                <div className="space-y-2">
                  {selectedStoryObjects.map(story => (
                    <div key={story.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{story.title}</span>
                      <span className="text-gray-500">{story.storyPoints} pts</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between font-medium">
                    <span>Total Story Points:</span>
                    <span>{totalSelectedPoints}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createSprint}
                disabled={!newSprint.name || selectedStories.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Create Sprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintPlanning;
