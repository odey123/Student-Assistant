"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useUniversity } from '../context/UniversityContext';
import styles from './UniversitySelector.module.css';

export default function UniversitySelector() {
  const { selectedUniversity, enabledUniversities, switchUniversity } = useUniversity();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleUniversitySelect = (universityId: string) => {
    switchUniversity(universityId);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Filter universities by search term
  const filteredUniversities = enabledUniversities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by country
  const groupedUniversities = filteredUniversities.reduce((acc, uni) => {
    if (!acc[uni.country]) {
      acc[uni.country] = [];
    }
    acc[uni.country].push(uni);
    return acc;
  }, {} as Record<string, typeof enabledUniversities>);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        type="button"
        className={styles.selectorButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select university"
        aria-expanded={isOpen ? "true" : "false"}
      >
        <div className={styles.selectedUniversity}>
          {selectedUniversity.logo && (
            <img
              src={selectedUniversity.logo}
              alt={`${selectedUniversity.shortName} logo`}
              className={styles.logo}
            />
          )}
          <div className={styles.universityInfo}>
            <span className={styles.universityName}>{selectedUniversity.shortName}</span>
            <span className={styles.universityCountry}>{selectedUniversity.country}</span>
          </div>
        </div>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchContainer}>
            <svg
              className={styles.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.universityList}>
            {Object.keys(groupedUniversities).length === 0 ? (
              <div className={styles.noResults}>No universities found</div>
            ) : (
              Object.entries(groupedUniversities).map(([country, unis]) => (
                <div key={country} className={styles.countryGroup}>
                  <div className={styles.countryHeader}>{country}</div>
                  {unis.map((uni) => (
                    <button
                      key={uni.id}
                      type="button"
                      className={`${styles.universityItem} ${
                        uni.id === selectedUniversity.id ? styles.selected : ''
                      }`}
                      onClick={() => handleUniversitySelect(uni.id)}
                    >
                      {uni.logo && (
                        <img
                          src={uni.logo}
                          alt={`${uni.shortName} logo`}
                          className={styles.universityLogo}
                        />
                      )}
                      <div className={styles.universityDetails}>
                        <span className={styles.itemName}>{uni.name}</span>
                        <span className={styles.itemShortName}>
                          {uni.shortName} • {uni.state || uni.country}
                        </span>
                      </div>
                      {uni.id === selectedUniversity.id && (
                        <svg
                          className={styles.checkmark}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          <div className={styles.dropdownFooter}>
            <span className={styles.footerText}>
              {enabledUniversities.length} {enabledUniversities.length === 1 ? 'university' : 'universities'} available
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
