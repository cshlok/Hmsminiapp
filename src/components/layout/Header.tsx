import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAppSelector } from '../../store';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { clinicInfo } = useAppSelector(state => state.settings);
  
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6">
      {/* Left side - Mobile menu button and clinic name */}
      <div className="flex items-center">
        <button
          className="p-1 mr-4 rounded-md lg:hidden hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-800">{clinicInfo.name}</h1>
        </div>
      </div>
      
      {/* Right side - Notifications and user profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-1 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* User profile */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="font-medium text-sm">A</span>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
