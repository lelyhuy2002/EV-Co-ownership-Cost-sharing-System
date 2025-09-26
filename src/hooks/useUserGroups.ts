"use client";

import { useState, useEffect } from 'react';

interface UserGroup {
  id: string;
  name: string;
  role: 'admin' | 'member';
  ownership: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  groups: UserGroup[];
  hasGroups: boolean;
  role?: 'admin' | 'coowner' | 'member';
}

// Mock hook to simulate user authentication and group membership
export function useUserGroups() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to get user profile and groups
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data - in real app, this would come from your auth system
        const mockUser: UserProfile = {
          id: 'user-123',
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          groups: [], // Empty groups array simulates new user
          hasGroups: false
        ,
        // For demo we default to coowner; change to 'admin' to simulate admin user
        role: 'coowner'
      };
        
        // For demo purposes, you can modify this to simulate different scenarios:
        // - New user (no groups): groups: []
        // - User with groups: groups: [{ id: 'grp-01', name: 'EV Shared Hanoi', role: 'admin', ownership: 25 }]
        
        setUser(mockUser);
        setError(null);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const joinGroup = async (groupId: string, message?: string) => {
    try {
      // Simulate API call to join group
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, this would make an API call to join the group
      console.log(`Joining group ${groupId} with message: ${message}`);
      
      // For demo, we'll just show success
      return { success: true, message: 'Join request sent successfully' };
    } catch (err) {
      console.error('Error joining group:', err);
      return { success: false, message: 'Failed to send join request' };
    }
  };

  const createGroup = async (groupData: any) => {
    try {
      // Simulate API call to create group
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would make an API call to create the group
      console.log('Creating group with data:', groupData);
      
      return { success: true, groupId: 'new-group-id' };
    } catch (err) {
      console.error('Error creating group:', err);
      return { success: false, message: 'Failed to create group' };
    }
  };

  return {
    user,
    loading,
    error,
    joinGroup,
    createGroup,
    hasGroups: user?.hasGroups ?? false,
    isNewUser: user?.groups.length === 0,
    isAdmin: user?.role === 'admin'
  };
}
