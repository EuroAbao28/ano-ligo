import { useParams } from 'react-router'
import ImpostorGame from './games/ImpostorGame'
import TruthOrDareGame from './games/TruthOrDareGame'
import ComingSoon from './ComingSoon'
import ChallengeRouletteGame from './games/ChalllengeRouletteGame'

const GAME_COMPONENTS = {
  1: ImpostorGame,
  2: TruthOrDareGame,
  7: ChallengeRouletteGame
}

export default function PlayDispatcher () {
  const { id } = useParams()
  const GameComponent = GAME_COMPONENTS[id]

  if (!GameComponent) return <ComingSoon />
  return <GameComponent />
}
