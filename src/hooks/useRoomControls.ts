import { useState } from 'react';

type AddToastFn = (message: string, type?: 'success' | 'error' | 'warning') => void;

export function useRoomControls(addToast: AddToastFn) {
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  
  const toggleMicrophone = () => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    addToast(newMutedState ? "Microphone muted" : "Microphone activated", newMutedState ? 'warning' : 'success');
  };
  
  const toggleHandRaised = () => {
    const newHandRaisedState = !handRaised;
    setHandRaised(newHandRaisedState);
    addToast(newHandRaisedState ? "Hand raised" : "Hand lowered", 'success');
  };
  
  return {
    muted,
    setMuted,
    handRaised,
    setHandRaised,
    toggleMicrophone,
    toggleHandRaised
  };
} 