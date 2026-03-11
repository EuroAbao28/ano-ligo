import { useState, useCallback, useEffect } from 'react'
import GameLayout from '../../components/GameLayout'
import GameTransition from '../../components/GameTransition'
import {
  TRUTH_QUESTIONS,
  DARE_CHALLENGES
} from '../../data/truthordare/questions'

const PHASE = {
  SETUP: 'setup',
  TRANSITION: 'transition',
  SPIN: 'spin',
  CHALLENGE: 'challenge'
}
const CHOICE = { NONE: 'none', TRUTH: 'truth', DARE: 'dare' }

const CATEGORY_KEYS = ['😇 Mild', '🌶️ Spicy', '🔥 Wild']

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

function getRandomItem (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle (arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen ({ onStart }) {
  const [names, setNames] = useState(['', '', ''])
  const [selectedCategories, setSelectedCategories] = useState(['😇 Mild'])

  const addPlayer = () => setNames(n => [...n, ''])
  const removePlayer = i => setNames(n => n.filter((_, idx) => idx !== i))
  const updateName = (i, val) =>
    setNames(n =>
      n.map((v, idx) =>
        idx === i ? val.charAt(0).toUpperCase() + val.slice(1) : v
      )
    )

  const toggleCategory = cat => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.length === 1
          ? prev
          : prev.filter(c => c !== cat)
        : [...prev, cat]
    )
  }

  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 2

  const handleStart = () => {
    if (!canStart) return
    onStart({ names: validNames, categories: selectedCategories })
  }

  return (
    <div className='flex flex-col py-8 px-4'>
      {/* Header */}
      <div className='text-center mb-10'>
        <div className='text-4xl lg:text-6xl mb-2 lg:mb-3'>🎲</div>
        <h1 className='font-fredoka text-3xl lg:text-5xl text-white'>
          Truth or Dare
        </h1>
        <p className='font-nunito text-zinc-500 text-xs lg:text-sm mt-1 lg:mt-2'>
          Spill the truth or take the dare
        </p>
      </div>

      {/* Two-column layout on large screens */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
        {/* Left — Players */}
        <div className='lg:bg-zinc-900 lg:border lg:border-zinc-800 lg:rounded-2xl lg:p-5'>
          <label className='font-nunito font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4 block'>
            Players <span className='text-zinc-600'>({names.length})</span>
          </label>
          <div className='flex flex-col gap-2'>
            {names.map((name, i) => (
              <div key={i} className='flex gap-2 items-center'>
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${
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

        {/* Right — Categories */}
        <div className='lg:bg-zinc-900 lg:border lg:border-zinc-800 lg:rounded-2xl lg:p-5'>
          <label className='font-nunito font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4 block'>
            Categories{' '}
            <span className='text-zinc-600 normal-case tracking-normal'>
              ({selectedCategories.length} selected)
            </span>
          </label>
          <div className='flex flex-col gap-3'>
            {CATEGORY_KEYS.map(cat => {
              const isSelected = selectedCategories.includes(cat)
              const descriptions = {
                '😇 Mild': 'Fun & friendly — safe for everyone',
                '🌶️ Spicy': 'A little spicy — light drama ahead',
                '🔥 Wild': 'No limits — handle with care'
              }
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`py-3 px-4 rounded-xl font-nunito text-sm text-left transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400'
                      : 'bg-zinc-900 lg:bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <div>
                    <p className='font-bold'>{cat}</p>
                    <p
                      className={`text-xs mt-0.5 ${
                        isSelected ? 'text-yellow-600' : 'text-zinc-600'
                      }`}
                    >
                      {descriptions[cat]}
                    </p>
                  </div>
                  {isSelected && (
                    <span className='text-yellow-400 text-base shrink-0 ml-3'>
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
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
        {canStart ? 'Start Game 🎲' : 'Add at least 2 players'}
      </button>
    </div>
  )
}

// ─── Spin Screen ──────────────────────────────────────────────────────────────

function SpinScreen ({ players, currentPlayerIndex, round, onChoice }) {
  const player = players[currentPlayerIndex]
  const colorGradient = PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length]

  return (
    <GameLayout>
      <div className='flex flex-col items-center justify-center flex-1 py-10'>
        {/* Round Badge */}
        <div className='font-nunito text-xs text-zinc-600 uppercase tracking-widest mb-8'>
          Round {round} · Turn {currentPlayerIndex + 1} of {players.length}
        </div>

        {/* Player Avatar */}
        <div
          className={`w-28 h-28 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center mb-6 shadow-2xl`}
        >
          <span className='font-fredoka text-5xl text-white'>
            {player.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <p className='font-nunito text-zinc-400 text-sm uppercase tracking-widest mb-1'>
          It&apos;s your turn,
        </p>
        <h2 className='font-fredoka text-5xl text-white mb-2'>{player.name}</h2>
        <p className='font-nunito text-zinc-600 text-sm mb-12'>
          Pass the device and let them choose
        </p>

        {/* Choice Buttons */}
        <div className='flex gap-4 w-full max-w-sm'>
          <button
            onClick={() => onChoice(CHOICE.TRUTH)}
            className='flex-1 py-5 rounded-2xl bg-blue-500/10 border-2 border-blue-500/50 hover:bg-blue-500/20 hover:border-blue-400 active:scale-95 transition-all group'
          >
            <div className='text-3xl mb-1'>🤔</div>
            <p className='font-fredoka text-xl text-blue-400 group-hover:text-blue-300'>
              Truth
            </p>
          </button>
          <button
            onClick={() => onChoice(CHOICE.DARE)}
            className='flex-1 py-5 rounded-2xl bg-orange-500/10 border-2 border-orange-500/50 hover:bg-orange-500/20 hover:border-orange-400 active:scale-95 transition-all group'
          >
            <div className='text-3xl mb-1'>🔥</div>
            <p className='font-fredoka text-xl text-orange-400 group-hover:text-orange-300'>
              Dare
            </p>
          </button>
        </div>

        {/* Player Queue */}
        <div className='flex gap-2 mt-12 flex-wrap justify-center'>
          {players.map((p, i) => (
            <div
              key={i}
              className={`font-nunito text-xs px-3 py-1 rounded-full border transition-all ${
                i === currentPlayerIndex
                  ? `bg-gradient-to-r ${colorGradient} border-transparent text-white font-bold`
                  : 'border-zinc-800 text-zinc-600'
              }`}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </GameLayout>
  )
}

// ─── Challenge Screen ─────────────────────────────────────────────────────────

function ChallengeScreen ({
  player,
  playerIndex,
  choice,
  categories,
  onDone,
  onReroll
}) {
  const colorGradient = PLAYER_COLORS[playerIndex % PLAYER_COLORS.length]
  const isTrue = choice === CHOICE.TRUTH

  const [challenge, setChallenge] = useState(() =>
    pickChallenge(choice, categories)
  )

  function pickChallenge (c, cats) {
    const pool = cats.flatMap(cat =>
      c === CHOICE.TRUTH
        ? TRUTH_QUESTIONS[cat] || []
        : DARE_CHALLENGES[cat] || []
    )
    return getRandomItem(pool)
  }

  const handleReroll = useCallback(() => {
    setChallenge(pickChallenge(choice, categories))
    onReroll()
  }, [choice, categories, onReroll])

  return (
    <GameLayout>
      <div className='flex flex-col flex-1 py-8'>
        {/* Player header */}
        <div className='flex items-center gap-4 mb-8'>
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center font-fredoka text-xl text-white shrink-0`}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className='font-fredoka text-2xl text-white leading-none'>
              {player.name}
            </p>
            <p className='font-nunito text-xs text-zinc-500 mt-0.5'>
              chose {isTrue ? 'Truth' : 'Dare'}
            </p>
          </div>
          <div
            className={`ml-auto px-4 py-1.5 rounded-full font-fredoka text-sm border-2 ${
              isTrue
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-orange-500 text-orange-400 bg-orange-500/10'
            }`}
          >
            {isTrue ? '🤔 Truth' : '🔥 Dare'}
          </div>
        </div>

        {/* Challenge Card */}
        <div
          className={`flex-1 flex flex-col items-center justify-center rounded-3xl border-2 p-8 mb-6 ${
            isTrue
              ? 'bg-blue-500/5 border-blue-500/30'
              : 'bg-orange-500/5 border-orange-500/30'
          }`}
        >
          <div className='text-5xl mb-6'>{isTrue ? '🤔' : '🔥'}</div>
          <p className='font-nunito text-white text-lg lg:text-xl text-center leading-relaxed max-w-sm'>
            {challenge}
          </p>
        </div>

        {/* Actions */}
        <div className='flex gap-3'>
          <button
            onClick={handleReroll}
            className='px-5 py-4 rounded-2xl font-nunito text-sm bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white active:scale-95 transition-all flex items-center gap-2'
          >
            🔀 Re-roll
          </button>
          <button
            onClick={onDone}
            className='flex-1 py-4 rounded-2xl font-fredoka text-xl bg-yellow-400 text-zinc-900 hover:bg-yellow-300 active:scale-95 transition-all shadow-lg shadow-yellow-400/20'
          >
            Done ✓
          </button>
        </div>
      </div>
    </GameLayout>
  )
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function TruthOrDareGame () {
  const [phase, setPhase] = useState(PHASE.SETUP)
  const [players, setPlayers] = useState([])
  const [categories, setCategories] = useState([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [choice, setChoice] = useState(CHOICE.NONE)
  const [rerollCount, setRerollCount] = useState(0)

  const handleStart = ({ names, categories: cats }) => {
    setPlayers(shuffle(names).map(name => ({ name })))
    setCategories(cats)
    setCurrentPlayerIndex(0)
    setRound(1)
    setPhase(PHASE.TRANSITION)
  }

  const handleChoice = chosen => {
    setChoice(chosen)
    setRerollCount(0)
    setPhase(PHASE.CHALLENGE)
  }

  const handleDone = () => {
    const nextIndex = currentPlayerIndex + 1
    if (nextIndex >= players.length) {
      setRound(r => r + 1)
      setCurrentPlayerIndex(0)
    } else {
      setCurrentPlayerIndex(nextIndex)
    }
    setChoice(CHOICE.NONE)
    setPhase(PHASE.SPIN)
  }

  const handleReroll = () => {
    setRerollCount(c => c + 1)
  }

  return (
    <>
      {phase === PHASE.SETUP && <SetupScreen onStart={handleStart} />}
      {(phase === PHASE.TRANSITION || phase === PHASE.SPIN) && (
        <SpinScreen
          players={players}
          currentPlayerIndex={currentPlayerIndex}
          round={round}
          onChoice={handleChoice}
        />
      )}
      {phase === PHASE.TRANSITION && (
        <GameTransition
          emoji='🎲'
          title='Truth or Dare'
          onDone={() => setPhase(PHASE.SPIN)}
        />
      )}
      {phase === PHASE.CHALLENGE && (
        <ChallengeScreen
          key={`${currentPlayerIndex}-${rerollCount}`}
          player={players[currentPlayerIndex]}
          playerIndex={currentPlayerIndex}
          choice={choice}
          categories={categories}
          onDone={handleDone}
          onReroll={handleReroll}
        />
      )}
    </>
  )
}
