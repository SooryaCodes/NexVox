/**
 * Utility functions for room creation and management
 */

// Types for room data
export interface RoomData {
  id: string;
  name: string;
  description: string;
  maxParticipants: number;
  isPublic: boolean;
  participantCount: number;
  type: 'music' | 'conversation' | 'gaming' | 'chill';
}

/**
 * Generates a random ID for a new room
 */
export const generateRoomId = (): string => {
  return Math.floor(Math.random() * 100000).toString();
};

/**
 * Generates a random 6-character code for room access
 */
export const generateRoomCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

/**
 * Creates a new room with the provided data and saves it to localStorage
 */
export const createRoom = (roomData: Omit<RoomData, 'id'>): RoomData => {
  // Generate a new room ID
  const newId = generateRoomId();
  
  // Create the new room object
  const newRoom: RoomData = {
    ...roomData,
    id: newId,
    participantCount: 1, // Starting with just the creator
  };
  
  // Save to localStorage
  try {
    const existingRooms = JSON.parse(localStorage.getItem('nexvoxRooms') || '[]');
    localStorage.setItem('nexvoxRooms', JSON.stringify([...existingRooms, newRoom]));
  } catch (error) {
    console.error('Error saving room to localStorage:', error);
  }
  
  return newRoom;
};

/**
 * Gets all rooms, combining default rooms with user-created ones
 */
export const getAllRooms = (defaultRooms: any[]): RoomData[] => {
  try {
    const storedRooms = JSON.parse(localStorage.getItem('nexvoxRooms') || '[]');
    return [...defaultRooms, ...storedRooms];
  } catch (error) {
    console.error('Error reading rooms from localStorage:', error);
    return defaultRooms;
  }
};

/**
 * Mock function to simulate joining a room
 */
export const joinRoom = (roomId: string): void => {
  console.log(`Joining room with ID: ${roomId}`);
  // In a real app, this would handle authentication, websocket connections, etc.
}; 