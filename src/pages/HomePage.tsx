import React from 'react';
import { Link } from 'react-router-dom';
import { Play, GraduationCap, BarChart3, Settings, Users, Target, FolderOpen, List, Calendar } from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: FolderOpen,
      title: 'Project Management',
      description: 'Create and manage Scrum projects with role-based access control and team collaboration.',
      link: '/projects',
      color: 'bg-blue-500'
    },
    {
      icon: List,
      title: 'Product Backlog',
      description: 'Build and manage your product backlog with user stories, priorities, and value assignments.',
      link: '/backlog',
      color: 'bg-green-500'
    },
    {
      icon: Calendar,
      title: 'Sprint Planning',
      description: 'Plan sprints by selecting stories from your backlog and defining sprint goals.',
      link: '/planning',
      color: 'bg-purple-500'
    },
    {
      icon: Target,
      title: 'Sprint Simulation',
      description: 'Run interactive sprint simulations with real-time progress tracking and burndown charts.',
      link: '/sprint',
      color: 'bg-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Final Results',
      description: 'View comprehensive project results with velocity charts and performance metrics.',
      link: '/final-results',
      color: 'bg-indigo-500'
    },
    {
      icon: GraduationCap,
      title: 'Interactive Training',
      description: 'Learn Scrum through hands-on scenarios with decision points and real-time feedback.',
      link: '/training',
      color: 'bg-teal-500'
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'User-Driven Experience',
      description: 'Complete control over your Scrum process - no random data generation, just like real project management.'
    },
    {
      icon: Target,
      title: 'Taiga-Style Interface',
      description: 'Familiar Kanban board interface with drag-and-drop style interactions for story management.'
    },
    {
      icon: Settings,
      title: 'Real-Time Tracking',
      description: 'Update task progress daily and see real-time burndown charts and velocity metrics.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Interactive Scrum Simulator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience Scrum project management with complete user control. Create projects, manage backlogs, 
          plan sprints, and track progress in real-time - just like a real Taiga board.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/projects"
            className="btn-primary flex items-center space-x-2"
          >
            <FolderOpen size={20} />
            <span>Start New Project</span>
          </Link>
          <Link
            to="/training"
            className="btn-secondary flex items-center space-x-2"
          >
            <GraduationCap size={20} />
            <span>Begin Training</span>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="card hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why Choose Our Scrum Simulator?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <Icon size={32} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Complete Scrum Workflow
        </h2>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              1
            </div>
            <h3 className="font-semibold text-gray-900">Create Project</h3>
            <p className="text-sm text-gray-600">Set up your Scrum project with team and settings</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              2
            </div>
            <h3 className="font-semibold text-gray-900">Build Backlog</h3>
            <p className="text-sm text-gray-600">Add user stories with priorities and story points</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              3
            </div>
            <h3 className="font-semibold text-gray-900">Plan Sprint</h3>
            <p className="text-sm text-gray-600">Select stories and define sprint goals</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              4
            </div>
            <h3 className="font-semibold text-gray-900">Run Sprint</h3>
            <p className="text-sm text-gray-600">Update progress daily and track burndown</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              5
            </div>
            <h3 className="font-semibold text-gray-900">View Results</h3>
            <p className="text-sm text-gray-600">Analyze performance and velocity metrics</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Ready to Experience Real Scrum?
        </h2>
        <p className="text-gray-600">
          Start with a new project and experience the complete Scrum workflow with full user control.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/projects" className="btn-primary">
            Create New Project
          </Link>
          <Link to="/training" className="btn-secondary">
            Start Training
          </Link>
        </div>
      </div>
    </div>
  );
};
