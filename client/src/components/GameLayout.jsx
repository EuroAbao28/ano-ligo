import { useState } from 'react'
import QuitModal from './QuitModal'

export default function GameLayout ({ children }) {
  const [showQuit, setShowQuit] = useState(false)

  return (
    <div className='fixed inset-0 bg-zinc-950 text-white flex flex-col z-10'>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap'); .font-fredoka { font-family: 'Fredoka One', cursive; } .font-nunito { font-family: 'Nunito', sans-serif; }`}</style>

      {/* Top Bar */}
      <div className='border-b border-zinc-900 shrink-0'>
        <div className='max-w-5xl mx-auto w-full flex items-center justify-between px-4 py-4'>
          <span className='font-fredoka text-lg text-zinc-500 tracking-wide'>
            Ano Ligo?
          </span>
          <button
            onClick={() => setShowQuit(true)}
            className='font-nunito text-xs text-zinc-600 border border-zinc-800 rounded-full px-3 py-1.5 hover:text-red-400 hover:border-red-900 transition-colors'
          >
            ✕ Quit
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='max-w-5xl mx-auto w-full flex-1 flex flex-col px-4 py-6 overflow-y-auto'>
        {children}
      </div>

      {showQuit && <QuitModal onCancel={() => setShowQuit(false)} />}
    </div>
  )
}
