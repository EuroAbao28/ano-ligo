import { useOutletContext } from 'react-router'

export default function ComingSoon () {
  const { game } = useOutletContext()

  return (
    <div className='flex flex-col items-center justify-center flex-1 px-4'>
      <div
        className={`h-1 w-24 rounded-full bg-linear-to-r ${game.color} mb-8`}
      />
      <span className='text-7xl mb-4'>{game.emoji}</span>
      <h1 className='font-fredoka text-5xl mb-4'>{game.title}</h1>
      <p className='font-nunito text-zinc-500'>Game coming soon... 👀</p>
    </div>
  )
}
