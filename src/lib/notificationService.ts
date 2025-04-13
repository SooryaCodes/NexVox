import { Notification } from '@/components/NotificationPanel';
import { useState, useEffect } from 'react';

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'room_invite',
    title: 'Invite to Cyber Lounge',
    message: 'NeonRider invited you to join their room "Cyber Lounge"',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    actionUrl: '/rooms/42',
    sender: {
      name: 'NeonRider',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  {
    id: '2',
    type: 'user_joined',
    title: 'New member in Digital Dreamers',
    message: 'SynthWave88 joined your room "Digital Dreamers"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    actionUrl: '/rooms/15',
    sender: {
      name: 'SynthWave88'
    }
  },
  {
    id: '3',
    type: 'mention',
    title: 'You were mentioned',
    message: 'CyberPunk42 mentioned you in "Music Vibes": "Hey @user, check out this track!"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    read: true,
    actionUrl: '/rooms/33',
    sender: {
      name: 'CyberPunk42',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  },
  {
    id: '4',
    type: 'system',
    title: 'Welcome to NexVox!',
    message: 'Thanks for joining. Explore voice rooms and connect with others.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true
  },
  {
    id: '5',
    type: 'room_invite',
    title: 'Invite to Tech Talk',
    message: 'ByteMaster invited you to join their room "Tech Talk"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    read: true,
    actionUrl: '/rooms/27',
    sender: {
      name: 'ByteMaster',
      avatar: 'https://randomuser.me/api/portraits/men/68.jpg'
    }
  }
];

// Create a custom hook for handling notifications
export const useNotifications = () => {
  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Initialize notifications from mock data on first load
  useEffect(() => {
    // In a real app, you would fetch from an API
    setNotifications(mockNotifications);
    
    // Count unread notifications
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    
    // Persist to localStorage in a real app
    localStorage.setItem('nexvox-notifications', JSON.stringify(mockNotifications));
  }, []);

  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
      
      // Update localStorage in a real app
      localStorage.setItem('nexvox-notifications', JSON.stringify(updated));
      
      // Update unread count
      setUnreadCount(updated.filter(n => !n.read).length);
      
      return updated;
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      
      // Update localStorage in a real app
      localStorage.setItem('nexvox-notifications', JSON.stringify(updated));
      
      // Update unread count
      setUnreadCount(0);
      
      return updated;
    });
  };

  // Add a new notification (for testing)
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      
      // Update localStorage in a real app
      localStorage.setItem('nexvox-notifications', JSON.stringify(updated));
      
      // Update unread count
      setUnreadCount(updated.filter(n => !n.read).length);
      
      return updated;
    });
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };
};

export default useNotifications; 