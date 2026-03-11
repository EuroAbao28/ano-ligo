import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import GamePage from './pages/GamePage'
import ComingSoon from './pages/ComingSoon'
import PlayDispatcher from './pages/PlayDispatcher'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/game/:id' element={<GamePage />}>
        <Route index element={<ComingSoon />} />
        <Route path='play' element={<PlayDispatcher />} />
      </Route>
    </Routes>
  )
}

export default App
