import { useContext } from "react";
import { ChessContext } from "../../context/chess";

export default function Square({ piece, className }) {
  const { selectPiece, makeMove } = useContext(ChessContext);

  if (piece.name != undefined) {
    if (piece.type === "move") {
      return (
        <div className={className} onClick={() => makeMove(piece)}>
          {piece.name}
        </div>
      );
    } else {
      return (
        <div className={className}>
          <button onClick={() => selectPiece(piece)}>{piece.name}</button>
        </div>
      );
    }
  } else {
    return <div className={className}></div>;
  }
}
