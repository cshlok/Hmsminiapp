import React from 'react';
import { Settings, User, FileText, CreditCard, Database, RefreshCw } from 'lucide-react';

interface SettingsLayoutProps {
  activeTab: 'clinic' | 'preferences' | 'tax' | 'backup';
  onTabChange: (tab: 'clinic' | 'preferences' | 'tax' | 'backup') => void;
  onResetSettings: () => void;
  error: string | null;
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  activeTab,
  onTabChange,
  onResetSettings,
  error,
  children,
}) => {
  // Define tabs
  const tabs = [
    { id: 'clinic', label: 'Clinic Information', icon: <Settings size={18} /> },
    { id: 'preferences', label: 'User Preferences', icon: <User size={18} /> },
    { id: 'tax', label: 'Tax Settings', icon: <CreditCard size={18} /> },
    { id: 'backup', label: 'Backup & Restore', icon: <Database size={18} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow">
          <nav className="p-4">
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => onTabChange(tab.id as 'clinic' | 'preferences' | 'tax' | 'backup')}
                    className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t">
              <button
                onClick={onResetSettings}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <RefreshCw size={18} className="mr-3" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
