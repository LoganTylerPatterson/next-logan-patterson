'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

const GAMES = [
  {
    id: 'flow',
    num: '01',
    title: 'FLOW',
    genre: 'PUZZLE · SIMULATION',
    blurb: 'CONNECT THE DOTS. FILL THE BOARD.',
    href: '/flow',
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

function drawBootStatic(ctx, width, height) {
  const imageData = ctx.createImageData(width, height)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 200) | 0
    d[i]   = (v * 0.8) | 0   // R - pinkish tint
    d[i+1] = 0
    d[i+2] = (v * 0.5) | 0   // B
    d[i+3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}

export default function ArcadePage() {
  const [phase, setPhase] = useState('black')
  const [gameIdx, setGameIdx] = useState(0)
  const [flashing, setFlashing] = useState(false)
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const flashingRef = useRef(false)
  const idxRef = useRef(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('static'), 300)
    const t2 = setTimeout(() => setPhase('ready'), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (phase !== 'static') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const loop = () => {
      drawBootStatic(ctx, canvas.width, canvas.height)
      animRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(animRef.current)
  }, [phase])

  const changeGame = (dir) => {
    if (flashingRef.current) return
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

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') changeGame(1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') changeGame(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const game = GAMES[gameIdx]

  if (phase !== 'ready') {
    return (
      <div className={styles.boot}>
        {phase === 'static' && (
          <canvas
            ref={canvasRef}
            className={styles.bootCanvas}
            width={640}
            height={400}
          />
        )}
      </div>
    )
  }

  return (
    <main className={styles.room}>
      <div className={styles.cabinet}>

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
                <Link href={game.href} className={styles.insertBtn}>
                  ▶ INSERT COIN
                </Link>
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
          <Link href="/" className={styles.backLink}>← BACK TO TV</Link>
          <span>{gameIdx + 1} / {GAMES.length}</span>
        </div>

      </div>
    </main>
  )
}
