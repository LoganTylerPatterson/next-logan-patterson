import React from 'react';
import styles from './Banner.module.css';

export function Banner({ type, children }) {
	const typeClass = type ? styles[type] : '';
	
	return (
		<div className={`${styles.banner} ${typeClass}`}>
			{children}
		</div>
	);
}
