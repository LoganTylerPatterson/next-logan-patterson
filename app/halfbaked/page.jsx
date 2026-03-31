'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const EXPERIMENTS = [
  {
    id: 'sankey',
    title: 'BUDGET SANKEY',
    desc: 'Financial flow visualization. Where does the money go?',
    status: 'shipped',
    color: '#0a1a10',
    rotate: '1.5deg',
    href: '/sankey',
    external: false,
  },
  {
    id: 'graph',
    title: '3D GRAPH SHADER',
    desc: 'WebGL real-time rendering. Particles, depth, vibes.',
    status: 'shipped',
    color: '#0a0f1f',
    rotate: '-1.5deg',
    href: 'https://graph-six-rho.vercel.app/',
    external: true,
  },
  {
    id: 'branches',
    title: 'BRANCHES',
    desc: 'Data explorer. Still figuring out what it wants to be.',
    status: '~70% baked',
    color: '#1a0e00',
    rotate: '2deg',
    href: '/branches',
    external: false,
  },
  {
    id: 'tetris',
    title: 'TETRIS',
    desc: 'Classic block stacker. Pieces fall, lines don\'t clear yet.',
    status: '~35% baked',
    color: '#1a1500',
    rotate: '-2deg',
    href: null,
  },
  {
    id: 'shader',
    title: 'RAYMARCHING',
    desc: 'Signed distance fields in GLSL. The math is cooked, the scene is not.',
    status: 'just vibes rn',
    color: '#120a1a',
    rotate: '-1deg',
    href: null,
  },
  {
    id: 'empty',
    title: '???',
    desc: '...',
    status: '0% baked',
    color: null,
    rotate: '-0.5deg',
    href: null,
    empty: true,
  },
]

export default function HalfBakedPage() {
  const router = useRouter()
  const [exiting, setExiting] = useState(false)
  const exitingRef = useRef(false)

  const handleBack = () => {
    if (exitingRef.current) return
    exitingRef.current = true
    setExiting(true)
    sessionStorage.setItem('tvSkipBoot', '1')
    setTimeout(() => router.push('/'), 430)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') handleBack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <main className={styles.room}>
      <div className={`${styles.board} ${exiting ? styles.exitRight : styles.enterRight}`}>

        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>← BACK</button>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>HALF BAKED</h1>
            <p className={styles.subtitle}>experiments &amp; works in progress</p>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.wip}>⚠ WIP</span>
          </div>
        </div>

        <div className={styles.grid}>
          {EXPERIMENTS.map((exp) => (
            <div
              key={exp.id}
              className={`${styles.card} ${exp.empty ? styles.cardEmpty : ''}`}
              style={{
                background: exp.color || undefined,
                transform: `rotate(${exp.rotate})`,
              }}
            >
              <div className={styles.pin} />
              <h2 className={styles.cardTitle}>{exp.title}</h2>
              <p className={styles.cardDesc}>{exp.desc}</p>
              <div className={styles.cardFooter}>
                <span className={styles.badge}>{exp.status}</span>
                {exp.href && (
                  exp.external
                    ? <a href={exp.href} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>open ↗</a>
                    : <a href={exp.href} className={styles.cardLink}>open →</a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span>ESC to go back</span>
        </div>

      </div>
    </main>
  )
}
