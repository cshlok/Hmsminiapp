import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Package, 
  FileText, 
  DollarSign, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { LogoutButton } from '../../auth/Login';

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  // Define navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/patients', label: 'Patients', icon: <Users size={20} /> },
    { path: '/appointments', label: 'Appointments', icon: <Calendar size={20} /> },
    { path: '/services', label: 'Services', icon: <Package size={20} /> },
    { path: '/quotes', label: 'Quotes', icon: <FileText size={20} /> },
    { path: '/billing', label: 'Billing', icon: <DollarSign size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-primary">Clinic Manager</h1>
          <button 
            className="p-1 rounded-md lg:hidden hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Sidebar footer */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
