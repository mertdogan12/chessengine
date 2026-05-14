import { get_xy, o2trick, reverse_bits, type Bitboard } from "./bitboard";
import { Color, PieceType, type Piece } from "../components/piece";
import { get_pieces } from "../gamestate";

const FILE_A: Bitboard = 0x0101010101010101n;
const FILE_H: Bitboard = 0x8080808080808080n;
const FILE_AB = FILE_A | (FILE_A << 1n);
const FILE_GH = FILE_H | (FILE_H >> 1n);
const FILE_1: Bitboard = 0x00000000000000ffn;
const FILE_8: Bitboard = 0xff00000000000000n;

const sliding_moves = (
  pieces: Bitboard,
  position: Bitboard,
  mask: Bitboard,
): Bitboard =>
  o2trick(pieces, position, mask) |
  reverse_bits(
    o2trick(reverse_bits(pieces), reverse_bits(position), reverse_bits(mask)),
  );

export const get_possible_moves = (piece: Piece): Bitboard => {
  const x = get_xy(piece.position)[0];
  const y = get_xy(piece.position)[1];

  let moves: Bitboard;

  const ownColorPieces = get_pieces(piece.color)
    .map((p) => p.position)
    .reduce((a, b) => a | b, 0n);

  const opponentColorPieces = get_pieces(
    ((piece.color + 1) % 2) as (typeof Color)[keyof typeof Color],
  )
    .map((p) => p.position)
    .reduce((a, b) => a | b, 0n);

  switch (piece.type) {
    case PieceType.Pawn:
      moves =
        (piece.position << (piece.color === Color.White ? 8n : -8n)) &
        ~opponentColorPieces;
      var attacks =
        ((piece.position << (piece.color === Color.White ? 7n : -9n)) &
          ~FILE_H &
          opponentColorPieces) |
        ((piece.position << (piece.color === Color.White ? 9n : -7n)) &
          ~FILE_A &
          opponentColorPieces);
      moves |= attacks;
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
    case PieceType.Rook:
      const maskH = FILE_A << BigInt(x);
      const maskV = FILE_1 << BigInt(y * 8);

      moves =
        sliding_moves(
          opponentColorPieces | ownColorPieces,
          piece.position,
          maskV,
        ) |
        sliding_moves(
          opponentColorPieces | ownColorPieces,
          piece.position,
          maskH,
        );
      break;

    case PieceType.Bishop:
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

      moves =
        o2trick(opponentColorPieces | ownColorPieces, piece.position, maskRD) |
        reverse_bits(
          o2trick(
            reverse_bits(opponentColorPieces | ownColorPieces),
            reverse_bits(piece.position),
            reverse_bits(maskRD2),
          ),
        ) |
        o2trick(opponentColorPieces | ownColorPieces, piece.position, maskLD) |
        reverse_bits(
          o2trick(
            reverse_bits(opponentColorPieces | ownColorPieces),
            reverse_bits(piece.position),
            reverse_bits(maskLD2),
          ),
        );
      break;

    default:
      return 0n;
  }

  return moves & ~ownColorPieces & 0xffffffffffffffffn;
};
