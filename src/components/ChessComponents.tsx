import React from 'react';
import { motion } from 'framer-motion';
import {
  ChessRook,
  ChessKnight,
  ChessBishop,
  ChessQueen,
  ChessKing,
  ChessPawn,
  LucideProps,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Piece, PieceType, Player, Position } from '@/lib/chess-logic';
import { useGameStore } from '@/stores/useGameStore';
import { Button } from '@/components/ui/button';
const pieceMap: Record<PieceType, React.FC<LucideProps>> = {
  r: ChessRook,
  n: ChessKnight,
  b: ChessBishop,
  q: ChessQueen,
  k: ChessKing,
  p: ChessPawn,
};
interface ChessPieceProps {
  piece: Piece;
  isSelected: boolean;
}
export const ChessPiece: React.FC<ChessPieceProps> = React.memo(({ piece, isSelected }) => {
  const Icon = pieceMap[piece.type];
  const isWhite = piece.color === 'w';
  return (
    <motion.div
      className={cn(
        'w-full h-full flex items-center justify-center cursor-pointer',
        isWhite ? 'text-neon-cyan text-glow-cyan' : 'text-neon-magenta text-glow-magenta',
        isSelected && 'animate-pulse'
      )}
      layoutId={`${piece.type}-${piece.color}-${piece.position}`}
    >
      <Icon className="w-3/4 h-3/4" strokeWidth={1.5} />
    </motion.div>
  );
});
ChessPiece.displayName = 'ChessPiece';
interface ChessSquareProps {
  piece: Piece | null;
  position: Position;
  isLight: boolean;
  isValidMove: boolean;
  isSelected: boolean;
}
export const ChessSquare: React.FC<ChessSquareProps> = React.memo(({ piece, position, isLight, isValidMove, isSelected }) => {
  const selectPiece = useGameStore((s) => s.actions.selectPiece);
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        isLight ? 'bg-stone-600/50' : 'bg-stone-900/50',
      )}
      onClick={() => selectPiece(position)}
    >
      {piece && <ChessPiece piece={piece} isSelected={isSelected} />}
      {isValidMove && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={cn(
            'rounded-full bg-neon-green',
            piece ? 'w-full h-full bg-opacity-30 border-4 border-neon-green' : 'w-1/3 h-1/3 bg-opacity-70'
          )} />
        </motion.div>
      )}
    </div>
  );
});
ChessSquare.displayName = 'ChessSquare';
interface CapturedPiecesPanelProps {
  pieces: Piece[];
  player: Player;
}
export const CapturedPiecesPanel: React.FC<CapturedPiecesPanelProps> = ({ pieces, player }) => {
  return (
    <div className="flex flex-col items-center p-2 md:p-4 border-2 border-neon-magenta/50 rounded-lg bg-black/30 h-full">
      <h3 className="font-mono text-lg text-neon-magenta mb-2">{player === 'w' ? 'Magenta' : 'Cyan'} Captures</h3>
      <div className="grid grid-cols-4 gap-1 flex-grow w-full">
        {pieces.map((p, i) => {
          const Icon = pieceMap[p.type];
          return (
            <div key={`${p.type}-${p.color}-${i}`} className={cn('text-sm md:text-base', p.color === 'w' ? 'text-neon-cyan/70' : 'text-neon-magenta/70')}>
              <Icon className="w-full h-auto" strokeWidth={1.5} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const GameStatusDisplay: React.FC = () => {
  const turn = useGameStore((s) => s.turn);
  const gameStatus = useGameStore((s) => s.gameStatus);
  let message = '';
  if (gameStatus === 'playing') {
    message = `${turn === 'w' ? 'Cyan' : 'Magenta'}'s Turn`;
  } else if (gameStatus === 'checkmate') {
    message = `Checkmate! ${turn === 'b' ? 'Cyan' : 'Magenta'} wins!`;
  } else if (gameStatus === 'stalemate') {
    message = 'Stalemate! It\'s a draw.';
  } else if (gameStatus === 'promotion') {
    message = 'Promote your pawn!';
  }
  return (
    <div className="text-center p-4">
      <h2 className={cn(
        "text-2xl md:text-4xl font-mono font-bold tracking-widest animate-glow",
        turn === 'w' ? 'text-neon-cyan text-glow-cyan' : 'text-neon-magenta text-glow-magenta',
        gameStatus !== 'playing' && 'text-neon-green text-glow-green'
      )}>
        {message}
      </h2>
    </div>
  );
};
export const PromotionDialog: React.FC = () => {
    const promotePawn = useGameStore((s) => s.actions.promotePawn);
    const turn = useGameStore((s) => s.turn);
    const promotionPieces: PieceType[] = ['q', 'r', 'b', 'n'];
    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="flex flex-col items-center p-8 border-2 border-neon-green rounded-lg bg-stone-900 shadow-lg shadow-neon-green/20">
                <h3 className="text-2xl font-mono text-neon-green mb-6">Promote Pawn</h3>
                <div className="flex gap-4">
                    {promotionPieces.map(pType => {
                        const Icon = pieceMap[pType];
                        return (
                            <Button
                                key={pType}
                                onClick={() => promotePawn(pType)}
                                className={cn(
                                    'w-16 h-16 p-2 bg-stone-800 border-2 border-transparent hover:border-neon-green transition-all',
                                    turn === 'w' ? 'text-neon-cyan text-glow-cyan' : 'text-neon-magenta text-glow-magenta'
                                )}
                            >
                                <Icon className="w-full h-full" />
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};