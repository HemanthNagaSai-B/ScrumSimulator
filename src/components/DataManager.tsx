import React, { useState, useEffect } from 'react';
import { storage, StorageData } from '../utils/storage';
import { Download, Upload, Trash2, Database, HardDrive, AlertTriangle } from 'lucide-react';

const DataManager: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<{ used: number; available: number; percentage: number }>({ used: 0, available: 0, percentage: 0 });
  const [projects, setProjects] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<string>('');

  useEffect(() => {
    updateStorageInfo();
    loadProjects();
  }, []);

  const updateStorageInfo = () => {
    const info = storage.getStorageInfo();
    setStorageInfo(info);
  };

  const loadProjects = () => {
    const savedProjects = storage.getProjects();
    setProjects(savedProjects);
  };

  const exportData = () => {
    const data = storage.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `scrum-simulator-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importDataFromFile = () => {
    try {
      const parsedData: StorageData = JSON.parse(importData);
      storage.importData(parsedData);
      updateStorageInfo();
      loadProjects();
      setShowImportModal(false);
      setImportData('');
      alert('Data imported successfully!');
    } catch (error) {
      alert('Invalid data format. Please check your file.');
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      storage.clearAllData();
      updateStorageInfo();
      loadProjects();
      alert('All data has been cleared.');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
        <p className="text-gray-600 mt-2">Manage your saved projects and data</p>
      </div>

      {/* Storage Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <HardDrive className="w-5 h-5 mr-2" />
          Storage Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatBytes(storageInfo.used)}</div>
            <div className="text-sm text-gray-600">Used Space</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{formatBytes(storageInfo.available)}</div>
            <div className="text-sm text-gray-600">Available Space</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStorageColor(storageInfo.percentage)}`}>
              {storageInfo.percentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Usage</div>
          </div>
        </div>

        {/* Storage Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                storageInfo.percentage < 50 ? 'bg-green-600' :
                storageInfo.percentage < 80 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {storageInfo.percentage > 80 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 text-sm">
              Storage usage is high. Consider exporting data or clearing old projects.
            </span>
          </div>
        )}
      </div>

      {/* Projects Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Projects Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {projects.filter(p => p.status === 'Completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed Projects</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {projects.filter(p => p.status === 'On Hold').length}
            </div>
            <div className="text-sm text-gray-600">On Hold</div>
          </div>
        </div>
      </div>

      {/* Data Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportData}
            className="flex items-center justify-center space-x-2 p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Download className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-medium">Export Data</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center justify-center space-x-2 p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Upload className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">Import Data</span>
          </button>

          <button
            onClick={clearAllData}
            className="flex items-center justify-center space-x-2 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-medium">Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Import Data</h2>
            <p className="text-gray-600 mb-4">
              Paste your exported JSON data here to restore your projects and settings.
            </p>
            
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your JSON data here..."
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportData('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={importDataFromFile}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManager;
