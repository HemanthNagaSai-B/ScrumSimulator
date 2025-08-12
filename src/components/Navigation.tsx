import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Play, 
  BookOpen, 
  BarChart3, 
  FolderOpen, 
  List, 
  Calendar, 
  Target, 
  User,
  TrendingUp,
  Database,
  Settings
} from 'lucide-react';
import { User as UserType } from '../types';

interface NavigationProps {
  currentUser: UserType;
}

const Navigation: React.FC<NavigationProps> = ({ currentUser }) => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/backlog', label: 'Product Backlog', icon: List },
    { path: '/planning', label: 'Sprint Planning', icon: Calendar },
    { path: '/sprint', label: 'Sprint Simulation', icon: Target },
    { path: '/final-results', label: 'Final Results', icon: TrendingUp },
    { path: '/data', label: 'Data Management', icon: Database },
    { path: '/storage-config', label: 'Storage Config', icon: Settings },
    { path: '/simulation', label: 'Old Simulation', icon: Play },
    { path: '/training', label: 'Training', icon: BookOpen },
    { path: '/results', label: 'Results', icon: BarChart3 }
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Scrum Simulator
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentUser.name}</span>
              <span className="mx-2">•</span>
              <span>{currentUser.role}</span>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 justify-center ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
