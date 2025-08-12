import React, { useState, useEffect } from 'react';
import { hybridStorage, HybridStorageConfig, StorageMode } from '../utils/hybridStorage';
import { Cloud, HardDrive, Sync, CheckCircle, AlertCircle, Settings, ExternalLink } from 'lucide-react';
import { User } from '../types';

const StorageConfig: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<StorageMode>('local');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [cloudConfig, setCloudConfig] = useState({
    provider: 'firebase' as const,
    apiKey: '',
    projectId: '',
    databaseUrl: '',
    authDomain: ''
  });

  useEffect(() => {
    // Load current storage configuration
    const storageInfo = hybridStorage.getStorageInfo();
    setCurrentMode(storageInfo.mode);
  }, []);

  const handleModeChange = async (mode: StorageMode) => {
    setIsLoading(true);
    setStatus(null);

    try {
      const config: HybridStorageConfig = {
        mode,
        cloudConfig: mode !== 'local' ? cloudConfig : undefined,
        syncInterval: 30000,
        enableOfflineMode: true
      };

      await hybridStorage.initialize(config);
      setCurrentMode(mode);
      setStatus({
        type: 'success',
        message: `Storage mode changed to ${mode} successfully!`
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Failed to change storage mode: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCloudConnection = async () => {
    setIsLoading(true);
    setStatus(null);

    try {
      const config: HybridStorageConfig = {
        mode: 'cloud',
        cloudConfig,
        syncInterval: 30000,
        enableOfflineMode: true
      };

      await hybridStorage.initialize(config);
      
      // Test actual data operations
      const testUser: User = {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Developer',
        permissions: []
      };
      
      await hybridStorage.saveUser(testUser);
      const users = await hybridStorage.getUsers();
      await hybridStorage.deleteProject('test-project'); // Clean up any test data
      
      setStatus({
        type: 'success',
        message: 'Cloud connection test successful! Data operations working correctly.'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Cloud connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStorageInfo = () => {
    return hybridStorage.getStorageInfo();
  };

  const storageModes = [
    {
      id: 'local' as StorageMode,
      name: 'Local Storage',
      description: 'Store data in your browser (5MB limit)',
      icon: HardDrive,
      pros: ['Fast access', 'Works offline', 'No setup required'],
      cons: ['Limited storage', 'Data lost if browser cleared', 'No cross-device sync']
    },
    {
      id: 'cloud' as StorageMode,
      name: 'Cloud Storage',
      description: 'Store data in the cloud (unlimited storage)',
      icon: Cloud,
      pros: ['Unlimited storage', 'Cross-device sync', 'Data backup', 'Team collaboration'],
      cons: ['Requires internet', 'Setup required', 'Potential costs']
    },
    {
      id: 'hybrid' as StorageMode,
      name: 'Hybrid Storage',
      description: 'Best of both worlds - local + cloud sync',
      icon: Sync,
      pros: ['Works offline', 'Automatic sync', 'Data backup', 'Fast local access'],
      cons: ['Setup required', 'Potential sync conflicts', 'More complex']
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Storage Configuration</h1>
        <p className="text-gray-600 mt-2">Choose how your Scrum Simulator data is stored</p>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Current Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600 capitalize">{currentMode}</div>
            <div className="text-sm text-gray-600">Storage Mode</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">
              {getStorageInfo().cloudConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="text-sm text-gray-600">Cloud Status</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">
              {Math.round(getStorageInfo().localSize / 1024)} KB
            </div>
            <div className="text-sm text-gray-600">Local Data Size</div>
          </div>
        </div>
      </div>

      {/* Storage Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storageModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <div
              key={mode.id}
              className={`bg-white rounded-lg shadow p-6 border-2 transition-all ${
                isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-4">
                <Icon className={`w-8 h-8 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mode.name}</h3>
                  <p className="text-sm text-gray-600">{mode.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-1">Pros:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {mode.pros.map((pro, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-1">Cons:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {mode.cons.map((con, index) => (
                      <li key={index} className="flex items-center">
                        <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleModeChange(mode.id)}
                disabled={isLoading || isActive}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white cursor-default'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isActive ? 'Current Mode' : 'Switch to This Mode'}
              </button>
            </div>
          );
        })}
      </div>

             {/* Cloud Configuration */}
       {(currentMode === 'cloud' || currentMode === 'hybrid') && (
         <div className="bg-white rounded-lg shadow p-6">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-semibold text-gray-900">Cloud Configuration</h2>
             <a 
               href="https://console.firebase.google.com/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
             >
               <ExternalLink className="w-4 h-4 mr-1" />
               Firebase Console
             </a>
           </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <select
                value={cloudConfig.provider}
                onChange={(e) => setCloudConfig({ ...cloudConfig, provider: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="firebase">Firebase</option>
                <option value="supabase">Supabase</option>
                <option value="custom">Custom API</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={cloudConfig.apiKey}
                onChange={(e) => setCloudConfig({ ...cloudConfig, apiKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project ID
              </label>
              <input
                type="text"
                value={cloudConfig.projectId}
                onChange={(e) => setCloudConfig({ ...cloudConfig, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Database URL
              </label>
              <input
                type="url"
                value={cloudConfig.databaseUrl}
                onChange={(e) => setCloudConfig({ ...cloudConfig, databaseUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-project.firebaseio.com"
              />
            </div>
          </div>

                     <div className="flex space-x-4">
             <button
               onClick={testCloudConnection}
               disabled={isLoading}
               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
             >
               Test Connection
             </button>
             
             <button
               onClick={() => handleModeChange(currentMode)}
               disabled={isLoading}
               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
             >
               Apply Configuration
             </button>
           </div>
           
           <div className="mt-4 p-4 bg-blue-50 rounded-lg">
             <h3 className="text-sm font-medium text-blue-900 mb-2">Firebase Setup Instructions</h3>
             <p className="text-sm text-blue-800 mb-2">
               Need help setting up Firebase? Check the detailed setup guide:
             </p>
             <a 
               href="FIREBASE_SETUP.md" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-sm text-blue-600 hover:text-blue-800 underline"
             >
               📖 Firebase Setup Guide
             </a>
           </div>
        </div>
      )}

      {/* Status Messages */}
      {status && (
        <div className={`p-4 rounded-lg ${
          status.type === 'success' ? 'bg-green-50 border border-green-200' :
          status.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {status.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            ) : status.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            ) : (
              <Settings className="w-5 h-5 text-blue-600 mr-2" />
            )}
            <span className={`text-sm ${
              status.type === 'success' ? 'text-green-800' :
              status.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {status.message}
            </span>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Processing...</p>
        </div>
      )}
    </div>
  );
};

export default StorageConfig;
