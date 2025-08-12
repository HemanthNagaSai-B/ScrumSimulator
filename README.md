# Scrum Simulator & Training Tool

A comprehensive web-based application that combines Scrum simulation with interactive training scenarios to help teams and individuals master Agile project management principles.

## 🎯 Project Overview

This Scrum Simulator serves two main purposes:

1. **Simulation Engine**: Run realistic Scrum simulations with configurable parameters like team size, story count, sprint duration, and various environmental factors that affect project outcomes.

2. **Training Tool**: Interactive scenarios where users make decisions at critical points, learning how their choices impact project success through immediate feedback and detailed analysis.

## ✨ Key Features

### 🎮 Simulation Capabilities
- **Configurable Parameters**: Team size, experience levels, sprint count, story complexity
- **Realistic Events**: Random generation of impediments, scope changes, and team dynamics
- **Dynamic Metrics**: Real-time tracking of velocity, morale, quality, and stakeholder satisfaction
- **Burndown Charts**: Visual representation of sprint progress and remaining work

### 🎓 Training Scenarios
- **Beginner Level**: Velocity management and basic Scrum concepts
- **Intermediate Level**: Impediment resolution and stakeholder communication
- **Advanced Level**: Team dynamics and conflict resolution
- **Decision Points**: Interactive choices with immediate feedback and explanations

### 📊 Analytics & Results
- **Comprehensive Metrics**: Detailed performance analysis across multiple dimensions
- **Visual Charts**: Burndown charts, velocity comparisons, and story status distribution
- **Team Analysis**: Individual member performance and skill assessment
- **Recommendations**: AI-powered suggestions for improvement

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ScrumSimulator_ws
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to access the application.

### Building for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Use

### Running Simulations

1. **Navigate to Simulation Page**: Click on "Simulation" in the navigation
2. **Configure Parameters**: Adjust team size, sprint count, story complexity, etc.
3. **Run Simulation**: Click "Run Simulation" and watch the results
4. **Analyze Results**: Review detailed metrics and charts on the Results page

### Training Scenarios

1. **Select a Scenario**: Choose from Beginner, Intermediate, or Advanced scenarios
2. **Make Decisions**: At each decision point, choose your approach
3. **Learn from Feedback**: Get immediate explanations and recommendations
4. **Complete Training**: Finish all decision points to see final outcomes

### Understanding Results

- **Metrics Overview**: Key performance indicators at a glance
- **Charts**: Visual representation of burndown, velocity, and story status
- **Team Analysis**: Individual member contributions and skills
- **Recommendations**: Actionable insights for improvement

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Lucide React**: Icon library

### Core Components

#### Simulation Engine (`src/utils/simulationEngine.ts`)
- Handles all simulation logic and randomization
- Manages team dynamics, story progression, and event generation
- Calculates metrics and performance indicators

#### Training Scenarios (`src/data/trainingScenarios.ts`)
- Predefined scenarios with decision points
- Learning objectives and expected outcomes
- Difficulty levels and complexity progression

#### React Components
- **Pages**: Home, Simulation, Training, Results
- **Components**: Navigation, Charts, Metrics displays
- **Types**: Comprehensive TypeScript interfaces

### Key Algorithms

#### Story Completion Logic
```typescript
const completionChance = baseChance * complexityFactor * moraleFactor;
```

#### Velocity Calculation
```typescript
const actualVelocity = completedStories.reduce((sum, s) => sum + s.storyPoints, 0);
```

#### Team Morale Impact
```typescript
const moraleChange = performanceRatio >= 1 ? 0.2 : -0.3;
```

## 📈 Simulation Parameters

### Team Configuration
- **Team Size**: 3-12 members
- **Experience Level**: 1-10 years average
- **Initial Velocity**: 10-50 story points per sprint

### Project Settings
- **Sprint Count**: 2-12 sprints
- **Sprint Duration**: 1-4 weeks
- **Story Count**: 10-50 user stories

### Environmental Factors
- **Technical Debt**: 0-10 scale (higher = more debt)
- **Market Pressure**: 1-10 scale (higher = more pressure)
- **Stakeholder Engagement**: 1-10 scale
- **Tooling Quality**: 1-10 scale
- **Process Maturity**: 1-10 scale

## 🎓 Learning Objectives

### Beginner Scenarios
- Understanding velocity tracking and its importance
- Learning to handle velocity variations
- Practice capacity planning
- Recognizing common velocity blockers

### Intermediate Scenarios
- Identifying and categorizing impediments
- Learning escalation strategies
- Practicing stakeholder communication
- Understanding impediment impact on velocity

### Advanced Scenarios
- Managing team conflicts effectively
- Handling performance issues
- Balancing individual and team needs
- Navigating organizational politics

## 🔧 Customization

### Adding New Scenarios
1. Create a new scenario object in `src/data/trainingScenarios.ts`
2. Define decision points with options and consequences
3. Set learning objectives and expected outcomes
4. Configure initial simulation parameters

### Modifying Simulation Logic
1. Edit the `SimulationEngine` class in `src/utils/simulationEngine.ts`
2. Adjust event probabilities and impact calculations
3. Modify team dynamics and story progression algorithms

### Styling Changes
1. Modify Tailwind classes in components
2. Update color schemes in `tailwind.config.js`
3. Add custom CSS in `src/index.css`

## 📊 Metrics Explained

### Velocity
- **Definition**: Story points completed per sprint
- **Impact**: Affects planning accuracy and team confidence
- **Improvement**: Address impediments, improve estimation

### Team Morale
- **Definition**: Team satisfaction and motivation level (1-10)
- **Impact**: Affects productivity and quality
- **Improvement**: Celebrate successes, address concerns

### Technical Debt Score
- **Definition**: Code quality and maintainability (1-10)
- **Impact**: Slows development over time
- **Improvement**: Dedicate time to refactoring

### Stakeholder Satisfaction
- **Definition**: How well expectations are met (1-10)
- **Impact**: Affects project support and resources
- **Improvement**: Better communication and delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Scrum Alliance for Agile methodology guidance
- Recharts team for excellent charting library
- Tailwind CSS for the utility-first approach
- React team for the amazing framework

## 📞 Support

For questions, issues, or contributions, please:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Contact the development team

---

**Happy Scrumming! 🚀**
