import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { SimulationState, SimulationMetrics } from '../types';
import { BarChart3, TrendingUp, Users, Target, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const [simulationResults, setSimulationResults] = useState<SimulationState | null>(null);
  const [trainingResults, setTrainingResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sprints' | 'team' | 'stories' | 'events'>('overview');

  useEffect(() => {
    // Load results from localStorage
    const simResults = localStorage.getItem('simulationResults');
    const trainResults = localStorage.getItem('trainingResults');

    if (simResults) {
      setSimulationResults(JSON.parse(simResults));
    }
    if (trainResults) {
      setTrainingResults(JSON.parse(trainResults));
    }
  }, []);

  if (!simulationResults && !trainingResults) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">No Results Available</h1>
        <p className="text-gray-600">Run a simulation or complete training to see results here.</p>
      </div>
    );
  }

  const results = simulationResults || trainingResults?.results;
  const metrics = results?.metrics;

  const getMetricColor = (value: number, max: number = 10) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricIcon = (value: number, max: number = 10) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return <CheckCircle size={20} className="text-green-600" />;
    if (percentage >= 60) return <AlertTriangle size={20} className="text-yellow-600" />;
    return <XCircle size={20} className="text-red-600" />;
  };

  const prepareBurndownData = () => {
    if (!results?.sprints) return [];
    
    return results.sprints.flatMap(sprint => 
      sprint.burndownData.map(point => ({
        name: `Sprint ${sprint.name} - Day ${Math.floor((new Date(point.date).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24))}`,
        remainingPoints: point.remainingPoints,
        remainingHours: point.remainingHours,
        sprint: sprint.name
      }))
    );
  };

  const prepareVelocityData = () => {
    if (!results?.sprints) return [];
    
    return results.sprints.map(sprint => ({
      name: sprint.name,
      plannedVelocity: sprint.velocity,
      actualVelocity: sprint.stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + s.storyPoints, 0),
      completedStories: sprint.stories.filter(s => s.status === 'Done').length,
      totalStories: sprint.stories.length
    }));
  };

  const prepareStoryStatusData = () => {
    if (!results?.stories) return [];
    
    const statusCounts = results.stories.reduce((acc, story) => {
      acc[story.status] = (acc[story.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Simulation Results</h1>
        <p className="text-gray-600">
          Detailed analysis of your Scrum simulation performance and outcomes.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stories Completed</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalStoriesCompleted || 0}</p>
            </div>
            <Target size={24} className="text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Velocity</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.averageVelocity?.toFixed(1) || 0}</p>
            </div>
            <TrendingUp size={24} className="text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sprint Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.sprintSuccessRate?.toFixed(1) || 0}%</p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Morale</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.teamMorale?.toFixed(1) || 0}/10</p>
            </div>
            <Users size={24} className="text-primary-600" />
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {[
              { label: 'Technical Debt Score', value: metrics?.technicalDebtScore || 0, max: 10 },
              { label: 'Stakeholder Satisfaction', value: metrics?.stakeholderSatisfaction || 0, max: 10 },
              { label: 'Timeline Accuracy', value: metrics?.timelineAccuracy || 0, max: 100 },
              { label: 'Quality Score', value: metrics?.qualityScore || 0, max: 10 }
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getMetricIcon(metric.value, metric.max)}
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                </div>
                <span className={`text-sm font-bold ${getMetricColor(metric.value, metric.max)}`}>
                  {metric.value.toFixed(1)}
                  {metric.max === 100 ? '%' : `/10`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Story Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareStoryStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {prepareStoryStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Burndown Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprint Burndown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareBurndownData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="remainingPoints" stroke="#8884d8" name="Remaining Points" />
                <Line type="monotone" dataKey="remainingHours" stroke="#82ca9d" name="Remaining Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Velocity Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Velocity Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareVelocityData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="plannedVelocity" fill="#8884d8" name="Planned Velocity" />
                <Bar dataKey="actualVelocity" fill="#82ca9d" name="Actual Velocity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Analysis */}
      {results?.team && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Analysis</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.team.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                    {member.role}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Experience: {member.experience} years</p>
                  <p>Availability: {(member.availability * 100).toFixed(0)}%</p>
                  <p>Skills: {member.skills.slice(0, 3).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Timeline */}
      {results?.events && results.events.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events Timeline</h3>
          <div className="space-y-3">
            {results.events.slice(-10).map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{event.description}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Recommendations</h3>
        <div className="space-y-3">
          {metrics?.technicalDebtScore < 6 && (
            <p className="text-blue-800">• Consider dedicating more time to technical debt reduction to improve long-term velocity.</p>
          )}
          {metrics?.teamMorale < 7 && (
            <p className="text-blue-800">• Focus on team building and addressing impediments to improve morale.</p>
          )}
          {metrics?.sprintSuccessRate < 80 && (
            <p className="text-blue-800">• Review sprint planning process and consider reducing sprint commitments.</p>
          )}
          {metrics?.stakeholderSatisfaction < 7 && (
            <p className="text-blue-800">• Improve communication with stakeholders and manage expectations better.</p>
          )}
          <p className="text-blue-800">• Continue monitoring velocity trends and adjust capacity planning accordingly.</p>
        </div>
      </div>
    </div>
  );
};
