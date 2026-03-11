import { useState, useEffect } from 'react'

export default function AppLoader ({ children }) {
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1800)
    const doneTimer = setTimeout(() => setDone(true), 2600)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  return (
    <>
      {children}

      {!done && (
        <div
          className='fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center z-50 pointer-events-none px-6'
          style={{
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: fading ? 0 : 1
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700&display=swap');
            .font-fredoka { font-family: 'Fredoka One', cursive; }
            .font-nunito { font-family: 'Nunito', sans-serif; }
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.15; transform: scale(1); }
              50% { opacity: 0.25; transform: scale(1.05); }
            }
            @keyframes bounce-emoji {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
            @keyframes fill-bar {
              from { width: 0%; }
              to { width: 100%; }
            }
            .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
            .bounce-emoji { animation: bounce-emoji 1s ease-in-out infinite; }
            .fill-bar { animation: fill-bar 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          `}</style>

          {/* Blobs - smaller and edge-anchored on mobile */}
          <div
            className='absolute top-1/4 left-0 w-48 h-48 sm:w-80 sm:h-80 sm:left-1/4 bg-yellow-400 rounded-full blur-3xl pulse-glow pointer-events-none'
            style={{ opacity: 0.15 }}
          />
          <div
            className='absolute bottom-1/4 right-0 w-48 h-48 sm:w-80 sm:h-80 sm:right-1/4 bg-pink-500 rounded-full blur-3xl pulse-glow pointer-events-none'
            style={{ opacity: 0.15, animationDelay: '1s' }}
          />

          {/* Content */}
          <div className='relative flex flex-col items-center gap-3 sm:gap-4 w-full'>
            <div className='text-5xl sm:text-6xl bounce-emoji'>🎮</div>
            <h1 className='font-fredoka text-4xl sm:text-5xl text-white tracking-wide'>
              Ano Ligo?
            </h1>
            <p className='font-nunito text-zinc-500 text-xs sm:text-sm tracking-widest uppercase'>
              Loading games...
            </p>
            <div className='w-full max-w-[12rem] h-1 bg-zinc-800 rounded-full overflow-hidden mt-1'>
              <div className='h-full bg-yellow-400 rounded-full fill-bar' />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
