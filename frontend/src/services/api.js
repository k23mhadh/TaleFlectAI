const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Helper method to make HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType && contentType.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }

      if (!response.ok) {
        const error = new Error(data?.error || data?.message || 'Something went wrong');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.status === 401) {
        // Token expired or invalid
        this.clearAuth();
        window.location.href = '/';
      }
      throw error;
    }
  }

  // Authentication methods
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearAuth() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Auth endpoints
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  }

  async updatePassword(currentPassword, newPassword) {
    return this.request('/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.request('/users/avatar', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async deleteAvatar() {
    return this.request('/users/avatar', { method: 'DELETE' });
  }

  async updateReadingPreferences(preferences) {
    return this.request('/users/reading-preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async updateAccountSettings(settings) {
    return this.request('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getUserStatistics() {
    return this.request('/users/statistics');
  }

  async getUserActivity(page = 1, limit = 20) {
    return this.request(`/users/activity?page=${page}&limit=${limit}`);
  }

  // Book endpoints
  async getBooks(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    return this.request(`/books${queryString ? `?${queryString}` : ''}`);
  }

  async getBook(id) {
    return this.request(`/books/${id}`);
  }

  async createBook(bookData) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id, bookData) {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id) {
    return this.request(`/books/${id}`, { method: 'DELETE' });
  }

  // Chapter endpoints
  async addChapter(bookId, chapterData) {
    return this.request(`/books/${bookId}/chapters`, {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  }

  async updateChapter(bookId, chapterId, chapterData) {
    return this.request(`/books/${bookId}/chapters/${chapterId}`, {
      method: 'PUT',
      body: JSON.stringify(chapterData),
    });
  }

  async deleteChapter(bookId, chapterId) {
    return this.request(`/books/${bookId}/chapters/${chapterId}`, {
      method: 'DELETE',
    });
  }

  async reorderChapters(bookId, chapterOrder) {
    return this.request(`/books/${bookId}/chapters/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ chapterOrder }),
    });
  }

  // Image endpoints
  async uploadBookCover(bookId, file) {
    const formData = new FormData();
    formData.append('cover', file);
    
    return this.request(`/books/${bookId}/cover`, {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  async uploadBookImage(bookId, file, caption = '', altText = '') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    formData.append('altText', altText);
    
    return this.request(`/books/${bookId}/images`, {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  async deleteBookImage(bookId, imageId) {
    return this.request(`/books/${bookId}/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  // Publishing endpoints
  async publishBook(bookId, visibility = 'public') {
    return this.request(`/books/${bookId}/publish`, {
      method: 'POST',
      body: JSON.stringify({ visibility }),
    });
  }

  async createBookVersion(bookId, changes = '') {
    return this.request(`/books/${bookId}/versions`, {
      method: 'POST',
      body: JSON.stringify({ changes }),
    });
  }

  // AI endpoints
  async generateChapter(bookId, chapterId, prompt = '', creativity = 0.7) {
    return this.request(`/ai/generate-chapter/${bookId}/${chapterId}`, {
      method: 'POST',
      body: JSON.stringify({ prompt, creativity }),
    });
  }

  async generateOutline(bookId, prompt = '') {
    return this.request(`/ai/generate-outline/${bookId}`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async generateCharacter(bookId, characterName, role, prompt = '') {
    return this.request(`/ai/generate-character/${bookId}`, {
      method: 'POST',
      body: JSON.stringify({ characterName, role, prompt }),
    });
  }

  async generateDialogue(bookId, characters, scene, tone = 'natural') {
    return this.request(`/ai/generate-dialogue/${bookId}`, {
      method: 'POST',
      body: JSON.stringify({ characters, scene, tone }),
    });
  }

  async improveContent(bookId, content, instruction) {
    return this.request(`/ai/improve-content/${bookId}`, {
      method: 'POST',
      body: JSON.stringify({ content, instruction }),
    });
  }

  async getAIUsage() {
    return this.request('/ai/usage');
  }

  // Export endpoints
  async exportBook(bookId, format, options = {}) {
    const response = await fetch(`${this.baseURL}/export/${bookId}/${format}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Export failed');
    }

    // Return blob for file download
    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `book.${format}`;

    return { blob, filename };
  }

  async getExportPreview(bookId) {
    return this.request(`/export/${bookId}/preview`);
  }

  async getExportFormats() {
    return this.request('/export/formats');
  }

  // Utility methods
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;