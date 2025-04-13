import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { IoClose, IoCheckmarkDone } from 'react-icons/io5';
import { FiUsers, FiMusic, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

export interface Notification {
  id: string;
  type: 'room_invite' | 'user_joined' | 'system' | 'mention';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkAsRead
}) => {
  // Group notifications by date (Today, Yesterday, Earlier)
  const groupedNotifications = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return notifications.reduce((groups, notification) => {
      const notifDate = new Date(notification.timestamp);
      
      let group = 'Earlier';
      if (notifDate.toDateString() === today.toDateString()) {
        group = 'Today';
      } else if (notifDate.toDateString() === yesterday.toDateString()) {
        group = 'Yesterday';
      }
      
      if (!groups[group]) {
        groups[group] = [];
      }
      
      groups[group].push(notification);
      return groups;
    }, {} as Record<string, Notification[]>);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'room_invite':
        return <FiUsers className="text-[#00FFFF]" />;
      case 'user_joined':
        return <FiUsers className="text-[#9D00FF]" />;
      case 'mention':
        return <FiMusic className="text-[#FF00E6]" />;
      case 'system':
      default:
        return <FiInfo className="text-white" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // If there's an action URL, let the link handle navigation
    if (!notification.actionUrl) {
      onClose();
    }
  };

  const groups = groupedNotifications();
  const groupKeys = Object.keys(groups);
  const hasUnread = notifications.some(n => !n.read);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          {/* Invisible overlay to capture clicks outside panel */}
          <m.div 
            className="fixed inset-0 bg-transparent" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Notification panel */}
          <m.div
            className="fixed top-[73px] right-4 w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.2)] overflow-hidden z-10"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-orbitron text-xl text-[#00FFFF]">Notifications</h2>
              <div className="flex items-center gap-2">
                {hasUnread && (
                  <button 
                    onClick={onMarkAllRead}
                    className="text-xs px-2 py-1 text-white/70 hover:text-[#00FFFF] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-[#FF00E6] hover:bg-white/10 transition-colors"
                >
                  <IoClose />
                </button>
              </div>
            </div>
            
            {/* Notification list */}
            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center mb-4">
                    <FiInfo className="w-8 h-8 text-white/30" />
                  </div>
                  <p className="text-white/50">No notifications</p>
                </div>
              ) : (
                <div>
                  {groupKeys.map(group => (
                    groups[group].length > 0 && (
                      <div key={group}>
                        <div className="px-4 py-2 bg-black/40 text-white/50 text-xs uppercase tracking-wider">
                          {group}
                        </div>
                        
                        {groups[group].map(notification => (
                          <div 
                            key={notification.id}
                            className={`relative px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-[#00FFFF]/5' : ''}`}
                          >
                            {!notification.read && (
                              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00FFFF]"></div>
                            )}
                            
                            <div className="flex">
                              <div className="mr-3 mt-1 p-2 bg-black/40 rounded-md border border-white/10">
                                {getNotificationIcon(notification.type)}
                              </div>
                              
                              <div className="flex-1">
                                {notification.actionUrl ? (
                                  <Link 
                                    href={notification.actionUrl}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="block group"
                                  >
                                    <h3 className="font-medium text-white group-hover:text-[#00FFFF] transition-colors">{notification.title}</h3>
                                    <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-white/40 text-xs">{formatTime(notification.timestamp)}</span>
                                      {notification.read && (
                                        <IoCheckmarkDone className="text-[#00FFFF]" />
                                      )}
                                    </div>
                                  </Link>
                                ) : (
                                  <div onClick={() => handleNotificationClick(notification)} className="cursor-pointer group">
                                    <h3 className="font-medium text-white group-hover:text-[#00FFFF] transition-colors">{notification.title}</h3>
                                    <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-white/40 text-xs">{formatTime(notification.timestamp)}</span>
                                      {notification.read && (
                                        <IoCheckmarkDone className="text-[#00FFFF]" />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Helper function to format timestamp
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default NotificationPanel; 