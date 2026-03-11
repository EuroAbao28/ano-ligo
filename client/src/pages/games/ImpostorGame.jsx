import { useState, useRef, useCallback } from 'react'
import GameLayout from '../../components/GameLayout'
import { IMPOSTOR_THEMES as THEMES } from '../../data/impostor/themes'

const PHASE = { SETUP: 'setup', REVEAL: 'reveal', DISCUSSION: 'discussion' }

const PLAYER_COLORS = [
  'from-violet-500 to-purple-700',
  'from-pink-500 to-rose-700',
  'from-cyan-500 to-blue-700',
  'from-emerald-500 to-teal-700',
  'from-orange-500 to-amber-700',
  'from-fuchsia-500 to-pink-700',
  'from-sky-500 to-indigo-700',
  'from-lime-500 to-green-700'
]

function shuffle (arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function SetupScreen ({ onStart }) {
  const [names, setNames] = useState(['', '', ''])
  const [selectedThemes, setSelectedThemes] = useState(['🍕 Food'])
  const [impostorCount, setImpostorCount] = useState(1)

  const addPlayer = () => setNames(n => [...n, ''])
  const removePlayer = i => setNames(n => n.filter((_, idx) => idx !== i))
  const updateName = (i, val) =>
    setNames(n =>
      n.map((v, idx) =>
        idx === i ? val.charAt(0).toUpperCase() + val.slice(1) : v
      )
    )

  const allThemeKeys = Object.keys(THEMES)
  const allSelected = selectedThemes.length === allThemeKeys.length

  const toggleTheme = t => {
    setSelectedThemes(prev =>
      prev.includes(t)
        ? prev.length === 1
          ? prev
          : prev.filter(x => x !== t)
        : [...prev, t]
    )
  }

  const toggleAll = () => {
    setSelectedThemes(allSelected ? ['🍕 Food'] : allThemeKeys)
  }

  const validNames = names.filter(n => n.trim())
  const maxImpostors = Math.max(1, Math.floor(validNames.length / 3))
  const canStart = validNames.length >= 3

  const handleStart = () => {
    if (!canStart) return
    onStart({
      names: validNames,
      themes: selectedThemes,
      impostorCount: Math.min(impostorCount, maxImpostors)
    })
  }

  return (
    <div className='flex flex-col py-8 px-4'>
      {/* Header */}
      <div className='text-center mb-10'>
        <div className='text-center'>
          <div className='text-4xl lg:text-6xl mb-2 lg:mb-3'>🕵️</div>
          <h1 className='font-fredoka text-3xl lg:text-5xl text-white'>
            Impostor
          </h1>
          <p className='font-nunito text-zinc-500 text-xs lg:text-sm mt-1 lg:mt-2'>
            Find the spy among you
          </p>
        </div>
      </div>

      {/* Two-column layout on large screens */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
        {/* Left column — Players + Impostors */}
        <div className='flex flex-col gap-6'>
          {/* Players */}
          <div className='lg:bg-zinc-900 lg:border lg:border-zinc-800 lg:rounded-2xl lg:p-5'>
            <label className='font-nunito font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4 block'>
              Players <span className='text-zinc-600'>({names.length})</span>
            </label>
            <div className='flex flex-col gap-2'>
              {names.map((name, i) => (
                <div key={i} className='flex gap-2 items-center'>
                  <div
                    className={`w-7 h-7 rounded-full bg-linear-to-br ${
                      PLAYER_COLORS[i % PLAYER_COLORS.length]
                    } flex items-center justify-center font-nunito font-bold text-xs text-white shrink-0`}
                  >
                    {i + 1}
                  </div>
                  <input
                    type='text'
                    value={name}
                    onChange={e => updateName(i, e.target.value)}
                    placeholder={`Player ${i + 1}`}
                    className='flex-1 bg-zinc-900 lg:bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 font-nunito text-sm text-white placeholder-zinc-600 outline-none focus:border-yellow-400 transition-colors capitalize'
                  />
                  {names.length > 2 && (
                    <button
                      onClick={() => removePlayer(i)}
                      className='w-8 h-8 rounded-full bg-zinc-900 lg:bg-zinc-950 border border-zinc-800 text-zinc-600 hover:text-red-400 hover:border-red-900 transition-colors text-lg flex items-center justify-center shrink-0'
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addPlayer}
              className='mt-3 w-full py-3 rounded-xl border border-dashed border-zinc-700 font-nunito text-sm text-zinc-500 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors'
            >
              + Add Player
            </button>
          </div>

          {/* Impostors */}
          <div className='lg:bg-zinc-900 lg:border lg:border-zinc-800 lg:rounded-2xl lg:p-5'>
            <label className='font-nunito font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4 block'>
              Impostors
            </label>
            <div className='flex gap-3'>
              {[1, 2].map(n => (
                <button
                  key={n}
                  onClick={() => setImpostorCount(n)}
                  disabled={n > maxImpostors}
                  className={`flex-1 py-3 rounded-xl font-fredoka text-xl transition-all border ${
                    impostorCount === n
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : n > maxImpostors
                      ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                      : 'bg-zinc-900 lg:bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {n} {n === 1 ? 'Impostor' : 'Impostors'}
                </button>
              ))}
            </div>
            {impostorCount === 2 && validNames.length < 6 && (
              <p className='font-nunito text-xs text-zinc-600 mt-2 text-center'>
                Recommended 6+ players for 2 impostors
              </p>
            )}
          </div>
        </div>

        {/* Right column — Theme */}
        <div className='lg:bg-zinc-900 lg:border lg:border-zinc-800 lg:rounded-2xl lg:p-5'>
          <div className='flex items-center justify-between mb-4'>
            <label className='font-nunito font-bold text-xs uppercase tracking-widest text-zinc-400'>
              Theme
              <span className='text-zinc-600 ml-2 normal-case tracking-normal'>
                ({selectedThemes.length} selected)
              </span>
            </label>
            <button
              onClick={toggleAll}
              className={`font-nunito text-xs px-3 py-1 rounded-full border transition-all ${
                allSelected
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                  : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
              }`}
            >
              {allSelected ? '✓ All' : 'Select All'}
            </button>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            {allThemeKeys.map(t => (
              <button
                key={t}
                onClick={() => toggleTheme(t)}
                className={`py-2.5 px-3 rounded-xl font-nunito text-sm text-left transition-all border ${
                  selectedThemes.includes(t)
                    ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400'
                    : 'bg-zinc-900 lg:bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={!canStart}
        className={`mt-8 w-full py-4 rounded-2xl font-fredoka text-xl transition-all ${
          canStart
            ? 'bg-yellow-400 text-zinc-900 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 active:scale-95'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
      >
        {canStart ? 'Start Game 🎮' : 'Add at least 3 players'}
      </button>
    </div>
  )
}

function RevealScreen ({ players, onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [hasPeeked, setHasPeeked] = useState(false)
  const holdTimer = useRef(null)
  const player = players[currentIndex]

  const startHold = useCallback(() => {
    holdTimer.current = setTimeout(() => {
      setRevealed(true)
      setHasPeeked(true)
    }, 100)
  }, [])

  const endHold = useCallback(() => {
    clearTimeout(holdTimer.current)
    setRevealed(false)
  }, [])

  const handleNext = () => {
    if (!hasPeeked) return
    if (currentIndex + 1 >= players.length) {
      onDone()
    } else {
      setCurrentIndex(i => i + 1)
      setRevealed(false)
      setHasPeeked(false)
    }
  }

  const isImpostor = player.role === 'impostor'

  return (
    <GameLayout>
      <div className='flex flex-col lg:flex-row lg:items-start lg:gap-10 h-full'>
        {/* Left — info + progress */}
        <div className='lg:w-72 shrink-0'>
          {/* Progress */}
          <div className='mb-6'>
            <div className='flex justify-between font-nunito text-xs text-zinc-600 mb-2'>
              <span>
                Player {currentIndex + 1} of {players.length}
              </span>
              <span>{players.length - currentIndex - 1} remaining</span>
            </div>
            <div className='h-1 bg-zinc-800 rounded-full'>
              <div
                className='h-1 bg-yellow-400 rounded-full transition-all duration-500'
                style={{ width: `${(currentIndex / players.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pass instruction */}
          <div className='mb-6 lg:mb-0'>
            <p className='font-nunito text-zinc-500 text-sm uppercase tracking-widest mb-1'>
              Pass phone to
            </p>
            <h2 className='font-fredoka text-4xl text-white mb-6'>
              {player.name}
            </h2>

            {/* Player list — large screens only */}
            <div className='hidden lg:flex flex-col gap-1'>
              {players.map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                    i === currentIndex ? 'bg-zinc-800' : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      i < currentIndex
                        ? 'bg-emerald-500'
                        : i === currentIndex
                        ? 'bg-yellow-400'
                        : 'bg-zinc-700'
                    }`}
                  />
                  <span
                    className={`font-nunito text-sm ${
                      i === currentIndex
                        ? 'text-white font-bold'
                        : i < currentIndex
                        ? 'text-zinc-500 line-through'
                        : 'text-zinc-500'
                    }`}
                  >
                    {p.name}
                  </span>
                  {i < currentIndex && (
                    <span className='ml-auto text-xs text-emerald-600'>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — card + button */}
        <div className='flex-1 flex flex-col'>
          {/* Card */}
          <div className='flex-1 flex items-center justify-center select-none my-6 lg:my-0'>
            <div
              className='w-full max-w-xs lg:max-w-sm'
              style={{ perspective: '1000px' }}
            >
              <div
                style={{
                  transformStyle: 'preserve-3d',
                  transition:
                    'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  position: 'relative',
                  height: '300px'
                }}
              >
                {/* Card Back */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                  className='absolute inset-0 bg-zinc-900 border-2 border-zinc-700 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer'
                  onMouseDown={startHold}
                  onMouseUp={endHold}
                  onMouseLeave={endHold}
                  onTouchStart={startHold}
                  onTouchEnd={endHold}
                >
                  <div className='text-5xl'>🕵️</div>
                  <p className='font-nunito font-bold text-zinc-400 text-sm'>
                    Hold to reveal
                  </p>
                  <div className='w-12 h-1 bg-zinc-800 rounded-full' />
                  <p className='font-nunito text-zinc-600 text-xs'>
                    Release to hide
                  </p>
                </div>

                {/* Card Front */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                  className={`absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 border-2 ${
                    isImpostor
                      ? 'bg-red-950 border-red-700'
                      : 'bg-emerald-950 border-emerald-700'
                  }`}
                  onMouseDown={startHold}
                  onMouseUp={endHold}
                  onMouseLeave={endHold}
                  onTouchStart={startHold}
                  onTouchEnd={endHold}
                >
                  {isImpostor ? (
                    <>
                      <div className='text-5xl'>🔴</div>
                      <p className='font-fredoka text-3xl text-red-400'>
                        IMPOSTOR
                      </p>
                      <p className='font-nunito text-red-600 text-xs text-center px-6'>
                        You don't know the word. Blend in!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className='text-5xl'>🟢</div>
                      <p className='font-nunito text-xs text-emerald-600 uppercase tracking-widest'>
                        The word is
                      </p>
                      <p className='font-fredoka text-4xl text-emerald-400'>
                        {player.word}
                      </p>
                      <p className='font-nunito text-emerald-700 text-xs text-center px-6'>
                        You're a crewmate. Find the impostor!
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={!hasPeeked}
            className={`mt-4 w-full py-4 rounded-2xl font-fredoka text-xl transition-all ${
              hasPeeked
                ? 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500 active:scale-95'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-700 cursor-not-allowed'
            }`}
          >
            {!hasPeeked
              ? 'Hold card to peek first...'
              : currentIndex + 1 >= players.length
              ? 'Start Discussion 🗣️'
              : 'Next Player →'}
          </button>
        </div>
      </div>
    </GameLayout>
  )
}

function DiscussionScreen ({
  players,
  word,
  themes,
  impostorCount,
  onPlayAgain
}) {
  const [revealed, setRevealed] = useState(false)
  const impostors = players.filter(p => p.role === 'impostor')

  return (
    <GameLayout>
      <div className='flex flex-col lg:flex-row lg:gap-10'>
        {/* Left — header + players */}
        <div className='lg:w-72 shrink-0'>
          <div className='text-center lg:text-left mb-8'>
            <div className='text-5xl mb-3'>🗣️</div>
            <h2 className='font-fredoka text-4xl text-white mb-1'>Discuss!</h2>
            <p className='font-nunito text-zinc-500 text-sm'>
              Talk, debate, vote — find the{' '}
              {impostorCount === 1 ? 'impostor' : 'impostors'}!
            </p>
          </div>

          <div className='flex flex-col gap-2 mb-4'>
            {players.map((p, i) => (
              <div key={i} className='flex items-center gap-3'>
                <div
                  className={`w-7 h-7 rounded-full bg-linear-to-br ${
                    PLAYER_COLORS[i % PLAYER_COLORS.length]
                  } flex items-center justify-center font-nunito font-bold text-xs text-white`}
                >
                  {i + 1}
                </div>
                <span className='font-nunito text-sm text-zinc-300'>
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          <div className='mb-6 lg:mb-0'>
            <p className='font-nunito text-xs text-zinc-600 uppercase tracking-widest mb-1'>
              Themes
            </p>
            <p className='font-nunito text-sm text-zinc-400'>
              {themes.join(', ')}
            </p>
          </div>
        </div>

        {/* Right — reveal + play again */}
        <div className='flex-1 flex flex-col'>
          <button
            onClick={() => setRevealed(r => !r)}
            className={`w-full py-3 rounded-2xl font-nunito text-sm transition-all mb-3 border ${
              revealed
                ? 'bg-red-500/10 border-red-500/50 text-red-400'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-yellow-400/50 hover:text-yellow-400'
            }`}
          >
            {revealed ? '🙈 Hide' : '👁️ Reveal the Impostor'}
          </button>

          {revealed && (
            <div className='bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-4'>
              <div className='p-4 border-b border-zinc-800'>
                <p className='font-nunito text-xs text-red-500 uppercase tracking-widest mb-3'>
                  🔴 {impostors.length === 1 ? 'Impostor' : 'Impostors'}
                </p>
                <div className='flex flex-col gap-2'>
                  {impostors.map((p, i) => (
                    <span
                      key={i}
                      className='font-fredoka text-2xl text-red-400'
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className='p-4'>
                <p className='font-nunito text-xs text-emerald-600 uppercase tracking-widest mb-1'>
                  🟢 The word was
                </p>
                <p className='font-fredoka text-3xl text-emerald-400'>{word}</p>
              </div>
            </div>
          )}

          <div className='mt-auto pt-6'>
            <button
              onClick={onPlayAgain}
              className='w-full py-4 rounded-2xl font-fredoka text-xl bg-yellow-400 text-zinc-900 hover:bg-yellow-300 active:scale-95 transition-all shadow-lg shadow-yellow-400/20'
            >
              Play Again 🔄
            </button>
          </div>
        </div>
      </div>
    </GameLayout>
  )
}

export default function ImpostorGame () {
  const [phase, setPhase] = useState(PHASE.SETUP)
  const [players, setPlayers] = useState([])
  const [word, setWord] = useState('')
  const [themes, setThemes] = useState([])

  const handleStart = ({ names, themes, impostorCount }) => {
    const wordPool = themes.flatMap(t => THEMES[t])
    const selectedWord = wordPool[Math.floor(Math.random() * wordPool.length)]

    const indices = shuffle([...Array(names.length).keys()])
    const impostorIndices = new Set(indices.slice(0, impostorCount))

    const assignedPlayers = names.map((name, i) => ({
      name,
      role: impostorIndices.has(i) ? 'impostor' : 'crewmate',
      word: impostorIndices.has(i) ? null : selectedWord
    }))

    setWord(selectedWord)
    setThemes(themes)
    setPlayers(assignedPlayers)
    setPhase(PHASE.REVEAL)
  }

  const handleDiscussion = () => setPhase(PHASE.DISCUSSION)
  const handlePlayAgain = () => {
    setPhase(PHASE.SETUP)
    setPlayers([])
    setWord('')
    setThemes([])
  }

  return (
    <>
      {phase === PHASE.SETUP && <SetupScreen onStart={handleStart} />}
      {phase === PHASE.REVEAL && (
        <RevealScreen players={players} onDone={handleDiscussion} />
      )}
      {phase === PHASE.DISCUSSION && (
        <DiscussionScreen
          players={players}
          word={word}
          themes={themes}
          impostorCount={players.filter(p => p.role === 'impostor').length}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  )
}
