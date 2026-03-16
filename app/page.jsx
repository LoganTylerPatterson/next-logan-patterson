'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

const CHANNELS = [
  {
    id: 'home',
    num: '01',
    name: 'LOGAN PATTERSON',
    subtitle: 'SOFTWARE ENGINEER',
    type: 'home',
  },
  {
    id: 'arcade',
    num: '02',
    name: 'INSOMNIAC ARCADE',
    desc: 'SELECT YOUR GAME',
    href: '/arcade',
    type: 'project',
  },
  {
    id: 'sankey',
    num: '03',
    name: 'BUDGET SANKEY',
    desc: 'FINANCIAL VISUALIZATION',
    href: '/sankey',
    type: 'project',
  },
  {
    id: 'graph',
    num: '04',
    name: '3D GRAPH SHADER',
    desc: 'WEBGL REAL-TIME RENDERING',
    href: 'https://graph-six-rho.vercel.app/',
    type: 'project',
    external: true,
  },
  {
    id: 'branches',
    num: '05',
    name: 'BRANCHES',
    desc: 'DATA EXPLORER',
    href: '/branches',
    type: 'project',
  },
  {
    id: 'nosignal',
    num: '06',
    name: 'NO SIGNAL',
    subtitle: 'MORE CONTENT COMING SOON',
    type: 'nosignal',
  },
]

function drawStaticFrame(ctx, width, height) {
  const imageData = ctx.createImageData(width, height)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 220) | 0
    d[i]   = 0
    d[i+1] = (v * 0.85) | 0
    d[i+2] = 0
    d[i+3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}

export default function Home() {
  const [phase, setPhase] = useState('black') // 'black' | 'static' | 'ready'
  const [channel, setChannel] = useState(0)
  const [flashing, setFlashing] = useState(false)
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const flashingRef = useRef(false)
  const channelRef = useRef(0)

  // Boot sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('static'), 300)
    const t2 = setTimeout(() => setPhase('ready'), 2100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Static canvas animation
  useEffect(() => {
    if (phase !== 'static') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const loop = () => {
      drawStaticFrame(ctx, canvas.width, canvas.height)
      animRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(animRef.current)
  }, [phase])

  const changeChannel = (dir) => {
    if (flashingRef.current) return
    flashingRef.current = true
    setFlashing(true)
    setTimeout(() => {
      const next = (channelRef.current + dir + CHANNELS.length) % CHANNELS.length
      channelRef.current = next
      setChannel(next)
      flashingRef.current = false
      setFlashing(false)
    }, 200)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') changeChannel(1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') changeChannel(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const ch = CHANNELS[channel]

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
      <div className={styles.tvOuter}>

        {/* Bezel */}
        <div className={styles.tvBezel}>

          {/* Screen area */}
          <div className={`${styles.tvScreen} ${flashing ? styles.flash : ''}`}>
            <div className={styles.scanlines} aria-hidden="true" />
            <div className={styles.vignette} aria-hidden="true" />

            <div className={styles.screenContent}>
              <div className={styles.chBug}>CH {ch.num}</div>

              {ch.type === 'home' && (
                <div className={styles.homeChannel}>
                  <p className={styles.stationTag}>LGN-TV  ·  CHANNEL {ch.num}</p>
                  <h1 className={styles.bigName}>{ch.name}</h1>
                  <p className={styles.homeSubtitle}>{ch.subtitle}</p>
                  <p className={styles.homeHint}>← → BROWSE CHANNELS</p>
                </div>
              )}

              {ch.type === 'project' && (
                <div className={styles.projectChannel}>
                  <p className={styles.nowPlaying}>▶ NOW PLAYING</p>
                  <h2 className={styles.projectTitle}>{ch.name}</h2>
                  <p className={styles.projectDesc}>{ch.desc}</p>
                  {ch.external ? (
                    <a
                      href={ch.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.enterBtn}
                    >
                      ENTER ↗
                    </a>
                  ) : (
                    <Link href={ch.href} className={styles.enterBtn}>
                      ENTER →
                    </Link>
                  )}
                </div>
              )}

              {ch.type === 'nosignal' && (
                <div className={styles.noSignalChannel}>
                  <p className={styles.noSignalMain}>NO SIGNAL</p>
                  <p className={styles.noSignalSub}>{ch.subtitle}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right-side bezel controls */}
          <div className={styles.bezelControls}>
            <div className={styles.chDisplay}>{ch.num}</div>
            <button
              className={styles.chBtn}
              onClick={() => changeChannel(1)}
              aria-label="Next channel"
            >▲</button>
            <button
              className={styles.chBtn}
              onClick={() => changeChannel(-1)}
              aria-label="Previous channel"
            >▼</button>
            <div className={styles.powerLed} />
          </div>

        </div>

        {/* Stand */}
        <div className={styles.tvNeck} />
        <div className={styles.tvBase} />

        {/* Hint bar */}
        <div className={styles.hint}>
          <span>← → CHANGE CHANNEL</span>
          <span>{channel + 1} / {CHANNELS.length}</span>
        </div>

      </div>
    </main>
  )
}
