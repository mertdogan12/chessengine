import { type Bitboard } from "./bitboard";
import { Color, PieceType, type Piece } from "../components/piece";
import { get_pieces } from "../gamestate";

const FILE_A: Bitboard = 0x0101010101010101n;
const FILE_H: Bitboard = 0x8080808080808080n;
const FILE_AB = FILE_A | FILE_A << 1n;
const FILE_GH = FILE_H | FILE_H >> 1n;

export const get_possible_moves = (piece: Piece): Bitboard => {
    let moves: Bitboard;

    switch(piece.type) {
        case PieceType.Pawn:
            moves = piece.position << (piece.color === Color.White ? 8n : -8n);
            break;

        case PieceType.Knight:
            moves = piece.position << 17n & ~FILE_A |
                piece.position << 15n & ~FILE_H |
                piece.position << 10n & ~FILE_AB |
                piece.position << 6n & ~FILE_GH |
                piece.position >> 17n & ~FILE_H |
                piece.position >> 15n & ~FILE_A |
                piece.position >> 10n & ~FILE_GH |
                piece.position >> 6n & ~FILE_AB;
            break;

        case PieceType.Bishop:
            moves = 0n;

        default:
            return 0n;
    }

    const coloredPieces = get_pieces()
        .filter(p => p.color === piece.color)
        .map(p => p.position)
        .reduce((a, b) => a | b, 0n);

    return moves & ~coloredPieces;
};
