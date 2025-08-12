import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimulationEngine } from '../utils/simulationEngine';
import { SimulationConfig } from '../types';
import { Play, Settings, BarChart3 } from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<SimulationConfig>({
    teamSize: 6,
    sprintCount: 4,
    sprintDuration: 2,
    initialVelocity: 25,
    storyCount: 20,
    technicalDebtLevel: 5,
    teamExperience: 4,
    marketPressure: 6,
    stakeholderEngagement: 7,
    toolingQuality: 7,
    processMaturity: 6
  });

  const handleConfigChange = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const runSimulation = () => {
    setIsRunning(true);
    
    // Simulate processing time
    setTimeout(() => {
      const engine = new SimulationEngine(config);
      const results = engine.runSimulation();
      
      // Store results in localStorage for the results page
      localStorage.setItem('simulationResults', JSON.stringify(results));
      
      setIsRunning(false);
      navigate('/results');
    }, 2000);
  };

  const configSections = [
    {
      title: 'Team Configuration',
      fields: [
        { key: 'teamSize', label: 'Team Size', min: 3, max: 12, step: 1 },
        { key: 'teamExperience', label: 'Average Experience (years)', min: 1, max: 10, step: 0.5 },
        { key: 'initialVelocity', label: 'Initial Velocity (story points)', min: 10, max: 50, step: 5 }
      ]
    },
    {
      title: 'Project Configuration',
      fields: [
        { key: 'sprintCount', label: 'Number of Sprints', min: 2, max: 12, step: 1 },
        { key: 'sprintDuration', label: 'Sprint Duration (weeks)', min: 1, max: 4, step: 1 },
        { key: 'storyCount', label: 'Total User Stories', min: 10, max: 50, step: 5 }
      ]
    },
    {
      title: 'Environment Factors',
      fields: [
        { key: 'technicalDebtLevel', label: 'Technical Debt Level', min: 0, max: 10, step: 1 },
        { key: 'marketPressure', label: 'Market Pressure', min: 1, max: 10, step: 1 },
        { key: 'stakeholderEngagement', label: 'Stakeholder Engagement', min: 1, max: 10, step: 1 },
        { key: 'toolingQuality', label: 'Tooling Quality', min: 1, max: 10, step: 1 },
        { key: 'processMaturity', label: 'Process Maturity', min: 1, max: 10, step: 1 }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Scrum Simulation</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure your simulation parameters and run realistic Scrum scenarios. 
          Experience how different factors affect team performance and project outcomes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {configSections.map((section) => (
            <div key={section.title} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                {section.title}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={config[field.key as keyof SimulationConfig]}
                        onChange={(e) => handleConfigChange(
                          field.key as keyof SimulationConfig, 
                          parseFloat(e.target.value)
                        )}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                        {config[field.key as keyof SimulationConfig]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Simulation Controls */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Play size={20} className="mr-2" />
              Simulation Controls
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setConfig({
                  teamSize: 6,
                  sprintCount: 4,
                  sprintDuration: 2,
                  initialVelocity: 25,
                  storyCount: 20,
                  technicalDebtLevel: 5,
                  teamExperience: 4,
                  marketPressure: 6,
                  stakeholderEngagement: 7,
                  toolingQuality: 7,
                  processMaturity: 6
                })}
                className="w-full btn-secondary"
              >
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 size={20} className="mr-2" />
              Project Overview
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Duration:</span>
                <span className="font-medium">{config.sprintCount * config.sprintDuration} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Velocity:</span>
                <span className="font-medium">{config.initialVelocity} points/sprint</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Capacity:</span>
                <span className="font-medium">{config.teamSize * 40 * config.sprintDuration} hours/sprint</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Complexity Level:</span>
                <span className="font-medium">
                  {config.technicalDebtLevel > 7 ? 'High' : 
                   config.technicalDebtLevel > 4 ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Start with default settings to understand the baseline</li>
              <li>• Adjust team size and experience to see their impact</li>
              <li>• Higher technical debt will slow down development</li>
              <li>• Market pressure affects stakeholder satisfaction</li>
              <li>• Process maturity improves overall outcomes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
