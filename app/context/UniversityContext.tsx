"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { University, universities, getUniversityById, getEnabledUniversities } from '../config/universities';

interface UniversityContextType {
  selectedUniversity: University;
  setSelectedUniversity: (university: University) => void;
  enabledUniversities: University[];
  switchUniversity: (universityId: string) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

export function UniversityProvider({ children }: { children: ReactNode }) {
  // Always start with default university to avoid hydration mismatch
  const [selectedUniversity, setSelectedUniversityState] = useState<University>(
    getEnabledUniversities()[0] || universities[0]
  );
  const [isClient, setIsClient] = useState(false);

  const enabledUniversities = getEnabledUniversities();

  // Load from localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('selected-university-id');
    if (saved) {
      const uni = getUniversityById(saved);
      if (uni && uni.enabled) {
        setSelectedUniversityState(uni);
      }
    }
  }, []);

  const setSelectedUniversity = (university: University) => {
    if (!university.enabled) {
      console.warn(`Cannot select ${university.name} - not enabled`);
      return;
    }
    setSelectedUniversityState(university);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected-university-id', university.id);
    }
  };

  const switchUniversity = (universityId: string) => {
    const university = getUniversityById(universityId);
    if (university) {
      setSelectedUniversity(university);
    }
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  };

  // Update CSS variables when university changes
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedUniversity) {
      document.documentElement.style.setProperty('--university-primary', selectedUniversity.colors.primary);
      document.documentElement.style.setProperty('--university-secondary', selectedUniversity.colors.secondary);
      document.documentElement.style.setProperty('--university-accent', selectedUniversity.colors.accent);
      document.documentElement.style.setProperty('--university-primary-rgb', hexToRgb(selectedUniversity.colors.primary));
    }
  }, [selectedUniversity]);

  return (
    <UniversityContext.Provider
      value={{
        selectedUniversity,
        setSelectedUniversity,
        enabledUniversities,
        switchUniversity
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
}
