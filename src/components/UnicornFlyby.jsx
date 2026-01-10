import { useState, useCallback } from 'react';
import './UnicornFlyby.css';

export function UnicornFlyby() {
  const [isVisible, setIsVisible] = useState(true);

  const handleAnimationEnd = useCallback(() => {
    setIsVisible(false);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="unicorn-flyby" aria-hidden="true" onAnimationEnd={handleAnimationEnd}>
      <div className="unicorn-rainbow" />
      <div className="unicorn-emoji">🦄</div>
    </div>
  );
}
