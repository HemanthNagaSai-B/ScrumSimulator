import { TrainingScenario, SimulationConfig } from '../types';

export const trainingScenarios: TrainingScenario[] = [
  {
    id: 'beginner-velocity',
    name: 'Velocity Management for Beginners',
    description: 'Learn how to handle velocity fluctuations and team capacity planning in your first few sprints.',
    difficulty: 'Beginner',
    learningObjectives: [
      'Understand velocity tracking and its importance',
      'Learn to handle velocity variations',
      'Practice capacity planning',
      'Recognize common velocity blockers'
    ],
    initialConfig: {
      teamSize: 5,
      sprintCount: 3,
      sprintDuration: 2,
      initialVelocity: 20,
      storyCount: 15,
      technicalDebtLevel: 3,
      teamExperience: 2,
      marketPressure: 4,
      stakeholderEngagement: 6,
      toolingQuality: 7,
      processMaturity: 5
    },
    decisionPoints: [
      {
        id: 'dp-1',
        title: 'Sprint 1 Velocity Drop',
        description: 'Your team completed only 15 story points in Sprint 1, down from the expected 20. The team is feeling demotivated. What do you do?',
        options: [
          {
            id: 'opt-1a',
            text: 'Push the team to work harder in Sprint 2',
            description: 'Increase pressure and expect 25 story points next sprint',
            consequences: ['Team morale decreases', 'Quality may suffer', 'Risk of burnout']
          },
          {
            id: 'opt-1b',
            text: 'Adjust velocity expectations and plan for 15 points',
            description: 'Accept the new velocity and plan accordingly',
            consequences: ['Realistic planning', 'Team feels supported', 'Better predictability']
          },
          {
            id: 'opt-1c',
            text: 'Investigate root causes and address impediments',
            description: 'Hold a retrospective and identify what went wrong',
            consequences: ['Addresses underlying issues', 'Team learns and improves', 'Long-term velocity improvement']
          }
        ],
        correctOption: 'opt-1c',
        explanation: 'The best approach is to investigate root causes. This shows you care about the team and helps prevent future issues. Simply pushing harder or adjusting expectations without understanding the problem won\'t lead to sustainable improvement.',
        impact: {
          velocity: 0.1,
          morale: 0.2,
          quality: 0.1
        }
      },
      {
        id: 'dp-2',
        title: 'Technical Debt Discovery',
        description: 'During Sprint 2, the team discovers significant technical debt that\'s slowing them down. They want to spend time addressing it.',
        options: [
          {
            id: 'opt-2a',
            text: 'Ignore it and focus on new features',
            description: 'Keep the current velocity and don\'t address technical debt',
            consequences: ['Short-term velocity maintained', 'Technical debt accumulates', 'Future velocity will decrease']
          },
          {
            id: 'opt-2b',
            text: 'Dedicate 20% of sprint capacity to technical debt',
            description: 'Balance new features with technical debt reduction',
            consequences: ['Sustainable development', 'Gradual improvement', 'Balanced approach']
          },
          {
            id: 'opt-2c',
            text: 'Pause new development and focus entirely on technical debt',
            description: 'Stop all new features and clean up the codebase',
            consequences: ['Immediate technical debt reduction', 'No new features delivered', 'Stakeholder concerns']
          }
        ],
        correctOption: 'opt-2b',
        explanation: 'A balanced approach is best. Dedicating 20% of capacity to technical debt is a sustainable practice that prevents accumulation while still delivering value. This is known as the "Boy Scout Rule" - leave the code cleaner than you found it.',
        impact: {
          velocity: -0.05,
          quality: 0.3,
          morale: 0.1
        }
      }
    ],
    expectedOutcomes: [
      'Team understands velocity is a measure, not a target',
      'Improved capacity planning skills',
      'Better handling of technical debt',
      'Enhanced team communication and retrospectives'
    ]
  },
  {
    id: 'intermediate-impediments',
    name: 'Impediment Management',
    description: 'Navigate through various impediments and learn effective resolution strategies.',
    difficulty: 'Intermediate',
    learningObjectives: [
      'Identify and categorize impediments',
      'Learn escalation strategies',
      'Practice stakeholder communication',
      'Understand impediment impact on velocity'
    ],
    initialConfig: {
      teamSize: 6,
      sprintCount: 4,
      sprintDuration: 2,
      initialVelocity: 25,
      storyCount: 20,
      technicalDebtLevel: 5,
      teamExperience: 4,
      marketPressure: 7,
      stakeholderEngagement: 8,
      toolingQuality: 6,
      processMaturity: 7
    },
    decisionPoints: [
      {
        id: 'dp-3',
        title: 'Critical Infrastructure Issue',
        description: 'The development environment is down due to a critical infrastructure issue. The team has been blocked for 2 days.',
        options: [
          {
            id: 'opt-3a',
            text: 'Wait for IT to fix it',
            description: 'Continue waiting for the infrastructure team to resolve the issue',
            consequences: ['Team remains blocked', 'Sprint goals at risk', 'Dependency on external team']
          },
          {
            id: 'opt-3b',
            text: 'Escalate to management immediately',
            description: 'Bring the issue to senior management for urgent resolution',
            consequences: ['High visibility', 'Quick resolution likely', 'May damage relationships']
          },
          {
            id: 'opt-3c',
            text: 'Find workarounds and temporary solutions',
            description: 'Explore alternative approaches while infrastructure is being fixed',
            consequences: ['Team stays productive', 'Shows initiative', 'May create technical debt']
          }
        ],
        correctOption: 'opt-3c',
        explanation: 'The best approach is to find workarounds while escalating appropriately. This keeps the team productive and shows initiative. However, you should also escalate to ensure the infrastructure issue gets proper attention.',
        impact: {
          velocity: 0.1,
          morale: 0.15,
          quality: -0.05
        }
      },
      {
        id: 'dp-4',
        title: 'Stakeholder Scope Creep',
        description: 'A key stakeholder is requesting additional features mid-sprint that weren\'t in the original plan.',
        options: [
          {
            id: 'opt-4a',
            text: 'Accept the changes immediately',
            description: 'Add the new features to the current sprint',
            consequences: ['Stakeholder satisfied', 'Sprint goals compromised', 'Team stress increases']
          },
          {
            id: 'opt-4b',
            text: 'Refuse all changes',
            description: 'Stick strictly to the original sprint plan',
            consequences: ['Sprint integrity maintained', 'Stakeholder dissatisfaction', 'Rigid approach']
          },
          {
            id: 'opt-4c',
            text: 'Discuss impact and negotiate scope',
            description: 'Explain the impact and find a mutually acceptable solution',
            consequences: ['Balanced approach', 'Stakeholder understanding', 'Sustainable process']
          }
        ],
        correctOption: 'opt-4c',
        explanation: 'The best approach is to discuss the impact and negotiate. This maintains sprint integrity while showing flexibility. You should explain what would need to be removed to accommodate the new features.',
        impact: {
          velocity: 0,
          morale: 0.1,
          timeline: 0.05
        }
      }
    ],
    expectedOutcomes: [
      'Improved impediment resolution skills',
      'Better stakeholder communication',
      'Enhanced problem-solving abilities',
      'Stronger team resilience'
    ]
  },
  {
    id: 'advanced-team-dynamics',
    name: 'Advanced Team Dynamics',
    description: 'Handle complex team dynamics, conflicts, and performance issues.',
    difficulty: 'Advanced',
    learningObjectives: [
      'Manage team conflicts effectively',
      'Handle performance issues',
      'Balance individual and team needs',
      'Navigate organizational politics'
    ],
    initialConfig: {
      teamSize: 8,
      sprintCount: 6,
      sprintDuration: 2,
      initialVelocity: 35,
      storyCount: 30,
      technicalDebtLevel: 7,
      teamExperience: 6,
      marketPressure: 9,
      stakeholderEngagement: 9,
      toolingQuality: 8,
      processMaturity: 8
    },
    decisionPoints: [
      {
        id: 'dp-5',
        title: 'Team Conflict Resolution',
        description: 'Two senior developers are in conflict over architectural decisions, affecting team collaboration and velocity.',
        options: [
          {
            id: 'opt-5a',
            text: 'Let them work it out themselves',
            description: 'Stay out of the conflict and let the team resolve it',
            consequences: ['Conflict may escalate', 'Team productivity suffers', 'Passive leadership']
          },
          {
            id: 'opt-5b',
            text: 'Make the decision yourself',
            description: 'Step in and make the architectural decision',
            consequences: ['Quick resolution', 'May create resentment', 'Undermines team autonomy']
          },
          {
            id: 'opt-5c',
            text: 'Facilitate a collaborative decision-making process',
            description: 'Bring the team together to discuss and reach consensus',
            consequences: ['Team ownership', 'Better long-term solution', 'Improved collaboration']
          }
        ],
        correctOption: 'opt-5c',
        explanation: 'Facilitating a collaborative process is the best approach. This ensures team ownership of the decision and improves future collaboration. It also demonstrates effective leadership and conflict resolution skills.',
        impact: {
          velocity: 0.15,
          morale: 0.25,
          quality: 0.1
        }
      },
      {
        id: 'dp-6',
        title: 'Performance Management',
        description: 'One team member is consistently underperforming and affecting team velocity. The team is becoming frustrated.',
        options: [
          {
            id: 'opt-6a',
            text: 'Replace the team member',
            description: 'Remove the underperforming member from the team',
            consequences: ['Quick fix', 'May create fear', 'Loss of knowledge']
          },
          {
            id: 'opt-6b',
            text: 'Ignore the issue',
            description: 'Hope the situation improves on its own',
            consequences: ['Team frustration grows', 'Velocity continues to suffer', 'Poor leadership']
          },
          {
            id: 'opt-6c',
            text: 'Provide support and coaching',
            description: 'Work with the team member to understand and address the issues',
            consequences: ['Shows care and support', 'May improve performance', 'Builds trust']
          }
        ],
        correctOption: 'opt-6c',
        explanation: 'Providing support and coaching is the best approach. This shows you care about the team member and the team. It also addresses the root cause rather than just the symptoms.',
        impact: {
          velocity: 0.1,
          morale: 0.2,
          quality: 0.05
        }
      }
    ],
    expectedOutcomes: [
      'Enhanced conflict resolution skills',
      'Improved team leadership abilities',
      'Better performance management',
      'Stronger team cohesion'
    ]
  }
];

export const getScenarioById = (id: string): TrainingScenario | undefined => {
  return trainingScenarios.find(scenario => scenario.id === id);
};

export const getScenariosByDifficulty = (difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): TrainingScenario[] => {
  return trainingScenarios.filter(scenario => scenario.difficulty === difficulty);
};
