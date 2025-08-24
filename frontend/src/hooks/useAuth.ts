import { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  user_id: string;
  role: 'recruiter' | 'applicant';
  full_name: string | null;
  company: string | null;
  job_title: string | null;
  bio: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  created_at: string;
  updated_at: string;
}

interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
}

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        if (userData) {
          await fetchUserProfile(userData._id);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signInWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const createProfile = async (role: 'recruiter' | 'applicant', additionalData?: {
    full_name?: string;
    company?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          role,
          ...additionalData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const profileData = await response.json();
      setProfile(profileData);
      
      return profileData;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        credentials: 'include'
      });
      setUser(null);
      setProfile(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    createProfile,
    signOut,
    isAuthenticated: !!user,
    hasProfile: !!profile
  };
};