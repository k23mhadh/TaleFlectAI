import React, { createContext, useContext, useEffect, useReducer } from 'react';
import apiService from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const ActionTypes = {
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_LOADING: 'AUTH_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case ActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case ActionTypes.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case ActionTypes.AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          // Verify token is still valid
          const response = await apiService.getMe();
          if (response.success) {
            dispatch({
              type: ActionTypes.AUTH_SUCCESS,
              payload: {
                user: response.user,
                token: token,
              },
            });
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('refreshToken');
            dispatch({ type: ActionTypes.AUTH_LOGOUT });
          }
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
          dispatch({ type: ActionTypes.AUTH_LOGOUT });
        }
      } else {
        dispatch({ type: ActionTypes.AUTH_LOGOUT });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: ActionTypes.AUTH_LOADING });
      const response = await apiService.login(credentials);
      
      if (response.success) {
        dispatch({
          type: ActionTypes.AUTH_SUCCESS,
          payload: {
            user: response.user,
            token: response.token,
          },
        });
        return response;
      } else {
        dispatch({
          type: ActionTypes.AUTH_FAILURE,
          payload: response.error || 'Login failed',
        });
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: ActionTypes.AUTH_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: ActionTypes.AUTH_LOADING });
      const response = await apiService.register(userData);
      
      if (response.success) {
        dispatch({
          type: ActionTypes.AUTH_SUCCESS,
          payload: {
            user: response.user,
            token: response.token,
          },
        });
        return response;
      } else {
        dispatch({
          type: ActionTypes.AUTH_FAILURE,
          payload: response.error || 'Registration failed',
        });
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({
        type: ActionTypes.AUTH_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: ActionTypes.AUTH_LOGOUT });
    }
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({
      type: ActionTypes.UPDATE_USER,
      payload: userData,
    });
    
    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...userData }));
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const response = await apiService.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (token, password) => {
    try {
      dispatch({ type: ActionTypes.AUTH_LOADING });
      const response = await apiService.resetPassword(token, password);
      
      if (response.success) {
        dispatch({
          type: ActionTypes.AUTH_SUCCESS,
          payload: {
            user: response.user,
            token: response.token,
          },
        });
      }
      
      return response;
    } catch (error) {
      dispatch({
        type: ActionTypes.AUTH_FAILURE,
        payload: error.message || 'Password reset failed',
      });
      throw error;
    }
  };

  // Update password function
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await apiService.updatePassword(currentPassword, newPassword);
      
      if (response.success) {
        // Update token if provided
        if (response.token) {
          apiService.setToken(response.token);
          dispatch({
            type: ActionTypes.UPDATE_USER,
            payload: response.user,
          });
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    forgotPassword,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;