import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Book, 
  PlusCircle, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SideNavigation = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      description: 'Overview of your books and activity'
    },
    {
      name: 'My Books',
      path: '/projects',
      icon: Book,
      description: 'Manage your book projects'
    },
    {
      name: 'Create Book',
      path: '/new-project',
      icon: PlusCircle,
      description: 'Start a new book project'
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      description: 'View your writing statistics'
    },
    {
      name: 'Bookmarks',
      path: '/bookmarks',
      icon: Bookmark,
      description: 'Your saved references'
    }
  ];

  const bottomItems = [
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      description: 'Manage your profile'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      description: 'Account settings'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-30 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Book size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">TaleFlect</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={isCollapsed ? item.description : ''}
              >
                <IconComponent
                  className={`flex-shrink-0 h-5 w-5 ${
                    active ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
                {!isCollapsed && active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Items */}
        <div className="px-2 py-4 border-t border-gray-700 space-y-1">
          {bottomItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={isCollapsed ? item.description : ''}
              >
                <IconComponent
                  className={`flex-shrink-0 h-5 w-5 ${
                    active ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
            {!isCollapsed && (
              <span className="ml-3 truncate">Logout</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;