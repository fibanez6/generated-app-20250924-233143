import React from 'react';
import { useGameStore } from '@/stores/useGameStore';
import {
  ChessSquare,
  CapturedPiecesPanel,
  GameStatusDisplay,
  PromotionDialog,
} from '@/components/ChessComponents';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const GlitchButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'font-mono text-lg bg-transparent border-2 text-neon-green border-neon-green hover:bg-neon-green hover:text-black hover:shadow-[0_0_20px_theme(colors.neon-green)] transition-all duration-300 relative group',
          className
        )}
        {...props}
      >
        <span className="absolute inset-0 bg-transparent transition-all duration-300 group-hover:bg-neon-green/20"></span>
        <span className="relative z-10 transition-all duration-300 group-hover:text-shadow-[0_0_10px_black]">
          {children}
        </span>
        <span className="absolute inset-0 z-10 text-neon-green opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-glitch">
          {children}
        </span>
      </Button>
    );
  }
);
GlitchButton.displayName = 'GlitchButton';
const ChessBoard: React.FC = () => {
  const board = useGameStore((s) => s.board);
  const selectedPiece = useGameStore((s) => s.selectedPiece);
  const validMoves = useGameStore((s) => s.validMoves);
  return (
    <div className="grid grid-cols-8 grid-rows-8 aspect-square w-full max-w-[calc(100vh-20rem)] mx-auto border-4 border-neon-cyan/50 shadow-[0_0_20px_theme(colors.neon-cyan),inset_0_0_20px_theme(colors.neon-cyan)]">
      {board.map((row, r) =>
        row.map((piece, c) => (
          <ChessSquare
            key={`${r}-${c}`}
            piece={piece}
            position={{ row: r, col: c }}
            isLight={(r + c) % 2 !== 0}
            isValidMove={validMoves.some(m => m.row === r && m.col === c)}
            isSelected={selectedPiece?.row === r && selectedPiece?.col === c}
          />
        ))
      )}
    </div>
  );
};
export function HomePage() {
  const newGame = useGameStore((s) => s.actions.newGame);
  const capturedByWhite = useGameStore((s) => s.capturedPieces.w);
  const capturedByBlack = useGameStore((s) => s.capturedPieces.b);
  const gameStatus = useGameStore((s) => s.gameStatus);
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#1a1a1a] text-white font-mono p-2 sm:p-4 lg:p-8 relative overflow-hidden">
      <div className="scanline-overlay" />
      <div className="absolute inset-0 bg-grid-cyan-500/10 [mask-image:linear-gradient(to_bottom,white_5%,transparent)]"></div>
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-4 z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-neon-cyan text-glow-cyan tracking-[0.2em] my-4">
          RETROCHESS
        </h1>
        <GameStatusDisplay />
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-8">
          <div className="w-full md:w-auto order-2 md:order-1">
            <CapturedPiecesPanel pieces={capturedByWhite} player="b" />
          </div>
          <div className="w-full md:w-auto order-1 md:order-2 relative">
            <ChessBoard />
            {gameStatus === 'promotion' && <PromotionDialog />}
          </div>
          <div className="w-full md:w-auto order-3 md:order-3">
            <CapturedPiecesPanel pieces={capturedByBlack} player="w" />
          </div>
        </div>
        <div className="mt-6">
          <GlitchButton onClick={newGame}>
            New Game
          </GlitchButton>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center text-muted-foreground/50 text-sm">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
    </main>
  );
}