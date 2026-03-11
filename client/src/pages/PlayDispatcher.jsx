import { useParams } from 'react-router'
import ImpostorGame from './games/ImpostorGame'
import TruthOrDareGame from './games/TruthOrDareGame'
import ComingSoon from './ComingSoon'

const GAME_COMPONENTS = {
  1: ImpostorGame,
  2: TruthOrDareGame
}

export default function PlayDispatcher () {
  const { id } = useParams()
  const GameComponent = GAME_COMPONENTS[id]

  if (!GameComponent) return <ComingSoon />
  return <GameComponent />
}
