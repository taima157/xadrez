import { useContext } from "react";
import { ChessContext } from "../../context/chess";
import Piece from "../Piece";
import "./style.css";

export default function Movement({ movement }) {
  const { makeMove } = useContext(ChessContext);

  if (movement.pieceOnCapture) {
    return (
      <div className="Movement red" onClick={() => makeMove(movement)}>
        <Piece piece={movement.pieceOnCapture} />
      </div>
    );
  } else {
    return <div className="Movement green" onClick={() => makeMove(movement)}></div>;
  }
}
