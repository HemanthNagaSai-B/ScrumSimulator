import React, { useState, useEffect } from 'react';
import { Sprint, UserStory, Task, TaskProgress, Project, User } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Play, Pause } from 'lucide-react';

interface SprintSimulationProps {
  sprint: Sprint;
  project: Project;
  currentUser: User;
  onSprintUpdate: (sprint: Sprint) => void;
  onSprintComplete: (sprint: Sprint) => void;
}

const SprintSimulation: React.FC<SprintSimulationProps> = ({ 
  sprint, 
  project, 
  currentUser, 
  onSprintUpdate,
  onSprintComplete
}) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [taskInput, setTaskInput] = useState<Partial<TaskProgress>>({
    hoursSpent: 0,
    hoursRemaining: 0,
    notes: ''
  });
  const [sprintStatus, setSprintStatus] = useState<'Active' | 'Completed' | 'Paused'>('Active');

  const totalSprintDays = sprint.duration * 5; // 5 working days per week
  const completedStories = sprint.stories.filter(s => s.status === 'Done');
  const inProgressStories = sprint.stories.filter(s => s.status === 'In Progress');
  const remainingStories = sprint.stories.filter(s => s.status === 'Sprint Backlog');

  const totalStoryPoints = sprint.stories.reduce((sum, s) => sum + s.storyPoints, 0);
  const completedStoryPoints = completedStories.reduce((sum, s) => sum + s.storyPoints, 0);
  const remainingStoryPoints = totalStoryPoints - completedStoryPoints;

  // Calculate ideal burndown
  const idealBurndown = Array.from({ length: totalSprintDays + 1 }, (_, i) => ({
    day: i,
    ideal: totalStoryPoints - (totalStoryPoints / totalSprintDays) * i,
    actual: i === 0 ? totalStoryPoints : 
           i <= currentDay ? totalStoryPoints - completedStoryPoints : null
  }));

  const addTaskProgress = () => {
    if (!selectedStory || !taskInput.hoursSpent || !taskInput.hoursRemaining) return;

    const progress: TaskProgress = {
      date: new Date(),
      hoursSpent: taskInput.hoursSpent,
      hoursRemaining: taskInput.hoursRemaining,
      notes: taskInput.notes || ''
    };

    // Update story's actual hours
    const updatedStories = sprint.stories.map(story => {
      if (story.id === selectedStory.id) {
        const currentActualHours = story.actualHours || 0;
        const newActualHours = currentActualHours + taskInput.hoursSpent!;
        
        // Check if story is complete
        const isComplete = taskInput.hoursRemaining === 0;
        
        return {
          ...story,
          actualHours: newActualHours,
          status: isComplete ? 'Done' as const : 'In Progress' as const
        };
      }
      return story;
    });

    const updatedSprint = {
      ...sprint,
      stories: updatedStories
    };

    onSprintUpdate(updatedSprint);
    setShowTaskInput(false);
    setSelectedStory(null);
    setTaskInput({ hoursSpent: 0, hoursRemaining: 0, notes: '' });
  };

  const advanceDay = () => {
    if (currentDay < totalSprintDays && sprintStatus === 'Active') {
      setCurrentDay(currentDay + 1);
      
      // Check if sprint is complete (all stories done or time expired)
      const allStoriesComplete = sprint.stories.every(story => story.status === 'Done');
      if (allStoriesComplete || currentDay + 1 >= totalSprintDays) {
        setSprintStatus('Completed');
        onSprintComplete(sprint);
      }
    }
  };

  const startStory = (story: UserStory) => {
    const updatedStories = sprint.stories.map(s => {
      if (s.id === story.id && s.status === 'Sprint Backlog') {
        return { ...s, status: 'In Progress' as const };
      }
      return s;
    });

    const updatedSprint = {
      ...sprint,
      stories: updatedStories
    };

    onSprintUpdate(updatedSprint);
  };

  const completeStory = (story: UserStory) => {
    const updatedStories = sprint.stories.map(s => {
      if (s.id === story.id) {
        return { ...s, status: 'Done' as const };
      }
      return s;
    });

    const updatedSprint = {
      ...sprint,
      stories: updatedStories
    };

    onSprintUpdate(updatedSprint);
  };

  const toggleSprintStatus = () => {
    if (sprintStatus === 'Active') {
      setSprintStatus('Paused');
    } else if (sprintStatus === 'Paused') {
      setSprintStatus('Active');
    }
  };

  const getStoryStatusIcon = (status: string) => {
    switch (status) {
      case 'Done':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Sprint Backlog':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVelocityTrend = () => {
    if (currentDay === 0) return { trend: 'stable', color: 'text-yellow-600', icon: <Clock className="w-4 h-4" /> };
    
    const expectedVelocity = totalStoryPoints / totalSprintDays;
    const actualVelocity = completedStoryPoints / currentDay;
    
    if (actualVelocity > expectedVelocity * 1.1) {
      return { trend: 'up', color: 'text-green-600', icon: <TrendingUp className="w-4 h-4" /> };
    } else if (actualVelocity < expectedVelocity * 0.9) {
      return { trend: 'down', color: 'text-red-600', icon: <TrendingDown className="w-4 h-4" /> };
    } else {
      return { trend: 'stable', color: 'text-yellow-600', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const velocityTrend = getVelocityTrend();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{sprint.name}</h1>
          <p className="text-gray-600">
            Day {currentDay} of {totalSprintDays} | 
            {sprint.startDate.toLocaleDateString()} - {sprint.endDate.toLocaleDateString()}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              sprintStatus === 'Active' ? 'bg-green-100 text-green-800' :
              sprintStatus === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {sprintStatus}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleSprintStatus}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              sprintStatus === 'Active' 
                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {sprintStatus === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{sprintStatus === 'Active' ? 'Pause Sprint' : 'Resume Sprint'}</span>
          </button>
          <button
            onClick={advanceDay}
            disabled={currentDay >= totalSprintDays || sprintStatus !== 'Active'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Advance Day
          </button>
        </div>
      </div>

      {/* Sprint Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stories</p>
              <p className="text-2xl font-bold text-gray-900">{sprint.stories.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedStories.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Story Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedStoryPoints}/{totalStoryPoints}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Velocity Trend</p>
              <div className="flex items-center space-x-1">
                {velocityTrend.icon}
                <span className={`text-lg font-bold ${velocityTrend.color}`}>
                  {velocityTrend.trend.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-100 rounded">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Burndown Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Sprint Burndown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={idealBurndown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Ideal Burndown"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#82ca9d" 
              strokeWidth={3}
              name="Actual Progress"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sprint Stories - Taiga Board Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Backlog */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
            Sprint Backlog ({remainingStories.length})
          </h3>
          <div className="space-y-3">
            {remainingStories.map(story => (
              <div key={story.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{story.title}</h4>
                  {getStoryStatusIcon(story.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{story.description}</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-500">{story.storyPoints} story points</span>
                  <span className="text-gray-500">
                    {story.estimatedHours || 0}h estimated
                  </span>
                </div>
                <button
                  onClick={() => startStory(story)}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Start Story
                </button>
              </div>
            ))}
            {remainingStories.length === 0 && (
              <p className="text-gray-500 text-center py-4">All stories started</p>
            )}
          </div>
        </div>

        {/* In Progress Stories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            In Progress ({inProgressStories.length})
          </h3>
          <div className="space-y-3">
            {inProgressStories.map(story => (
              <div key={story.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{story.title}</h4>
                  {getStoryStatusIcon(story.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{story.description}</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-500">{story.storyPoints} story points</span>
                  <span className="text-gray-500">
                    {story.actualHours || 0}h / {story.estimatedHours || 0}h
                  </span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedStory(story);
                      setShowTaskInput(true);
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Update Progress
                  </button>
                  <button
                    onClick={() => completeStory(story)}
                    className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Complete Story
                  </button>
                </div>
              </div>
            ))}
            {inProgressStories.length === 0 && (
              <p className="text-gray-500 text-center py-4">No stories in progress</p>
            )}
          </div>
        </div>

        {/* Completed Stories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Completed ({completedStories.length})
          </h3>
          <div className="space-y-3">
            {completedStories.map(story => (
              <div key={story.id} className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{story.title}</h4>
                  {getStoryStatusIcon(story.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{story.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{story.storyPoints} story points</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Final: {story.actualHours || 0}h / {story.estimatedHours || 0}h
                </div>
              </div>
            ))}
            {completedStories.length === 0 && (
              <p className="text-gray-500 text-center py-4">No completed stories</p>
            )}
          </div>
        </div>
      </div>

      {/* Task Input Modal */}
      {showTaskInput && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Task Progress</h2>
            <p className="text-gray-600 mb-4">{selectedStory.title}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Spent Today
                </label>
                <input
                  type="number"
                  value={taskInput.hoursSpent}
                  onChange={(e) => setTaskInput({...taskInput, hoursSpent: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="24"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Remaining
                </label>
                <input
                  type="number"
                  value={taskInput.hoursRemaining}
                  onChange={(e) => setTaskInput({...taskInput, hoursRemaining: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={taskInput.notes}
                  onChange={(e) => setTaskInput({...taskInput, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any notes about today's work..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowTaskInput(false);
                  setSelectedStory(null);
                  setTaskInput({ hoursSpent: 0, hoursRemaining: 0, notes: '' });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={addTaskProgress}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintSimulation;
