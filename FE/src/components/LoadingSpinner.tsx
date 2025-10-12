"use client";

import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({ size = 'medium', color }: LoadingSpinnerProps) {
  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles.spinnerCircle} style={{ borderTopColor: color }}></div>
      <div className={styles.spinnerCircle} style={{ borderTopColor: color }}></div>
      <div className={styles.spinnerCircle} style={{ borderTopColor: color }}></div>
    </div>
  );
}
