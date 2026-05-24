"use client"
import { useState } from 'react';
import { useArcadeNavigate } from '../useArcadeNavigate';
import WiresGame from './wires_game';
import arcadeStyles from '../page.module.css';
import styles from './page.module.css';

const chipStyles = {
  easy: styles.chipEasy,
  medium: styles.chipMedium,
  hard: styles.chipHard
};

function Wires() {
  const [difficulty, setDifficulty] = useState(null);
  const { isExiting, navigateBack } = useArcadeNavigate();

  const difficultyOptions = [
    { key: 'easy', label: 'Easy Drift', chip: 'Starter Grid' },
    { key: 'medium', label: 'Night Current', chip: 'Classic Wires' },
    { key: 'hard', label: 'Counting Sheep', chip: 'Stiff' }
  ];

  return (
    <div className={`${styles.container} ${isExiting ? arcadeStyles.zoomOutPage : ''}`}>
      {!difficulty ? (
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button className={arcadeStyles.backLink} onClick={navigateBack}>← CABINET</button>
          </div>
          <p className={styles.subtitle}>Insomniac Arcade</p>
          <h1 className={styles.title}>
            WIRES
          </h1>
          <p className={styles.description}></p>
          <div className={styles.grid}>
            {difficultyOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setDifficulty(option.key)}
                className={styles.button}
              >
                <div className={chipStyles[option.key]}>
                  {option.chip}
                </div>
                <div className={styles.buttonLabel}>{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <WiresGame difficulty={difficulty} onRestart={() => setDifficulty(null)} />
      )}
    </div>
  );
}

export default Wires;
