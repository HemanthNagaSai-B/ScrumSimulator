import { 
  SimulationState, 
  SimulationConfig, 
  TeamMember, 
  UserStory, 
  Sprint, 
  SimulationEvent,
  SimulationMetrics,
  BurndownPoint,
  Impediment
} from '../types';

export class SimulationEngine {
  private state: SimulationState;
  private randomSeed: number;

  constructor(config: SimulationConfig, randomSeed?: number) {
    this.randomSeed = randomSeed || Math.random();
    this.state = this.initializeSimulation(config);
  }

  private initializeSimulation(config: SimulationConfig): SimulationState {
    const team = this.generateTeam(config.teamSize, config.teamExperience);
    const stories = this.generateUserStories(config.storyCount, config.technicalDebtLevel);
    const sprints = this.generateSprints(config.sprintCount, config.sprintDuration);

    return {
      config,
      team,
      stories,
      sprints,
      events: [],
      currentSprint: 0,
      currentDay: 0,
      metrics: this.calculateInitialMetrics(config, team, stories),
      decisions: []
    };
  }

  private generateTeam(size: number, avgExperience: number): TeamMember[] {
    const roles = ['Developer', 'Developer', 'Developer', 'Scrum Master', 'Product Owner', 'QA Engineer'];
    const team: TeamMember[] = [];

    for (let i = 0; i < size; i++) {
      const experienceVariation = (this.random() - 0.5) * 4; // ±2 years
      const experience = Math.max(0.5, avgExperience + experienceVariation);
      const availability = 0.8 + (this.random() - 0.5) * 0.2; // 70-90%

      team.push({
        id: `member-${i}`,
        name: `Team Member ${i + 1}`,
        role: roles[i % roles.length] as any,
        experience,
        availability,
        skills: this.generateSkills(experience)
      });
    }

    return team;
  }

  private generateSkills(experience: number): string[] {
    const allSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS', 'Docker', 'Testing', 'Agile'];
    const skillCount = Math.floor(experience * 2) + 2; // More experience = more skills
    const skills: string[] = [];

    for (let i = 0; i < skillCount && i < allSkills.length; i++) {
      const skill = allSkills[Math.floor(this.random() * allSkills.length)];
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    }

    return skills;
  }

  private generateUserStories(count: number, technicalDebtLevel: number): UserStory[] {
    const stories: UserStory[] = [];
    const storyTemplates = [
      'Implement user authentication system',
      'Create dashboard for data visualization',
      'Add payment processing functionality',
      'Implement real-time notifications',
      'Create admin panel for user management',
      'Add search functionality with filters',
      'Implement file upload and storage',
      'Create reporting system',
      'Add multi-language support',
      'Implement API rate limiting'
    ];

    for (let i = 0; i < count; i++) {
      const complexity = this.determineComplexity();
      const storyPoints = this.calculateStoryPoints(complexity);
      const technicalDebt = technicalDebtLevel * this.random();
      const businessValue = 1 + Math.floor(this.random() * 10);

      stories.push({
        id: `story-${i}`,
        title: storyTemplates[i % storyTemplates.length],
        description: `Detailed description for ${storyTemplates[i % storyTemplates.length]}`,
        priority: this.determinePriority(),
        storyPoints,
        complexity,
        dependencies: [],
        technicalDebt,
        businessValue,
        status: 'Backlog'
      });
    }

    return stories;
  }

  private generateSprints(count: number, duration: number): Sprint[] {
    const sprints: Sprint[] = [];
    const startDate = new Date();

    for (let i = 0; i < count; i++) {
      const sprintStart = new Date(startDate);
      sprintStart.setDate(sprintStart.getDate() + (i * duration * 7));
      
      const sprintEnd = new Date(sprintStart);
      sprintEnd.setDate(sprintEnd.getDate() + (duration * 7) - 1);

      sprints.push({
        id: `sprint-${i}`,
        name: `Sprint ${i + 1}`,
        startDate: sprintStart,
        endDate: sprintEnd,
        duration,
        velocity: 0,
        capacity: 0,
        stories: [],
        status: 'Planning',
        burndownData: [],
        impediments: []
      });
    }

    return sprints;
  }

  private calculateInitialMetrics(config: SimulationConfig, team: TeamMember[], stories: UserStory[]): SimulationMetrics {
    const totalCapacity = team.reduce((sum, member) => sum + (member.availability * 40), 0); // 40 hours/week
    const avgExperience = team.reduce((sum, member) => sum + member.experience, 0) / team.length;
    
    return {
      totalStoriesCompleted: 0,
      averageVelocity: config.initialVelocity,
      sprintSuccessRate: 0,
      technicalDebtScore: 10 - config.technicalDebtLevel,
      teamMorale: 7 + (avgExperience - 3) * 0.5, // Higher experience = higher morale
      stakeholderSatisfaction: 5,
      timelineAccuracy: 100,
      qualityScore: 8 - config.technicalDebtLevel * 0.3
    };
  }

  public runSimulation(): SimulationState {
    for (let sprint = 0; sprint < this.state.config.sprintCount; sprint++) {
      this.state.currentSprint = sprint;
      this.runSprint(sprint);
    }

    this.calculateFinalMetrics();
    return this.state;
  }

  private runSprint(sprintIndex: number): void {
    const sprint = this.state.sprints[sprintIndex];
    sprint.status = 'Active';
    
    // Sprint Planning
    this.planSprint(sprint);
    
    // Daily execution
    const sprintDays = sprint.duration * 5; // 5 working days per week
    for (let day = 0; day < sprintDays; day++) {
      this.state.currentDay = day;
      this.executeSprintDay(sprint, day);
    }
    
    // Sprint Review and Retrospective
    this.completeSprint(sprint);
  }

  private planSprint(sprint: Sprint): void {
    const availableStories = this.state.stories.filter(s => s.status === 'Backlog');
    const teamCapacity = this.calculateTeamCapacity();
    const velocity = this.state.metrics.averageVelocity;
    
    let remainingCapacity = velocity;
    const selectedStories: UserStory[] = [];

    // Sort by priority and business value
    const sortedStories = availableStories.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const aScore = priorityOrder[a.priority] + a.businessValue;
      const bScore = priorityOrder[b.priority] + b.businessValue;
      return bScore - aScore;
    });

    for (const story of sortedStories) {
      if (remainingCapacity >= story.storyPoints) {
        story.status = 'Sprint Backlog';
        selectedStories.push(story);
        remainingCapacity -= story.storyPoints;
      }
    }

    sprint.stories = selectedStories;
    sprint.capacity = teamCapacity;
    sprint.velocity = velocity;
  }

  private executeSprintDay(sprint: Sprint, day: number): void {
    // Generate daily events
    this.generateDailyEvents(sprint, day);
    
    // Process story work
    this.processStoryWork(sprint);
    
    // Update burndown
    this.updateBurndown(sprint, day);
    
    // Check for impediments
    this.checkForImpediments(sprint);
  }

  private generateDailyEvents(sprint: Sprint, day: number): void {
    const eventChance = 0.1; // 10% chance of event per day
    
    if (this.random() < eventChance) {
      const eventTypes = ['ImpedimentCreated', 'VelocityChange', 'ScopeChange'];
      const eventType = eventTypes[Math.floor(this.random() * eventTypes.length)];
      
      const event: SimulationEvent = {
        id: `event-${Date.now()}`,
        type: eventType as any,
        timestamp: new Date(sprint.startDate.getTime() + day * 24 * 60 * 60 * 1000),
        description: this.generateEventDescription(eventType),
        impact: this.calculateEventImpact(eventType)
      };
      
      this.state.events.push(event);
      this.applyEventImpact(event);
    }
  }

  private processStoryWork(sprint: Sprint): void {
    const activeStories = sprint.stories.filter(s => s.status === 'In Progress');
    
    for (const story of activeStories) {
      const completionChance = this.calculateStoryCompletionChance(story);
      
      if (this.random() < completionChance) {
        story.status = 'Done';
        this.state.metrics.totalStoriesCompleted++;
        
        // Create completion event
        const event: SimulationEvent = {
          id: `event-${Date.now()}`,
          type: 'StoryCompleted',
          timestamp: new Date(),
          description: `Story "${story.title}" completed`,
          impact: { velocity: 0.1, morale: 0.05 }
        };
        
        this.state.events.push(event);
      }
    }
    
    // Start new stories if capacity available
    const availableStories = sprint.stories.filter(s => s.status === 'Sprint Backlog');
    let activeCount = sprint.stories.filter(s => s.status === 'In Progress').length;
    const maxActive = Math.ceil(this.state.team.length * 1.5);
    
    for (const story of availableStories) {
      if (activeCount < maxActive && this.random() < 0.3) {
        story.status = 'In Progress';
        activeCount++;
      }
    }
  }

  private updateBurndown(sprint: Sprint, day: number): void {
    const completedPoints = sprint.stories.filter(s => s.status === 'Done')
      .reduce((sum, s) => sum + s.storyPoints, 0);
    const totalPoints = sprint.stories.reduce((sum, s) => sum + s.storyPoints, 0);
    const remainingPoints = totalPoints - completedPoints;
    
    const burndownPoint: BurndownPoint = {
      date: new Date(sprint.startDate.getTime() + day * 24 * 60 * 60 * 1000),
      remainingPoints,
      remainingHours: remainingPoints * 8 // Rough estimate: 8 hours per story point
    };
    
    sprint.burndownData.push(burndownPoint);
  }

  private checkForImpediments(sprint: Sprint): void {
    const impedimentChance = 0.05; // 5% chance per day
    
    if (this.random() < impedimentChance) {
      const impediment: Impediment = {
        id: `impediment-${Date.now()}`,
        description: this.generateImpedimentDescription(),
        severity: this.determineImpedimentSeverity(),
        status: 'Open',
        createdAt: new Date()
      };
      
      sprint.impediments.push(impediment);
      
      // Impact on velocity
      const velocityImpact = impediment.severity === 'Critical' ? -0.3 : 
                           impediment.severity === 'High' ? -0.2 :
                           impediment.severity === 'Medium' ? -0.1 : -0.05;
      
      this.state.metrics.averageVelocity *= (1 + velocityImpact);
    }
  }

  private completeSprint(sprint: Sprint): void {
    const completedStories = sprint.stories.filter(s => s.status === 'Done');
    const actualVelocity = completedStories.reduce((sum, s) => sum + s.storyPoints, 0);
    
    // Update metrics
    this.state.metrics.averageVelocity = (this.state.metrics.averageVelocity + actualVelocity) / 2;
    this.state.metrics.sprintSuccessRate = (completedStories.length / sprint.stories.length) * 100;
    
    // Update team morale based on performance
    const performanceRatio = actualVelocity / sprint.velocity;
    if (performanceRatio >= 1) {
      this.state.metrics.teamMorale = Math.min(10, this.state.metrics.teamMorale + 0.2);
    } else {
      this.state.metrics.teamMorale = Math.max(1, this.state.metrics.teamMorale - 0.3);
    }
    
    sprint.status = 'Completed';
  }

  private calculateFinalMetrics(): void {
    const completedSprints = this.state.sprints.filter(s => s.status === 'Completed');
    const totalStories = this.state.stories.length;
    const completedStories = this.state.stories.filter(s => s.status === 'Done').length;
    
    this.state.metrics.timelineAccuracy = this.calculateTimelineAccuracy();
    this.state.metrics.qualityScore = this.calculateQualityScore();
    this.state.metrics.stakeholderSatisfaction = this.calculateStakeholderSatisfaction();
  }

  // Helper methods
  private random(): number {
    // Simple pseudo-random number generator
    this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
    return this.randomSeed / 233280;
  }

  private determineComplexity(): 'Simple' | 'Medium' | 'Complex' {
    const rand = this.random();
    if (rand < 0.4) return 'Simple';
    if (rand < 0.8) return 'Medium';
    return 'Complex';
  }

  private calculateStoryPoints(complexity: string): number {
    const basePoints = { 'Simple': 2, 'Medium': 5, 'Complex': 8 };
    const variation = (this.random() - 0.5) * 2;
    return Math.max(1, Math.round(basePoints[complexity] + variation));
  }

  private determinePriority(): 'High' | 'Medium' | 'Low' {
    const rand = this.random();
    if (rand < 0.3) return 'High';
    if (rand < 0.7) return 'Medium';
    return 'Low';
  }

  private calculateTeamCapacity(): number {
    return this.state.team.reduce((sum, member) => {
      return sum + (member.availability * 40 * this.state.config.sprintDuration);
    }, 0);
  }

  private calculateStoryCompletionChance(story: UserStory): number {
    const baseChance = 0.3;
    const complexityFactor = story.complexity === 'Simple' ? 1.2 : 
                           story.complexity === 'Medium' ? 1.0 : 0.8;
    const moraleFactor = this.state.metrics.teamMorale / 10;
    
    return baseChance * complexityFactor * moraleFactor;
  }

  private generateEventDescription(eventType: string): string {
    const descriptions = {
      'ImpedimentCreated': 'A new impediment has been identified',
      'VelocityChange': 'Team velocity has changed due to various factors',
      'ScopeChange': 'Project scope has been modified'
    };
    return descriptions[eventType] || 'An event occurred';
  }

  private calculateEventImpact(eventType: string): any {
    const impacts = {
      'ImpedimentCreated': { velocity: -0.1, morale: -0.05 },
      'VelocityChange': { velocity: (this.random() - 0.5) * 0.2 },
      'ScopeChange': { timeline: (this.random() - 0.5) * 0.3 }
    };
    return impacts[eventType] || {};
  }

  private applyEventImpact(event: SimulationEvent): void {
    if (event.impact.velocity) {
      this.state.metrics.averageVelocity *= (1 + event.impact.velocity);
    }
    if (event.impact.morale) {
      this.state.metrics.teamMorale = Math.max(1, Math.min(10, this.state.metrics.teamMorale + event.impact.morale));
    }
  }

  private generateImpedimentDescription(): string {
    const impediments = [
      'Technical infrastructure issues',
      'Team member unavailability',
      'External dependency delays',
      'Requirements clarification needed',
      'Environment setup problems'
    ];
    return impediments[Math.floor(this.random() * impediments.length)];
  }

  private determineImpedimentSeverity(): 'Low' | 'Medium' | 'High' | 'Critical' {
    const rand = this.random();
    if (rand < 0.5) return 'Low';
    if (rand < 0.8) return 'Medium';
    if (rand < 0.95) return 'High';
    return 'Critical';
  }

  private calculateTimelineAccuracy(): number {
    const plannedSprints = this.state.config.sprintCount;
    const actualSprints = this.state.sprints.filter(s => s.status === 'Completed').length;
    return Math.max(0, 100 - Math.abs(plannedSprints - actualSprints) * 20);
  }

  private calculateQualityScore(): number {
    const baseQuality = this.state.metrics.qualityScore;
    const technicalDebtImpact = this.state.config.technicalDebtLevel * 0.1;
    const teamExperienceImpact = (this.state.team.reduce((sum, m) => sum + m.experience, 0) / this.state.team.length) * 0.1;
    
    return Math.max(1, Math.min(10, baseQuality - technicalDebtImpact + teamExperienceImpact));
  }

  private calculateStakeholderSatisfaction(): number {
    const velocityFactor = this.state.metrics.averageVelocity / this.state.config.initialVelocity;
    const qualityFactor = this.state.metrics.qualityScore / 10;
    const timelineFactor = this.state.metrics.timelineAccuracy / 100;
    
    return Math.max(1, Math.min(10, (velocityFactor + qualityFactor + timelineFactor) / 3 * 10));
  }

  public getState(): SimulationState {
    return this.state;
  }

  public makeDecision(decisionId: string, optionId: string): void {
    // This method would be used in training mode to handle user decisions
    const decision = {
      id: `decision-${Date.now()}`,
      scenarioId: 'current',
      decisionPointId: decisionId,
      selectedOption: optionId,
      timestamp: new Date(),
      impact: {}
    };
    
    this.state.decisions.push(decision);
  }
}
