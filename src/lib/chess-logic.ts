export type Player = 'w' | 'b';
export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type Piece = { id: string; type: PieceType; color: Player };
export type Square = Piece | null;
export type Board = Square[][];
export type Position = { row: number; col: number };
export type Move = { from: Position; to: Position; piece: Piece };
const PIECE_ORDER: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
export const initializeBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  let idCounter = 0;
  for (let i = 0; i < 8; i++) {
    board[1][i] = { id: `bp-${i}`, type: 'p', color: 'b' };
    board[6][i] = { id: `wp-${i}`, type: 'p', color: 'w' };
  }
  for (let i = 0; i < 8; i++) {
    board[0][i] = { id: `b${PIECE_ORDER[i]}-${i}`, type: PIECE_ORDER[i], color: 'b' };
    board[7][i] = { id: `w${PIECE_ORDER[i]}-${i}`, type: PIECE_ORDER[i], color: 'w' };
  }
  return board;
};
const isSquareAttacked = (board: Board, position: Position, attackerColor: Player): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === attackerColor) {
        const moves = getValidMoves(board, { row: r, col: c }, [], true); // Pass true to skip castling check
        if (moves.some(m => m.row === position.row && m.col === position.col)) {
          return true;
        }
      }
    }
  }
  return false;
}
export const getValidMoves = (board: Board, from: Position, moveHistory: Move[], skipCastling = false): Position[] => {
  const piece = board[from.row][from.col];
  if (!piece) return [];
  const moves: Position[] = [];
  const { type, color } = piece;
  const addMove = (to: Position) => {
    if (to.row >= 0 && to.row < 8 && to.col >= 0 && to.col < 8) {
      const targetPiece = board[to.row][to.col];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(to);
      }
    }
  };
  const addCaptureMove = (to: Position) => {
    if (to.row >= 0 && to.row < 8 && to.col >= 0 && to.col < 8) {
      const targetPiece = board[to.row][to.col];
      if (targetPiece && targetPiece.color !== color) {
        moves.push(to);
      }
    }
  };
  const addPawnMove = (to: Position) => {
    if (to.row >= 0 && to.row < 8 && to.col >= 0 && to.col < 8) {
      if (!board[to.row][to.col]) {
        moves.push(to);
      }
    }
  };
  if (type === 'p') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    addPawnMove({ row: from.row + dir, col: from.col });
    if (from.row === startRow && !board[from.row + dir][from.col]) {
      addPawnMove({ row: from.row + 2 * dir, col: from.col });
    }
    addCaptureMove({ row: from.row + dir, col: from.col - 1 });
    addCaptureMove({ row: from.row + dir, col: from.col + 1 });
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];
      if (lastMove && lastMove.piece.type === 'p' && Math.abs(lastMove.from.row - lastMove.to.row) === 2) {
        if (from.row === lastMove.to.row && Math.abs(from.col - lastMove.to.col) === 1) {
          moves.push({ row: from.row + dir, col: lastMove.to.col });
        }
      }
    }
  }
  if (type === 'r' || type === 'q') {
    for (let i = 1; i < 8; i++) { if (!checkLine(from, {row: i, col: 0}, moves, board, color)) break; }
    for (let i = 1; i < 8; i++) { if (!checkLine(from, {row: -i, col: 0}, moves, board, color)) break; }
    for (let i = 1; i < 8; i++) { if (!checkLine(from, {row: 0, col: i}, moves, board, color)) break; }
    for (let i = 1; i < 8; i++) { if (!checkLine(from, {row: 0, col: -i}, moves, board, color)) break; }
  }
  if (type === 'b' || type === 'q') {
    for (let i = 1; i < 8; i++) { if (!checkLine(from, {row: i, col: i}, moves, board, color)) break; }
    for (let i = 1; i < 8; i++) { if (!checkLine(from, {row: -i, col: -i}, moves, board, color)) break; }
    for (let i = 1; i < 8; i++) { if (!checkLine(from, {row: i, col: -i}, moves, board, color)) break; }
    for (let i = 1; i < 8; i++) { if (!checkLine(from, {row: -i, col: i}, moves, board, color)) break; }
  }
  if (type === 'n') {
    const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    knightMoves.forEach(([dr, dc]) => addMove({ row: from.row + dr, col: from.col + dc }));
  }
  if (type === 'k') {
    const kingMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    kingMoves.forEach(([dr, dc]) => addMove({ row: from.row + dr, col: from.col + dc }));
    if (!skipCastling) {
      const kingMoved = moveHistory.some(m => m.piece.type === 'k' && m.piece.color === color);
      const opponentColor = color === 'w' ? 'b' : 'w';
      if (!kingMoved && !isSquareAttacked(board, from, opponentColor)) {
        const rook1Moved = moveHistory.some(m => m.from.row === from.row && m.from.col === 0 && m.piece.type === 'r');
        if (!rook1Moved && board[from.row][0]?.type === 'r' && !board[from.row][1] && !board[from.row][2] && !board[from.row][3]) {
          if (!isSquareAttacked(board, { row: from.row, col: 2 }, opponentColor) && !isSquareAttacked(board, { row: from.row, col: 3 }, opponentColor)) {
            moves.push({ row: from.row, col: from.col - 2 });
          }
        }
        const rook2Moved = moveHistory.some(m => m.from.row === from.row && m.from.col === 7 && m.piece.type === 'r');
        if (!rook2Moved && board[from.row][7]?.type === 'r' && !board[from.row][5] && !board[from.row][6]) {
          if (!isSquareAttacked(board, { row: from.row, col: 5 }, opponentColor) && !isSquareAttacked(board, { row: from.row, col: 6 }, opponentColor)) {
            moves.push({ row: from.row, col: from.col + 2 });
          }
        }
      }
    }
  }
  return moves;
};
const checkLine = (from: Position, delta: {row: number, col: number}, moves: Position[], board: Board, color: Player): boolean => {
  const to = { row: from.row + delta.row, col: from.col + delta.col };
  if (to.row < 0 || to.row >= 8 || to.col < 0 || to.col >= 8) return false;
  const target = board[to.row][to.col];
  if (target) {
    if (target.color !== color) moves.push(to);
    return false;
  }
  moves.push(to);
  return true;
};
export const isKingInCheck = (board: Board, kingColor: Player): boolean => {
  let kingPos: Position | null = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === kingColor) {
        kingPos = { row: r, col: c };
        break;
      }
    }
    if (kingPos) break;
  }
  if (!kingPos) return false;
  const opponentColor = kingColor === 'w' ? 'b' : 'w';
  return isSquareAttacked(board, kingPos, opponentColor);
};
export const getLegalMoves = (board: Board, from: Position, moveHistory: Move[]): Position[] => {
  const piece = board[from.row][from.col];
  if (!piece) return [];
  const validMoves = getValidMoves(board, from, moveHistory);
  return validMoves.filter(to => {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;
    if (piece.type === 'k' && Math.abs(to.col - from.col) === 2) {
        const rookCol = to.col > from.col ? 7 : 0;
        const newRookCol = to.col > from.col ? 5 : 3;
        newBoard[from.row][newRookCol] = newBoard[from.row][rookCol];
        newBoard[from.row][rookCol] = null;
    }
    return !isKingInCheck(newBoard, piece.color);
  });
};
export const isCheckmate = (board: Board, kingColor: Player, moveHistory: Move[]): boolean => {
  if (!isKingInCheck(board, kingColor)) return false;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === kingColor) {
        if (getLegalMoves(board, { row: r, col: c }, moveHistory).length > 0) {
          return false;
        }
      }
    }
  }
  return true;
};
export const isStalemate = (board: Board, kingColor: Player, moveHistory: Move[]): boolean => {
  if (isKingInCheck(board, kingColor)) return false;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === kingColor) {
        if (getLegalMoves(board, { row: r, col: c }, moveHistory).length > 0) {
          return false;
        }
      }
    }
  }
  return true;
};