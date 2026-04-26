import { type Bitboard } from "./bitboard";
import { type Piece } from "../components/piece";

const FILE_A: Bitboard = 0x0101010101010101n;
const FILE_H: Bitboard = 0x8080808080808080n;

export const get_possible_moves = (piece: Piece): Bitboard => {
    switch(piece.type) {
        case "pawn":
            return piece.position << 8n;

        default:
            return 0n;
    }
};
