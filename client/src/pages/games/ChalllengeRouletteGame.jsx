import { useState, useEffect, useCallback } from 'react'
import GameLayout from '../../components/GameLayout'
import GameTransition from '../../components/GameTransition'
import { CHALLENGES } from '../../data/roulette/challenges'

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASE = {
  SETUP: 'setup',
  TRANSITION: 'transition',
  SPIN: 'spin',
  RESULT: 'result'
}

const NUM_SEGS = CHALLENGES.length
const SEG_DEG = 360 / NUM_SEGS

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

// ─── SVG Helpers ──────────────────────────────────────────────────────────────

function polarToCartesian (cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function segmentPath (cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle)
  const e = polarToCartesian(cx, cy, r, endAngle)
  return `M ${cx} ${cy} L ${s.x.toFixed(3)} ${s.y.toFixed(
    3
  )} A ${r} ${r} 0 0 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)} Z`
}

// ─── Roulette Wheel ───────────────────────────────────────────────────────────

function RouletteWheel ({ rotation, isSpinning }) {
  const SIZE = 288
  const cx = SIZE / 2
  const cy = SIZE / 2
  const R = SIZE / 2 - 6

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: isSpinning
          ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 1)'
          : 'none',
        willChange: 'transform',
        display: 'block'
      }}
    >
      {/* Rim */}
      <circle cx={cx} cy={cy} r={R + 5} fill='#3f3f46' />
      <circle cx={cx} cy={cy} r={R + 2} fill='#27272a' />

      {/* Segments */}
      {CHALLENGES.map((ch, i) => {
        const startAngle = i * SEG_DEG
        const endAngle = startAngle + SEG_DEG
        const midAngle = startAngle + SEG_DEG / 2
        const midRad = (midAngle - 90) * (Math.PI / 180)
        const lx = cx + R * 0.82 * Math.cos(midRad)
        const ly = cy + R * 0.82 * Math.sin(midRad)
        const innerLx = cx + R * 0.5 * Math.cos(midRad)
        const innerLy = cy + R * 0.5 * Math.sin(midRad)
        const fillColor = i % 2 === 0 ? ch.color : `${ch.color}cc`

        return (
          <g key={i}>
            <path
              d={segmentPath(cx, cy, R, startAngle, endAngle)}
              fill={fillColor}
              stroke='#09090b'
              strokeWidth='1.5'
            />
            <path
              d={segmentPath(cx, cy, R * 0.28, startAngle, endAngle)}
              fill='rgba(255,255,255,0.07)'
              stroke='none'
            />

            {/* Emoji — stays as is */}
            <text
              x={lx}
              y={ly}
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize='20'
              transform={`rotate(${midAngle}, ${lx}, ${ly})`}
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {ch.emoji}
            </text>

            {/* Label — vertical stacked letters */}
            <text
              x={innerLx}
              y={innerLy}
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize='6.5'
              fontFamily='Nunito, sans-serif'
              fontWeight='800'
              fill='rgba(255,255,255,0.55)'
              letterSpacing='1'
              transform={`rotate(${midAngle}, ${innerLx}, ${innerLy})`}
              style={{
                writingMode: 'vertical-rl',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              {ch.label.toUpperCase()}
            </text>
          </g>
        )
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r='22' fill='rgba(0,0,0,0.4)' />
      <circle
        cx={cx}
        cy={cy}
        r='19'
        fill='#18181b'
        stroke='#3f3f46'
        strokeWidth='2'
      />
      <circle cx={cx} cy={cy} r='7' fill='#facc15' />
    </svg>
  )
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen ({ onStart }) {
  const [names, setNames] = useState(['', '', ''])

  const addPlayer = () => setNames(n => [...n, ''])
  const removePlayer = i => setNames(n => n.filter((_, idx) => idx !== i))
  const updateName = (i, val) =>
    setNames(n =>
      n.map((v, idx) =>
        idx === i ? val.charAt(0).toUpperCase() + val.slice(1) : v
      )
    )

  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 2

  return (
    <div className='flex flex-col py-8 px-4'>
      {/* Header */}
      <div className='text-center mb-10'>
        <div className='text-4xl lg:text-6xl mb-2 lg:mb-3'>🎰</div>
        <h1 className='font-fredoka text-3xl lg:text-5xl text-white'>
          Challenge Roulette
        </h1>
        <p className='font-nunito text-zinc-500 text-xs lg:text-sm mt-1 lg:mt-2'>
          Spin the wheel. Face the challenge. No backing out.
        </p>
      </div>

      {/* Disclaimer */}
      <div className='flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6'>
        <span className='text-lg'>🔞</span>
        <p className='font-nunito text-xs text-amber-400'>
          This is a drinking game for adults only. Drink responsibly.
        </p>
      </div>

      {/* Players */}
      <div className='lg:bg-zinc-900 lg:border lg:border-zinc-800 lg:rounded-2xl lg:p-5 mb-6'>
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

      {/* What's on the wheel */}
      <div className='lg:bg-zinc-900 lg:border lg:border-zinc-800 lg:rounded-2xl lg:p-5 mb-8'>
        <label className='font-nunito font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4 block'>
          What&apos;s on the wheel
        </label>
        <div className='grid grid-cols-2 gap-2'>
          {CHALLENGES.map((ch, i) => (
            <div
              key={i}
              className='flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950 lg:bg-zinc-900 border border-zinc-800'
            >
              <span className='text-base'>{ch.emoji}</span>
              <span className='font-nunito text-xs text-zinc-400'>
                {ch.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Start */}
      <button
        onClick={() => canStart && onStart({ names: validNames })}
        disabled={!canStart}
        className={`w-full py-4 rounded-2xl font-fredoka text-xl transition-all ${
          canStart
            ? 'bg-yellow-400 text-zinc-900 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 active:scale-95'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
      >
        {canStart ? 'Start Game 🎰' : 'Add at least 2 players'}
      </button>
    </div>
  )
}

// ─── Spin Screen ──────────────────────────────────────────────────────────────

function SpinScreen ({ players, currentPlayerIndex, round, onResult }) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [landedIndex, setLandedIndex] = useState(null)

  const player = players[currentPlayerIndex]
  const colorGradient = PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length]

  useEffect(() => {
    setLandedIndex(null)
    setIsSpinning(false)
  }, [currentPlayerIndex])

  const handleSpin = useCallback(() => {
    if (isSpinning || landedIndex !== null) return

    const targetIndex = Math.floor(Math.random() * NUM_SEGS)
    const targetMod = (((337.5 - targetIndex * SEG_DEG) % 360) + 360) % 360
    const currentMod = ((rotation % 360) + 360) % 360
    const diff = (targetMod - currentMod + 360) % 360
    const newRotation = rotation + 5 * 360 + diff

    setRotation(newRotation)
    setIsSpinning(true)

    setTimeout(() => {
      setIsSpinning(false)
      setLandedIndex(targetIndex)
      setTimeout(() => onResult(targetIndex), 900)
    }, 4500)
  }, [isSpinning, landedIndex, rotation, onResult])

  const statusText = isSpinning
    ? 'Spinning...'
    : landedIndex !== null
    ? `🎯 ${CHALLENGES[landedIndex].label}!`
    : 'Tap to spin the wheel!'

  return (
    <GameLayout>
      <style>{`
        @keyframes spin-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(250,204,21,0); }
          50%       { box-shadow: 0 0 24px 8px rgba(250,204,21,0.18); }
        }
        .spin-pulse { animation: spin-pulse 1.2s ease-in-out infinite; }
        @keyframes landed-flash {
          0%   { opacity: 0; transform: scale(0.8); }
          60%  { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .landed-flash { animation: landed-flash 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className='flex flex-col items-center flex-1 py-6 gap-6'>
        {/* Player info */}
        <div className='text-center w-full'>
          <div className='font-nunito text-xs text-zinc-600 uppercase tracking-widest mb-4'>
            Round {round} · Player {currentPlayerIndex + 1} of {players.length}
          </div>
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center mx-auto mb-3 shadow-2xl`}
          >
            <span className='font-fredoka text-4xl text-white'>
              {player.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className='font-nunito text-zinc-400 text-sm uppercase tracking-widest mb-0.5'>
            It&apos;s your turn,
          </p>
          <h2 className='font-fredoka text-4xl text-white'>{player.name}</h2>
        </div>

        {/* Wheel */}
        <div className='relative flex items-center justify-center'>
          {/* Pointer */}
          <div
            className='absolute z-10'
            style={{
              top: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '11px solid transparent',
              borderRight: '11px solid transparent',
              borderTop: '20px solid #facc15',
              filter: 'drop-shadow(0 2px 4px rgba(250,204,21,0.5))'
            }}
          />
          <div
            className={`rounded-full ${isSpinning ? 'spin-pulse' : ''}`}
            style={{ lineHeight: 0 }}
          >
            <RouletteWheel rotation={rotation} isSpinning={isSpinning} />
          </div>
        </div>

        {/* Status */}
        <div className='h-7 flex items-center justify-center'>
          {landedIndex !== null && !isSpinning ? (
            <p className='landed-flash font-fredoka text-xl text-yellow-400'>
              {statusText}
            </p>
          ) : (
            <p className='font-nunito text-zinc-500 text-sm'>{statusText}</p>
          )}
        </div>

        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || landedIndex !== null}
          className={`w-full max-w-xs py-5 rounded-2xl font-fredoka text-2xl transition-all ${
            isSpinning || landedIndex !== null
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              : 'bg-yellow-400 text-zinc-900 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 active:scale-95'
          }`}
        >
          {isSpinning
            ? '🌀 Spinning...'
            : landedIndex !== null
            ? '✨ Hold on...'
            : '🎰 Spin!'}
        </button>

        {/* Player queue */}
        <div className='flex gap-2 flex-wrap justify-center'>
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

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen ({
  player,
  playerIndex,
  players,
  challengeIndex,
  nextPlayerIndex,
  onDone
}) {
  const challenge = CHALLENGES[challengeIndex]
  const colorGradient = PLAYER_COLORS[playerIndex % PLAYER_COLORS.length]
  const otherPlayers = players.filter((_, i) => i !== playerIndex)

  const [visible, setVisible] = useState(false)
  const [pickedPlayer, setPickedPlayer] = useState(null)
  const [isPicking, setIsPicking] = useState(false)
  const [giveTargets, setGiveTargets] = useState([])

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handlePickRandom = useCallback(() => {
    if (isPicking || otherPlayers.length === 0) return
    setIsPicking(true)
    setPickedPlayer(null)

    const totalTicks = 10 + Math.floor(Math.random() * 6)
    let tick = 0
    const delays = Array.from(
      { length: totalTicks },
      (_, i) => 50 + Math.floor((i / totalTicks) ** 2 * 200)
    )

    const next = () => {
      setPickedPlayer(otherPlayers[tick % otherPlayers.length])
      tick++
      if (tick < totalTicks) setTimeout(next, delays[tick])
      else setIsPicking(false)
    }
    setTimeout(next, delays[0])
  }, [isPicking, otherPlayers])

  const handleGiveToggle = useCallback(name => {
    setGiveTargets(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }, [])

  const fadeIn = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition:
      'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)'
  }

  return (
    <GameLayout>
      <style>{`
        @keyframes challengePop {
          0%   { opacity: 0; transform: scale(0.88); }
          65%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        .challenge-pop { animation: challengePop 0.45s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
      `}</style>

      <div className='flex flex-col flex-1 py-8'>
        {/* Player header */}
        <div className='flex items-center gap-4 mb-6' style={fadeIn}>
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
              spun the wheel
            </p>
          </div>
          <div
            className='ml-auto px-3 py-1.5 rounded-full font-fredoka text-sm border-2'
            style={{
              borderColor: `${challenge.color}80`,
              color: challenge.color,
              background: `${challenge.color}15`
            }}
          >
            {challenge.emoji} {challenge.label}
          </div>
        </div>

        {/* Challenge card */}
        <div
          className='challenge-pop flex-1 flex flex-col items-center justify-center rounded-3xl border-2 p-8 mb-6'
          style={{
            background: `${challenge.color}12`,
            borderColor: `${challenge.color}45`
          }}
        >
          <div className='text-6xl mb-5'>{challenge.emoji}</div>
          <p className='font-nunito text-white text-lg lg:text-xl text-center leading-relaxed max-w-sm mb-6'>
            {challenge.text}
          </p>

          {/* pick */}
          {challenge.type === 'pick' && otherPlayers.length > 0 && (
            <div className='w-full max-w-xs space-y-3'>
              {pickedPlayer && (
                <div
                  className={`w-full py-3 rounded-2xl text-center font-fredoka text-2xl border-2 transition-all ${
                    isPicking
                      ? 'border-zinc-700 text-zinc-400 bg-zinc-800/40'
                      : 'border-yellow-400 text-yellow-300 bg-yellow-400/10'
                  }`}
                >
                  {isPicking ? '...' : `👉 ${pickedPlayer.name} drinks!`}
                </div>
              )}
              <button
                onClick={handlePickRandom}
                disabled={isPicking}
                className='w-full py-3 rounded-2xl font-nunito font-bold text-sm bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white active:scale-95 transition-all'
              >
                🎲 Pick Random Player
              </button>
            </div>
          )}

          {/* give */}
          {challenge.type === 'give' && otherPlayers.length > 0 && (
            <div className='w-full max-w-xs space-y-2'>
              <p className='font-nunito text-xs text-zinc-500 text-center mb-2 uppercase tracking-widest'>
                Assign sips to
              </p>
              {otherPlayers.map((p, i) => {
                const isSelected = giveTargets.includes(p.name)
                return (
                  <button
                    key={i}
                    onClick={() => handleGiveToggle(p.name)}
                    className={`w-full py-2.5 px-4 rounded-xl font-nunito text-sm border-2 flex items-center justify-between transition-all active:scale-95 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-500/15 text-pink-300'
                        : 'border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    <span>{p.name}</span>
                    {isSelected && (
                      <span className='text-pink-400'>🍺 Drink!</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* next */}
          {challenge.type === 'next' && (
            <div
              className='px-5 py-3 rounded-2xl border-2 font-fredoka text-xl'
              style={{
                borderColor: '#ea580c80',
                color: '#fb923c',
                background: '#ea580c15'
              }}
            >
              🔥 Next up: {players[nextPlayerIndex].name}
            </div>
          )}

          {/* all */}
          {challenge.type === 'all' && (
            <div className='flex gap-2 flex-wrap justify-center'>
              {players.map((p, i) => (
                <div
                  key={i}
                  className='px-3 py-1 rounded-full font-nunito text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                >
                  {p.name} 🥂
                </div>
              ))}
            </div>
          )}

          {/* skip */}
          {challenge.type === 'skip' && (
            <div className='px-5 py-2.5 rounded-2xl border-2 font-fredoka text-lg text-cyan-400 bg-cyan-500/10 border-cyan-500/40'>
              ⏭️ {player.name}&apos;s turn is skipped!
            </div>
          )}
        </div>

        {/* Done */}
        <button
          onClick={onDone}
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s 0.3s' }}
          className='w-full py-4 rounded-2xl font-fredoka text-xl bg-yellow-400 text-zinc-900 hover:bg-yellow-300 active:scale-95 transition-all shadow-lg shadow-yellow-400/20'
        >
          Done ✓
        </button>
      </div>
    </GameLayout>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ChallengeRouletteGame () {
  const [phase, setPhase] = useState(PHASE.SETUP)
  const [players, setPlayers] = useState([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [challengeIndex, setChallengeIndex] = useState(null)

  const handleStart = ({ names }) => {
    setPlayers(shuffle(names).map(name => ({ name })))
    setCurrentPlayerIndex(0)
    setRound(1)
    setPhase(PHASE.TRANSITION)
  }

  const handleResult = useCallback(idx => {
    setChallengeIndex(idx)
    setPhase(PHASE.RESULT)
  }, [])

  const handleDone = useCallback(() => {
    const nextIndex = currentPlayerIndex + 1
    if (nextIndex >= players.length) {
      setRound(r => r + 1)
      setCurrentPlayerIndex(0)
    } else {
      setCurrentPlayerIndex(nextIndex)
    }
    setChallengeIndex(null)
    setPhase(PHASE.SPIN)
  }, [currentPlayerIndex, players.length])

  const nextPlayerIndex = (currentPlayerIndex + 1) % (players.length || 1)

  return (
    <>
      {phase === PHASE.SETUP && <SetupScreen onStart={handleStart} />}

      {(phase === PHASE.TRANSITION || phase === PHASE.SPIN) && (
        <SpinScreen
          players={players}
          currentPlayerIndex={currentPlayerIndex}
          round={round}
          onResult={handleResult}
        />
      )}

      {phase === PHASE.TRANSITION && (
        <GameTransition
          emoji='🎰'
          title='Challenge Roulette'
          onDone={() => setPhase(PHASE.SPIN)}
        />
      )}

      {phase === PHASE.RESULT && challengeIndex !== null && (
        <ResultScreen
          key={`${currentPlayerIndex}-${round}`}
          player={players[currentPlayerIndex]}
          playerIndex={currentPlayerIndex}
          players={players}
          challengeIndex={challengeIndex}
          nextPlayerIndex={nextPlayerIndex}
          onDone={handleDone}
        />
      )}
    </>
  )
}
