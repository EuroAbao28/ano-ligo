import { useState, useEffect } from 'react'

/**
 * CurtainTransition
 *
 * Props:
 *   emoji    — the emoji to show while the curtain is down (e.g. '🕵️')
 *   title    — game name shown below the emoji (e.g. 'Impostor')
 *   label    — small subtitle text (defaults to 'Game starting...')
 *   onDone   — callback fired when the curtain has fully lifted
 *
 * Usage:
 *   <CurtainTransition emoji='🕵️' title='Impostor' onDone={() => setPhase(PHASE.REVEAL)} />
 *   <CurtainTransition emoji='🎲' title='Truth or Dare' onDone={() => setPhase(PHASE.SPIN)} />
 */
export default function GameTransition ({
  emoji,
  title,
  label = 'Game starting...',
  onDone
}) {
  const [step, setStep] = useState('down')

  useEffect(() => {
    const t1 = setTimeout(() => setStep('hold'), 50)
    const t2 = setTimeout(() => setStep('up'), 2200)
    const t3 = setTimeout(onDone, 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div
      className='fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center pointer-events-none'
      style={{
        transition:
          step === 'up'
            ? 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)'
            : step === 'hold'
            ? 'none'
            : 'transform 0.35s cubic-bezier(0.76, 0, 0.24, 1)',
        transform: step === 'up' ? 'translateY(-100%)' : 'translateY(0%)'
      }}
    >
      <style>{`
        @keyframes curtain-icon-appear {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        .curtain-icon { animation: curtain-icon-appear 0.25s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both; }
        @keyframes load-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .load-bar { animation: load-bar 2s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards; }
      `}</style>

      <div className='curtain-icon flex flex-col items-center gap-4'>
        <div className='text-6xl'>{emoji}</div>
        <p className='font-fredoka text-2xl text-white tracking-wide'>
          {title}
        </p>
        <div className='w-40 h-0.5 bg-zinc-800 rounded-full overflow-hidden'>
          <div className='h-full bg-yellow-400 rounded-full load-bar' />
        </div>
        <p className='font-nunito text-xs text-zinc-500 uppercase tracking-widest'>
          {label}
        </p>
      </div>
    </div>
  )
}
