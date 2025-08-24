const API_BASE_URL = import.meta.env.VITE_API_URL!;

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth
  async getCurrentUser() {
    return this.request('/auth/status');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Profiles
  async getProfile(userId: string) {
    return this.request(`/profiles/${userId}`);
  }

  async createApplicantProfile(profileData: any) {
    return this.request('/profiles/applicant', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async createRecruiterProfile(profileData: any) {
    return this.request('/profiles/recruiter', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateUserRole(role: 'recruiter' | 'applicant') {
    return this.request('/profiles/role', {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Projects
  async getRecruiterProjects(recruiterId: string) {
    return this.request(`/projects/recruiter/${recruiterId}`);
  }

  async createProject(projectData: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectId: string, projectData: any) {
    return this.request(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async getProjectCandidates(projectId: string) {
    return this.request(`/projects/${projectId}/candidates`);
  }

  async scheduleInterview(projectId: string, applicationId: string, interviewDate: string) {
    return this.request(`/projects/${projectId}/schedule-interview`, {
      method: 'POST',
      body: JSON.stringify({ applicationId, interviewDate }),
    });
  }

  async getActiveProjects() {
    return this.request('/projects/active');
  }

  // Applications
  async getApplicantApplications(applicantId: string) {
    return this.request(`/applications/applicant/${applicantId}`);
  }

  async applyToProject(projectId: string, coverLetter?: string) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId, cover_letter: coverLetter }),
    });
  }

  async getJobRecommendations(applicantId: string) {
    return this.request(`/applications/recommendations/${applicantId}`);
  }

  async updateApplicationStatus(applicationId: string, status: string, feedback?: string) {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback }),
    });
  }

  // Coaching
  async getCoachingRecommendations(userId: string) {
    return this.request(`/coaching/${userId}/recommendations`);
  }

  async updateSkillLevel(userId: string, skillName: string, level: number) {
    return this.request(`/coaching/${userId}/skills/${skillName}`, {
      method: 'PUT',
      body: JSON.stringify({ level }),
    });
  }

  async getLearningResources(userId: string, skillName: string) {
    return this.request(`/coaching/${userId}/resources/${skillName}`);
  }

  async getSkillAnalytics(userId: string) {
    return this.request(`/coaching/${userId}/analytics`);
  }

  // Notifications
  async getNotifications(userId: string) {
    return this.request(`/notifications/${userId}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.request(`/notifications/user/${userId}/read-all`, {
      method: 'PUT',
    });
  }

  async getUnreadNotificationCount(userId: string) {
    return this.request(`/notifications/${userId}/unread-count`);
  }
}

const apiService = new ApiService();
export default apiService;