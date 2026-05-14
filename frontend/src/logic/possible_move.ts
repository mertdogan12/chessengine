import { get_xy, o2trick, reverse_bits, type Bitboard } from "./bitboard";
import { Color, PieceType, type Piece } from "../components/piece";
import { get_opponent_pieces, get_pieces } from "../gamestate";

const FILE_A: Bitboard = 0x0101010101010101n;
const FILE_H: Bitboard = 0x8080808080808080n;
const FILE_AB = FILE_A | (FILE_A << 1n);
const FILE_GH = FILE_H | (FILE_H >> 1n);
const FILE_1: Bitboard = 0x00000000000000ffn;
const FILE_8: Bitboard = 0xff00000000000000n;

const rock_moves = (
  x: number,
  y: number,
  pieces: Bitboard,
  piece: Bitboard,
): Bitboard => {
  const maskH = FILE_A << BigInt(x);
  const maskV = FILE_1 << BigInt(y * 8);

  return (
    o2trick(pieces, piece, maskV) |
    reverse_bits(
      o2trick(reverse_bits(pieces), reverse_bits(piece), reverse_bits(maskV)),
    ) |
    o2trick(pieces, piece, maskH) |
    reverse_bits(
      o2trick(reverse_bits(pieces), reverse_bits(piece), reverse_bits(maskH)),
    )
  );
};

const bishop_moves = (
  x: number,
  y: number,
  pieces: Bitboard,
  piece: Bitboard,
): Bitboard => {
  let maskRD = 0x8040201008040201n << BigInt(x - y);
  let maskRD2 = maskRD;

  let maskLD = 0x0102040810204080n << BigInt(x + y - 7);
  let maskLD2 = maskLD;

  for (let i = 0; i < 8; i++) {
    if (i < x) {
      maskRD &= ~(FILE_A << BigInt(i));
      maskLD2 &= ~(FILE_A << BigInt(i));
    } else if (i > x) {
      maskRD2 &= ~(FILE_A << BigInt(i));
      maskLD &= ~(FILE_A << BigInt(i));
    }
  }

  return (
    o2trick(pieces, piece, maskRD) |
    reverse_bits(
      o2trick(reverse_bits(pieces), reverse_bits(piece), reverse_bits(maskRD2)),
    ) |
    o2trick(pieces, piece, maskLD) |
    reverse_bits(
      o2trick(reverse_bits(pieces), reverse_bits(piece), reverse_bits(maskLD2)),
    )
  );
};

/**
 * Get the possible moves for a single piece
 *
 * @param piece the piece to get the possible moves for
 * @param onlyAttacks whether to only consider attacking moves
 * @returns the possible moves for the piece
 */
export const get_possible_moves = (
  piece: Piece,
  onlyAttacks: boolean,
): Bitboard => {
  const x = get_xy(piece.position)[0];
  const y = get_xy(piece.position)[1];

  let moves: Bitboard;

  const ownColorPieces = get_pieces(piece.color)
    .map((p) => p.position)
    .reduce((a, b) => a | b, 0n);

  const opponentColorPieces = get_opponent_pieces(piece.color)
    .map((p) => p.position)
    .reduce((a, b) => a | b, 0n);

  switch (piece.type) {
    case PieceType.Pawn:
      moves = onlyAttacks
        ? 0n
        : (piece.position << (piece.color === Color.White ? 8n : -8n)) &
          ~opponentColorPieces;

      var attacks =
        ((piece.position << (piece.color === Color.White ? 7n : -9n)) &
          ~FILE_H &
          opponentColorPieces) |
        ((piece.position << (piece.color === Color.White ? 9n : -7n)) &
          ~FILE_A &
          opponentColorPieces);

      moves |= attacks;

      if (
        (piece.color === Color.White && y === 1) ||
        (piece.color === Color.Black && y === 6)
      ) {
        moves |=
          (piece.position << (piece.color === Color.White ? 16n : -16n)) &
          ~opponentColorPieces &
          ~(
            ((piece.position << (piece.color === Color.White ? 8n : -8n)) &
              (opponentColorPieces | ownColorPieces)) <<
            (piece.color === Color.White ? 8n : -8n)
          );
      }
      break;

    case PieceType.Knight:
      moves =
        ((piece.position << 17n) & ~FILE_A) |
        ((piece.position << 15n) & ~FILE_H) |
        ((piece.position << 10n) & ~FILE_AB) |
        ((piece.position << 6n) & ~FILE_GH) |
        ((piece.position >> 17n) & ~FILE_H) |
        ((piece.position >> 15n) & ~FILE_A) |
        ((piece.position >> 10n) & ~FILE_GH) |
        ((piece.position >> 6n) & ~FILE_AB);
      break;

    case PieceType.Queen:
      moves =
        rock_moves(x, y, opponentColorPieces | ownColorPieces, piece.position) |
        bishop_moves(
          x,
          y,
          opponentColorPieces | ownColorPieces,
          piece.position,
        );
      break;

    case PieceType.Rook:
      moves = rock_moves(
        x,
        y,
        opponentColorPieces | ownColorPieces,
        piece.position,
      );
      break;

    case PieceType.Bishop:
      moves = bishop_moves(
        x,
        y,
        opponentColorPieces | ownColorPieces,
        piece.position,
      );
      break;

    case PieceType.King:
      moves =
        ((piece.position << 8n) & ~FILE_1) |
        ((piece.position >> 8n) & ~FILE_8) |
        ((piece.position << 1n) & ~FILE_A) |
        ((piece.position >> 1n) & ~FILE_H) |
        ((piece.position << 9n) & ~FILE_1 & ~FILE_A) |
        ((piece.position << 7n) & ~FILE_1 & ~FILE_H) |
        ((piece.position >> 9n) & ~FILE_8 & ~FILE_H) |
        ((piece.position >> 7n) & ~FILE_8 & ~FILE_A);
      break;

    default:
      return 0n;
  }

  return moves & ~ownColorPieces & 0xffffffffffffffffn;
};

/**
 * Check if rochade is possible for a given color
 *
 * @param color the color to check rochade for
 * @returns a tuple of booleans indicating whether long and short rochade are possible, respectively
 */
export const rochade_possible = (
  color: (typeof Color)[keyof typeof Color],
): [boolean, boolean] => {
  let maskShort: Bitboard = 0b1100000n;
  let maskLong: Bitboard = 0b1110n;

  if (color === Color.Black) {
    maskLong <<= 56n;
    maskShort <<= 56n;
  }

  const ownColorPieces = get_pieces(color)
    .map((p) => p.position)
    .reduce((a, b) => a | b, 0n);

  const attacks = get_opponent_pieces(color)
    .map((piece) => get_possible_moves(piece, true))
    .reduce((a, b) => a | b, 0n);

  return [
    (maskLong & (attacks | ownColorPieces)) === 0n,
    (maskShort & (attacks | ownColorPieces)) === 0n,
  ];
};
