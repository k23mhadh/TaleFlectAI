import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';
import SideNavigation from './components/common/SideNavigation';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import BookProjects from './pages/BookProjects';
import BookCreation from './pages/BookCreation';
import BookEditor from './pages/BookEditor';
import BookPreview from './pages/BookPreview';
import UserProfile from './pages/Profile';
import Analytics from './pages/Analytics';
import Bookmarks from './pages/Bookmarks';
import NotFound from './pages/NotFound';

// Layouts
const AuthenticatedLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SideNavigation 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
      />
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {children}
      </div>
    </div>
  );
};

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {children}
    </div>
  );
};

// Main App Content
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          </PublicRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <BookProjects />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/new-project" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <BookCreation />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/createbook" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <BookCreation />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/editor/:id" 
        element={
          <ProtectedRoute>
            <BookEditor />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/preview/:id" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <BookPreview />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <UserProfile />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Analytics />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/bookmarks" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Bookmarks />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route 
        path="*" 
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        } 
      />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;