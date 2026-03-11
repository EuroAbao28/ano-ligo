import { useState } from 'react'
import { Link } from 'react-router'
import { games } from '../data/games'

const tags = ['All', 'Classic', 'Puzzle', 'Action', 'Strategy']

export default function Home () {
  const [activeTag, setActiveTag] = useState('All')
  const [hoveredId, setHoveredId] = useState(null)

  const filtered =
    activeTag === 'All' ? games : games.filter(g => g.tag === activeTag)

  return (
    <div className='min-h-screen bg-zinc-950 text-white'>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        .font-fredoka { font-family: 'Fredoka One', cursive; }
        .font-nunito { font-family: 'Nunito', sans-serif; }
        @keyframes wiggle {
          0%,100% { transform: rotate(-3deg) scale(1.1); }
          50% { transform: rotate(3deg) scale(1.2); }
        }
        .wiggle { animation: wiggle 0.4s ease-in-out infinite; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div className='relative overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none' />
        <div className='absolute top-0 right-1/4 w-96 h-96 bg-pink-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none' />
        <div className='max-w-5xl mx-auto px-4'>
          <div className='relative text-center pt-16 pb-10'>
            <div className='inline-block bg-yellow-400 text-zinc-900 text-[10px] md:text-xs font-nunito font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4'>
              🎮 Laro ka muna hype ka!
            </div>
            <h1 className='font-fredoka text-6xl md:text-8xl text-white leading-none tracking-wide mb-3'>
              Ano Ligo?
            </h1>
            <p className='font-nunito text-zinc-400 text-base md:text-lg max-w-sm mx-auto'>
              Pick a game. Stop overthinking. Just play.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className='max-w-5xl mx-auto px-4'>
        <div className='flex gap-2 justify-center flex-wrap pb-10'>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`font-nunito text-xs sm:text-sm font-bold px-5 py-2 rounded-full border-2 transition-all duration-200 cursor-pointer
                ${
                  activeTag === tag
                    ? 'bg-yellow-400 border-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/30'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white bg-transparent'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Game Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 max-w-5xl mx-auto px-3 sm:px-4 pb-20'>
        {filtered.map((game, i) => (
          <Link
            key={game.id}
            to={game.implemented ? `/game/${game.id}/play` : `/game/${game.id}`}
            className='fade-up relative rounded-2xl overflow-hidden cursor-pointer group border-2 border-zinc-800 hover:border-zinc-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl no-underline flex flex-col'
            style={{ animationDelay: `${i * 60}ms` }}
            onMouseEnter={() => setHoveredId(game.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className={`h-2 w-full bg-linear-to-r ${game.color}`} />
            <div className='bg-zinc-900 p-4 sm:p-6 sm:flex-1 flex flex-col h-full'>
              <div className='flex items-start justify-between mb-3 sm:mb-4'>
                <span
                  className={`text-3xl sm:text-4xl transition-all duration-200 inline-block ${
                    hoveredId === game.id ? 'wiggle' : ''
                  }`}
                >
                  {game.emoji}
                </span>
                <div className='flex flex-col items-end gap-1'>
                  <span
                    className={`text-xs font-nunito font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${game.color} text-white`}
                  >
                    {game.tag}
                  </span>
                  <span className='text-xs font-nunito text-zinc-600'>
                    {game.players}
                  </span>
                </div>
              </div>
              <h2 className='font-fredoka text-lg sm:text-2xl text-white mb-1 tracking-wide'>
                {game.title}
              </h2>
              <p className='font-nunito text-xs sm:text-sm text-zinc-500 leading-relaxed mb-3 sm:mb-5'>
                {game.description}
              </p>
              <div
                className={`mt-auto hidden sm:block w-full py-2.5 rounded-xl font-nunito font-bold text-sm text-center bg-gradient-to-r ${game.color} text-white opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0`}
              >
                {game.implemented ? 'Play Now →' : 'Coming Soon...'}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className='text-center pb-10 pt-4'>
        <div className='w-16 h-px bg-zinc-800 mx-auto mb-6' />
        <p className='font-nunito text-zinc-700 text-sm mb-4'>
          {filtered.length} game{filtered.length !== 1 ? 's' : ''} available ·
          More coming soon 👀
        </p>

        <p className='font-nunito text-[10px] text-zinc-600 uppercase tracking-widest mt-12'>
          Developed by
        </p>
        <p className='font-fredoka text-sm text-zinc-400 tracking-widest'>
          ORUE
        </p>
      </div>
    </div>
  )
}
