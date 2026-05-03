import { get_xy, o2trick, type Bitboard } from "./bitboard";
import { Color, PieceType, type Piece } from "../components/piece";
import { get_pieces } from "../gamestate";

const FILE_A: Bitboard = 0x0101010101010101n;
const FILE_H: Bitboard = 0x8080808080808080n;
const FILE_AB = FILE_A | FILE_A << 1n;
const FILE_GH = FILE_H | FILE_H >> 1n;

export const get_possible_moves = (piece: Piece): Bitboard => {
    let moves: Bitboard;

    const ownColorPieces = get_pieces(piece.color)
        .map(p => p.position)
        .reduce((a, b) => a | b, 0n);

    const opponentColorPieces = get_pieces((piece.color + 1) % 2 as typeof Color[keyof typeof Color])
        .map(p => p.position)
        .reduce((a, b) => a | b, 0n);

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

        case PieceType.Rook:
            const x = get_xy(piece.position)[0];
            const mask = FILE_A << BigInt(x);
            moves = o2trick(opponentColorPieces | ownColorPieces, piece.position, mask);
            break;

        default:
            return 0n;
    }

    return moves & ~ownColorPieces;
};
