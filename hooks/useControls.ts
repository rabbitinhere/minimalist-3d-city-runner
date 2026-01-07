
import { useEffect, useState } from 'react';
import { ControlState } from '../types';

export const useControls = () => {
  const [keys, setKeys] = useState<ControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': setKeys(k => ({ ...k, forward: true })); break;
        case 's': case 'arrowdown': setKeys(k => ({ ...k, backward: true })); break;
        case 'a': case 'arrowleft': setKeys(k => ({ ...k, left: true })); break;
        case 'd': case 'arrowright': setKeys(k => ({ ...k, right: true })); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': setKeys(k => ({ ...k, forward: false })); break;
        case 's': case 'arrowdown': setKeys(k => ({ ...k, backward: false })); break;
        case 'a': case 'arrowleft': setKeys(k => ({ ...k, left: false })); break;
        case 'd': case 'arrowright': setKeys(k => ({ ...k, right: false })); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};
