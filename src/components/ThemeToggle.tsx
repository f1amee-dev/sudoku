import React, { useEffect, useState } from 'react';
import { Toggle } from '@/components/ui/toggle';

export const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Apply theme on initial load
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);
  
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };
  
  return (
    <Toggle
      pressed={isDarkMode}
      onPressedChange={toggleTheme}
      aria-label="Toggle dark mode"
      className="fixed top-4 right-4"
    >
      {isDarkMode ? '🌙' : '☀️'}
    </Toggle>
  );
}; 