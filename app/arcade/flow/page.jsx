"use client"
import { useState } from 'react';
import FlowGame from './flow_game';
import styles from './page.module.css';

const chipStyles = {
  easy: styles.chipEasy,
  medium: styles.chipMedium,
};

function Flow() {
  const [difficulty, setDifficulty] = useState(null);

  const difficultyOptions = [
    { key: 'easy', label: 'Easy Drift', chip: 'Starter Grid' },
    { key: 'medium', label: 'Night Current', chip: 'Classic Flow' }
  ];

  return (
    <div className={styles.container}>
      {!difficulty ? (
        <div className={styles.card}>
          <p className={styles.subtitle}>Insomniac Arcade</p>
          <h1 className={styles.title}>
            FLOW WIRES
          </h1>
          <p className={styles.description}>Connect matching nodes. Every stroke is drawn in real time.</p>
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
        <FlowGame difficulty={difficulty} onRestart={() => setDifficulty(null)} />
      )}
    </div>
  );
}

export default Flow;