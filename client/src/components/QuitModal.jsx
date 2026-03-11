import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function QuitModal ({ onCancel }) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handleCancel = () => {
    setVisible(false)
    setTimeout(onCancel, 400)
  }

  const handleQuit = () => {
    setVisible(false)
    setTimeout(() => navigate('/'), 400)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-6'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/70 backdrop-blur-sm'
        style={{
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: visible ? 1 : 0
        }}
        onClick={handleCancel}
      />

      {/* Modal */}
      <div
        className='relative bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl'
        style={{
          transition:
            'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: visible
            ? 'translateY(0) scale(1)'
            : 'translateY(28px) scale(0.96)',
          opacity: visible ? 1 : 0
        }}
      >
        <div className='text-5xl mb-4'>🚪</div>
        <h2 className='font-fredoka text-2xl text-white mb-2'>Quit Game?</h2>
        <p className='font-nunito text-sm text-zinc-400 mb-8'>
          The current round will be lost. Everyone goes home sad.
        </p>
        <div className='flex gap-3'>
          <button
            onClick={handleCancel}
            className='flex-1 py-3 rounded-2xl font-nunito font-bold text-sm bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 active:scale-95 transition-all'
          >
            Keep Playing
          </button>
          <button
            onClick={handleQuit}
            className='flex-1 py-3 rounded-2xl font-nunito font-bold text-sm bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 active:scale-95 transition-all'
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  )
}
