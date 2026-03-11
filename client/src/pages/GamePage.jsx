import { useParams, Link, Outlet } from 'react-router'
import { games } from '../data/games'

export default function GamePage () {
  const { id } = useParams()
  const game = games.find(g => g.id === id)

  if (!game)
    return (
      <div className='min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white'>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap'); .font-fredoka { font-family: 'Fredoka One', cursive; } .font-nunito { font-family: 'Nunito', sans-serif; }`}</style>
        <p className='text-6xl mb-4'>😵</p>
        <p className='font-fredoka text-3xl mb-6'>Game not found!</p>
        <Link to='/' className='font-nunito text-yellow-400 underline'>
          ← Back to Home
        </Link>
      </div>
    )

  return (
    <div className='min-h-screen bg-zinc-950 text-white flex flex-col'>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap'); .font-fredoka { font-family: 'Fredoka One', cursive; } .font-nunito { font-family: 'Nunito', sans-serif; }`}</style>

      {/* Sticky Top Bar */}
      <div className='sticky top-0 z-10 bg-zinc-950 border-b border-zinc-900'>
        <div className='max-w-5xl mx-auto w-full flex items-center justify-between px-4 py-4'>
          <Link
            to='/'
            className='flex items-center gap-2 font-nunito text-sm text-zinc-500 hover:text-yellow-400 transition-colors group'
          >
            <span className='text-lg group-hover:-translate-x-1 transition-transform'>
              ←
            </span>
            <span>🏠</span>
          </Link>
          <span className='font-fredoka text-lg text-zinc-700 tracking-wide'>
            Ano Ligo?
          </span>
        </div>
      </div>

      {/* Page Content */}
      <div className='max-w-5xl mx-auto w-full flex-1 flex flex-col'>
        <Outlet context={{ game }} />
      </div>
    </div>
  )
}
