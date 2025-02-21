import TicTacToe from '@/app/components/game/TicTacToe'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="container mx-auto">
        <TicTacToe />
      </div>
    </main>
  )
}