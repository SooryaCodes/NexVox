import { useState, useEffect } from 'react';
import { Room, User } from '@/types/room';
import roomsData from '@/app/data/rooms.json';
import usersDataRaw from '@/app/data/users.json';

// Cast the imported data to our defined types
const usersData = usersDataRaw as unknown as User[];

export function useRoomData(id: string | undefined) {
  const [roomId, setRoomId] = useState<number>(0);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSpeakers, setActiveSpeakers] = useState<number[]>([]);
  
  // Fetch room data
  useEffect(() => {
    if (roomId === 0) return;
    
    const fetchRoom = () => {
      const foundRoom = roomsData.find(r => r.id === roomId);
      if (foundRoom) {
        setRoom(foundRoom as Room);
      }
      setLoading(false);
    };
    
    // Simulate API call
    setTimeout(fetchRoom, 500);
  }, [roomId]);
  
  // Simulate active speakers
  useEffect(() => {
    const intervalId = setInterval(() => {
      const speakerCount = Math.floor(Math.random() * 3) + 1;
      const newActiveSpeakers: number[] = [];
      
      for (let i = 0; i < speakerCount; i++) {
        const randomIndex = Math.floor(Math.random() * usersData.length);
        if (!newActiveSpeakers.includes(randomIndex)) {
          newActiveSpeakers.push(randomIndex);
        }
      }
      
      setActiveSpeakers(newActiveSpeakers);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return {
    room,
    loading,
    users: usersData,
    roomId,
    setRoomId,
    activeSpeakers
  };
} 