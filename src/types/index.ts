// Core Scrum Types
export interface TeamMember {
  id: string;
  name: string;
  role: 'Developer' | 'Scrum Master' | 'Product Owner' | 'QA Engineer' | 'DevOps Engineer';
  experience: number; // years
  availability: number; // percentage
  skills: string[];
  email?: string;
  avatar?: string;
}

// Role-based Access Control
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Product Owner' | 'Scrum Master' | 'Developer' | 'Admin';
  avatar?: string;
  permissions: Permission[];
}

export interface Permission {
  resource: 'project' | 'sprint' | 'story' | 'team' | 'metrics';
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  scope: 'own' | 'team' | 'project' | 'all';
}

// Project Management
export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string; // User ID
  team: TeamMember[];
  members: ProjectMember[];
  createdAt: Date;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  settings: ProjectSettings;
}

export interface ProjectMember {
  userId: string;
  role: 'Product Owner' | 'Scrum Master' | 'Developer';
  joinedAt: Date;
  permissions: Permission[];
}

export interface ProjectSettings {
  sprintDuration: number; // weeks
  defaultVelocity: number;
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  storyPointScale: 'Fibonacci' | 'Linear' | 'Custom';
  maxActiveStories: number;
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  complexity: 'Simple' | 'Medium' | 'Complex';
  dependencies: string[]; // IDs of dependent stories
  technicalDebt: number; // 0-10 scale
  businessValue: number; // 1-10 scale
  status: 'Backlog' | 'Sprint Backlog' | 'In Progress' | 'Done' | 'Blocked';
  assignedTo?: string; // Team member ID
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  tags?: string[];
  acceptanceCriteria?: string[];
  epic?: string; // Epic ID
}

// Enhanced Sprint Management
export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  duration: number; // weeks
  velocity: number; // story points
  capacity: number; // hours
  stories: UserStory[];
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled';
  burndownData: BurndownPoint[];
  impediments: Impediment[];
  goals?: string[];
  retrospective?: SprintRetrospective;
  dailyScrums: DailyScrum[];
}

export interface SprintRetrospective {
  whatWentWell: string[];
  whatWentWrong: string[];
  actionItems: string[];
  teamMorale: number; // 1-10
  velocityAccuracy: number; // percentage
}

export interface DailyScrum {
  id: string;
  date: Date;
  participants: DailyScrumParticipant[];
  impediments: string[];
  notes?: string;
}

export interface DailyScrumParticipant {
  memberId: string;
  yesterdayWork: string;
  todayWork: string;
  blockers: string[];
}

// Task Management
export interface Task {
  id: string;
  storyId: string;
  title: string;
  description: string;
  estimatedHours: number;
  actualHours: number;
  status: 'To Do' | 'In Progress' | 'Done';
  assignedTo?: string;
  startedAt?: Date;
  completedAt?: Date;
  dailyProgress: TaskProgress[];
}

export interface TaskProgress {
  date: Date;
  hoursSpent: number;
  hoursRemaining: number;
  notes?: string;
}

export interface BurndownPoint {
  date: Date;
  remainingPoints: number;
  remainingHours: number;
}

export interface Impediment {
  id: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

// Simulation Configuration
export interface SimulationConfig {
  teamSize: number;
  sprintCount: number;
  sprintDuration: number; // weeks
  initialVelocity: number;
  storyCount: number;
  technicalDebtLevel: number; // 0-10
  teamExperience: number; // average years
  marketPressure: number; // 0-10
  stakeholderEngagement: number; // 0-10
  toolingQuality: number; // 0-10
  processMaturity: number; // 0-10
}

// Simulation Events
export interface SimulationEvent {
  id: string;
  type: 'StoryCompleted' | 'ImpedimentCreated' | 'VelocityChange' | 'ScopeChange' | 'TeamChange' | 'TechnicalDebtImpact';
  timestamp: Date;
  description: string;
  impact: {
    velocity?: number;
    morale?: number;
    quality?: number;
    timeline?: number;
  };
  data?: any;
}

// Training Scenarios
export interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  learningObjectives: string[];
  initialConfig: SimulationConfig;
  decisionPoints: DecisionPoint[];
  expectedOutcomes: string[];
}

export interface DecisionPoint {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  correctOption?: string;
  explanation: string;
  impact: {
    velocity?: number;
    quality?: number;
    morale?: number;
    timeline?: number;
  };
}

export interface DecisionOption {
  id: string;
  text: string;
  description: string;
  consequences: string[];
}

// Simulation State
export interface SimulationState {
  config: SimulationConfig;
  team: TeamMember[];
  stories: UserStory[];
  sprints: Sprint[];
  events: SimulationEvent[];
  currentSprint: number;
  currentDay: number;
  metrics: SimulationMetrics;
  decisions: Decision[];
}

export interface SimulationMetrics {
  totalStoriesCompleted: number;
  averageVelocity: number;
  sprintSuccessRate: number;
  technicalDebtScore: number;
  teamMorale: number;
  stakeholderSatisfaction: number;
  timelineAccuracy: number;
  qualityScore: number;
}

export interface Decision {
  id: string;
  scenarioId: string;
  decisionPointId: string;
  selectedOption: string;
  timestamp: Date;
  impact: any;
}

// Utility Types
export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface SimulationResult {
  success: boolean;
  metrics: SimulationMetrics;
  timeline: number; // actual vs planned
  lessons: string[];
  recommendations: string[];
}
