import { GameBoard } from '@/components/game/GameBoard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-8">
      <h1 className="text-2xl font-bold mb-6">Sudoku</h1>
      <GameBoard />
    </main>
  );
}
