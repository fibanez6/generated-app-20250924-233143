import { create } from 'zustand';
import {
  Board,
  initializeBoard,
  Player,
  Position,
  Piece,
  getLegalMoves,
  isCheckmate,
  isStalemate,
  PieceType,
} from '@/lib/chess-logic';
type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'promotion';
interface GameState {
  board: Board;
  turn: Player;
  selectedPiece: Position | null;
  validMoves: Position[];
  capturedPieces: { w: Piece[]; b: Piece[] };
  gameStatus: GameStatus;
  promotionSquare: { pos: Position; pawnId: string } | null;
  moveHistory: { piece: Piece; from: Position; to: Position }[];
  actions: {
    newGame: () => void;
    selectPiece: (pos: Position) => void;
    movePiece: (to: Position) => void;
    promotePawn: (pieceType: PieceType) => void;
  };
}
export const useGameStore = create<GameState>((set, get) => ({
  board: initializeBoard(),
  turn: 'w',
  selectedPiece: null,
  validMoves: [],
  capturedPieces: { w: [], b: [] },
  gameStatus: 'playing',
  promotionSquare: null,
  moveHistory: [],
  actions: {
    newGame: () => set({
      board: initializeBoard(),
      turn: 'w',
      selectedPiece: null,
      validMoves: [],
      capturedPieces: { w: [], b: [] },
      gameStatus: 'playing',
      promotionSquare: null,
      moveHistory: [],
    }),
    selectPiece: (pos) => {
      const { board, turn, gameStatus, selectedPiece } = get();
      if (gameStatus !== 'playing') return;
      const piece = board[pos.row][pos.col];
      if (selectedPiece && selectedPiece.row === pos.row && selectedPiece.col === pos.col) {
        set({ selectedPiece: null, validMoves: [] });
        return;
      }
      if (piece && piece.color === turn) {
        const legalMoves = getLegalMoves(board, pos, get().moveHistory);
        set({ selectedPiece: pos, validMoves: legalMoves });
      } else if (selectedPiece) {
        get().actions.movePiece(pos);
      }
    },
    movePiece: (to) => {
      const { board, turn, selectedPiece, validMoves, moveHistory } = get();
      if (!selectedPiece || !validMoves.some(m => m.row === to.row && m.col === to.col)) {
        return;
      }
      const from = selectedPiece;
      const piece = board[from.row][from.col]!;
      const newBoard = JSON.parse(JSON.stringify(board));
      let captured = newBoard[to.row][to.col];
      // Handle en passant capture
      if (piece.type === 'p' && to.col !== from.col && !captured) {
        const dir = piece.color === 'w' ? 1 : -1;
        const capturedPawnPos = { row: to.row + dir, col: to.col };
        captured = newBoard[capturedPawnPos.row][capturedPawnPos.col];
        newBoard[capturedPawnPos.row][capturedPawnPos.col] = null;
      }
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;
      // Handle castling
      if (piece.type === 'k' && Math.abs(to.col - from.col) === 2) {
        const rookCol = to.col > from.col ? 7 : 0;
        const newRookCol = to.col > from.col ? 5 : 3;
        newBoard[from.row][newRookCol] = newBoard[from.row][rookCol];
        newBoard[from.row][rookCol] = null;
      }
      const newTurn = turn === 'w' ? 'b' : 'w';
      const newHistory = [...moveHistory, { piece, from, to }];
      // Pawn promotion
      if (piece.type === 'p' && (to.row === 0 || to.row === 7)) {
        set({
          board: newBoard,
          gameStatus: 'promotion',
          promotionSquare: { pos: to, pawnId: piece.id },
          selectedPiece: null,
          validMoves: [],
          moveHistory: newHistory,
          capturedPieces: captured ? { ...get().capturedPieces, [turn]: [...get().capturedPieces[turn], captured] } : get().capturedPieces,
        });
        return;
      }
      let newGameStatus: GameStatus = 'playing';
      if (isCheckmate(newBoard, newTurn, newHistory)) {
        newGameStatus = 'checkmate';
      } else if (isStalemate(newBoard, newTurn, newHistory)) {
        newGameStatus = 'stalemate';
      }
      set(state => ({
        board: newBoard,
        turn: newTurn,
        selectedPiece: null,
        validMoves: [],
        capturedPieces: captured ? { ...state.capturedPieces, [turn]: [...state.capturedPieces[turn], captured] } : state.capturedPieces,
        gameStatus: newGameStatus,
        moveHistory: newHistory,
      }));
    },
    promotePawn: (pieceType: PieceType) => {
      const { board, promotionSquare, turn } = get();
      if (!promotionSquare) return;
      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[promotionSquare.pos.row][promotionSquare.pos.col] = {
        id: promotionSquare.pawnId,
        type: pieceType,
        color: turn,
      };
      const newTurn = turn === 'w' ? 'b' : 'w';
      let newGameStatus: GameStatus = 'playing';
      if (isCheckmate(newBoard, newTurn, get().moveHistory)) {
        newGameStatus = 'checkmate';
      } else if (isStalemate(newBoard, newTurn, get().moveHistory)) {
        newGameStatus = 'stalemate';
      }
      set({
        board: newBoard,
        turn: newTurn,
        gameStatus: newGameStatus,
        promotionSquare: null,
      });
    },
  },
}));