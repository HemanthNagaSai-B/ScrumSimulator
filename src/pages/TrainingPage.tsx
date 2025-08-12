import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainingScenarios, getScenarioById } from '../data/trainingScenarios';
import { SimulationEngine } from '../utils/simulationEngine';
import { TrainingScenario, DecisionPoint } from '../types';
import { GraduationCap, Play, BookOpen, Target, Clock, Users } from 'lucide-react';

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null);
  const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleScenarioSelect = (scenario: TrainingScenario) => {
    setSelectedScenario(scenario);
    setCurrentDecisionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleDecisionSubmit = () => {
    if (!selectedOption || !selectedScenario) return;

    setShowExplanation(true);
    
    // Apply decision impact to simulation
    const currentDecision = selectedScenario.decisionPoints[currentDecisionIndex];
    const selectedDecisionOption = currentDecision.options.find(opt => opt.id === selectedOption);
    
    if (selectedDecisionOption) {
      // Here you would typically update the simulation state
      console.log('Decision made:', selectedDecisionOption.text);
      console.log('Impact:', currentDecision.impact);
    }
  };

  const handleNextDecision = () => {
    if (!selectedScenario) return;

    if (currentDecisionIndex < selectedScenario.decisionPoints.length - 1) {
      setCurrentDecisionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Complete the training scenario
      completeTraining();
    }
  };

  const completeTraining = () => {
    setIsRunning(true);
    
    // Run final simulation with all decisions
    setTimeout(() => {
      if (selectedScenario) {
        const engine = new SimulationEngine(selectedScenario.initialConfig);
        const results = engine.runSimulation();
        
        // Store training results
        localStorage.setItem('trainingResults', JSON.stringify({
          scenario: selectedScenario,
          results,
          decisions: selectedScenario.decisionPoints.map((dp, index) => ({
            decisionPoint: dp,
            selectedOption: selectedOption // This would need to be tracked per decision
          }))
        }));
        
        setIsRunning(false);
        navigate('/results');
      }
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentDecision = selectedScenario?.decisionPoints[currentDecisionIndex];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Interactive Training</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn Scrum through hands-on scenarios. Make decisions at critical points and see how they impact your project outcomes.
        </p>
      </div>

      {!selectedScenario ? (
        // Scenario Selection
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {trainingScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleScenarioSelect(scenario)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {scenario.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {scenario.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Target size={16} />
                    <span>{scenario.decisionPoints.length} decision points</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users size={16} />
                    <span>Team size: {scenario.initialConfig.teamSize}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock size={16} />
                    <span>{scenario.initialConfig.sprintCount} sprints</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Learning Objectives:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {scenario.learningObjectives.slice(0, 3).map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Training Interface
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Scenario Header */}
          <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedScenario.name}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedScenario.difficulty)}`}>
                {selectedScenario.difficulty}
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>Decision {currentDecisionIndex + 1} of {selectedScenario.decisionPoints.length}</span>
              <span>•</span>
              <span>Team Size: {selectedScenario.initialConfig.teamSize}</span>
              <span>•</span>
              <span>{selectedScenario.initialConfig.sprintCount} Sprints</span>
            </div>
          </div>

          {/* Current Decision */}
          {currentDecision && (
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {currentDecision.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {currentDecision.description}
              </p>

              <div className="space-y-4">
                {currentDecision.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedOption === option.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="decision"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => handleOptionSelect(option.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {option.text}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {option.description}
                        </p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          {option.consequences.map((consequence, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              {consequence}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="btn-secondary"
                >
                  Back to Scenarios
                </button>
                
                <div className="flex space-x-3">
                  {showExplanation && (
                    <button
                      onClick={handleNextDecision}
                      className="btn-primary"
                    >
                      {currentDecisionIndex < selectedScenario.decisionPoints.length - 1 ? 'Next Decision' : 'Complete Training'}
                    </button>
                  )}
                  
                  {!showExplanation && selectedOption && (
                    <button
                      onClick={handleDecisionSubmit}
                      className="btn-primary"
                    >
                      Submit Decision
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {showExplanation && currentDecision && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                Decision Analysis
              </h3>
              
              <div className="space-y-4">
                <p className="text-green-800">
                  {currentDecision.explanation}
                </p>
                
                {selectedOption === currentDecision.correctOption && (
                  <div className="flex items-center space-x-2 text-green-700">
                    <span className="text-lg">✅</span>
                    <span className="font-medium">Excellent choice! This is the recommended approach.</span>
                  </div>
                )}
                
                {selectedOption !== currentDecision.correctOption && (
                  <div className="flex items-center space-x-2 text-yellow-700">
                    <span className="text-lg">⚠️</span>
                    <span className="font-medium">Consider the recommended approach for future situations.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Training Progress</span>
              <span className="text-sm text-gray-500">
                {currentDecisionIndex + 1} / {selectedScenario.decisionPoints.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentDecisionIndex + 1) / selectedScenario.decisionPoints.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isRunning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-900">Running Final Simulation...</p>
            <p className="text-gray-600">Analyzing the impact of your decisions</p>
          </div>
        </div>
      )}
    </div>
  );
};
