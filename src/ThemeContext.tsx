import React, { createContext, useContext, useState, useEffect } from 'react';

export type WorkbenchMode = 'dark' | 'light';

interface ThemeContextType {
  mode: WorkbenchMode;
  toggleMode: () => void;
  setMode: (mode: WorkbenchMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleMode: () => {},
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<WorkbenchMode>(() => {
    try {
      const saved = localStorage.getItem('detox_workbench_mode');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });

  const setMode = (newMode: WorkbenchMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('detox_workbench_mode', newMode);
    } catch {
      // ignore
    }
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
