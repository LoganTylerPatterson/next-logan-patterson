'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const GAMES = [
  {
    id: 'wires',
    num: '01',
    title: 'WIRES',
    genre: 'PUZZLE · SIMULATION',
    blurb: 'CONNECT THE DOTS. FILL THE BOARD.',
    href: '/arcade/wires',
    credits: 1,
    available: true,
  },
  {
    id: 'flappy',
    num: '01',
    title: 'FLAPPY',
    genre: 'ARCADE · SKILL',
    blurb: 'RECOMMENDED FOR PHONES, AND THOSE OF SOUND MIND',
    href: '/arcade/flappy',
    credits: 1,
    available: true,
  },
  {
    id: 'tetris',
    num: '02',
    title: 'TETRIS',
    genre: 'ARCADE · PUZZLE',
    blurb: 'FIT THE FALLING BLOCKS. CLEAR THE LINES.',
    href: '/tetris',
    credits: 1,
    available: false,
  },
  {
    id: 'locked2',
    num: '??',
    title: '[ CLASSIFIED ]',
    genre: '??? · ???',
    blurb: 'COIN SLOT JAMMED. TRY AGAIN LATER.',
    href: null,
    credits: 0,
    available: false,
  },
]

export default function ArcadePage() {
  const router = useRouter()
  const [gameIdx, setGameIdx] = useState(0)
  const [flashing, setFlashing] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [zooming, setZooming] = useState(false)
  const [enterAnim, setEnterAnim] = useState('fromRight')
  const flashingRef = useRef(false)
  const idxRef = useRef(0)
  const exitingRef = useRef(false)
  // ...
  useEffect(() => {
    const fromGame = sessionStorage.getItem('arcadeBackFromGame')
    if (fromGame) {
      sessionStorage.removeItem('arcadeBackFromGame')
      setEnterAnim('fromGame')
    }
  }, [])

  const changeGame = (dir) => {
    if (flashingRef.current || exitingRef.current) return
    flashingRef.current = true
    setFlashing(true)
    setTimeout(() => {
      const next = (idxRef.current + dir + GAMES.length) % GAMES.length
      idxRef.current = next
      setGameIdx(next)
      flashingRef.current = false
      setFlashing(false)
    }, 200)
  }

  const handleBack = () => {
    if (exitingRef.current) return
    exitingRef.current = true
    setExiting(true)
    sessionStorage.setItem('tvSkipBoot', '1')
    setTimeout(() => router.push('/'), 430)
  }

  const handlePlay = (href) => {
    if (exitingRef.current) return
    exitingRef.current = true
    setZooming(true)
    setTimeout(() => router.push(href), 800)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') changeGame(1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') changeGame(-1)
      if (e.key === 'Enter') {
        const game = GAMES[idxRef.current]
        if (game.available) handlePlay(game.href)
      }
      if (e.key === 'Escape' || e.key === 'Backspace') handleBack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const game = GAMES[gameIdx]

  const cabinetClass = [
    styles.cabinet,
    zooming ? styles.zoomIntoScreen : (
      exiting ? styles.exitRight : (
        enterAnim === 'fromGame' ? styles.enterZoom : styles.enterRight
      )
    )
  ].join(' ')

  return (
    <main className={styles.room}>
      <div className={cabinetClass}>

        {/* Marquee */}
        <div className={styles.marquee}>
          <span className={styles.marqueeText}>INSOMNIAC ARCADE</span>
          <div className={styles.marqueeLights}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={styles.bulb} style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        </div>

        {/* Cabinet body */}
        <div className={styles.cabinetBody}>

          {/* Screen */}
          <div className={`${styles.screen} ${flashing ? styles.flash : ''}`}>
            <div className={styles.scanlines} aria-hidden="true" />
            <div className={styles.vignette} aria-hidden="true" />

            <div className={styles.screenContent}>
              <div className={styles.slotNum}>{game.num} / {String(GAMES.length).padStart(2, '0')}</div>

              {game.available ? (
                <div className={styles.gameInfo}>
                  <p className={styles.genre}>{game.genre}</p>
                  <h2 className={styles.gameTitle}>{game.title}</h2>
                  <p className={styles.blurb}>{game.blurb}</p>
                  <p className={styles.insertPrompt}>INSERT COIN TO PLAY</p>
                </div>
              ) : (
                <div className={styles.gameInfo}>
                  <p className={styles.genre}>{game.genre}</p>
                  <h2 className={`${styles.gameTitle} ${styles.lockedTitle}`}>{game.title}</h2>
                  <p className={styles.blurb}>{game.blurb}</p>
                  <p className={styles.outOfOrder}>— OUT OF ORDER —</p>
                </div>
              )}
            </div>
          </div>

          {/* Control panel bevel */}
          <div className={styles.bevel} />

          {/* Control panel */}
          <div className={styles.controlPanel}>
            <div className={styles.joystickArea}>
              <div className={styles.joystickBase}>
                <div className={styles.joystickStick} />
              </div>
              <div className={styles.dpadHint}>← →</div>
            </div>

            <div className={styles.centerControls}>
              {game.available ? (
                <button
                  className={styles.insertBtn}
                  onClick={() => handlePlay(game.href)}
                >
                  ▶ INSERT COIN
                </button>
              ) : (
                <button className={styles.insertBtnDisabled} disabled>
                  ✕ LOCKED
                </button>
              )}
            </div>

            <div className={styles.buttonCluster}>
              <div className={styles.arcadeBtn} style={{ background: '#ff0055' }} />
              <div className={styles.arcadeBtn} style={{ background: '#ffcc00' }} />
              <div className={styles.arcadeBtn} style={{ background: '#00ccff' }} />
            </div>
          </div>

        </div>

        {/* Base */}
        <div className={styles.cabinetBase} />

        {/* Nav hint */}
        <div className={styles.hint}>
          <button className={styles.backLink} onClick={handleBack}>← BACK TO TV</button>
          <span>{gameIdx + 1} / {GAMES.length}</span>
        </div>

      </div>
    </main>
  )
}
