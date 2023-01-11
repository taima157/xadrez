import { useContext } from "react";
import { ChessContext } from "../../context/chess";
import "./style.css";

import pawnwhite from "../../assets/pawn-white.png";
import pawnblack from "../../assets/pawn-black.png";
import knightwhite from "../../assets/knight-white.png";
import knightblack from "../../assets/knight-black.png";
import bishopwhite from "../../assets/bishop-white.png";
import bishopblack from "../../assets/bishop-black.png";
import rookwhite from "../../assets/rook-white.png";
import rookblack from "../../assets/rook-black.png";
import queenwhite from "../../assets/queen-white.png";
import queenblack from "../../assets/queen-black.png";
import kingwhite from "../../assets/king-white.png";
import kingblack from "../../assets/king-black.png";

export default function Piece({ piece }) {
  const { selectPiece } = useContext(ChessContext);

  const piecesImages = {
    pawnwhite,
    pawnblack,
    knightwhite,
    knightblack,
    bishopwhite,
    bishopblack,
    rookwhite,
    rookblack,
    queenwhite,
    queenblack,
    kingwhite,
    kingblack,
  };

  return (
    <div className="Piece" onClick={() => selectPiece(piece)}>
      <img src={piecesImages[`${piece.name}${piece.color}`]} alt="piece" />
    </div>
  );
}
