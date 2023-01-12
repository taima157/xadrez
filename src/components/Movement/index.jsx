import { useContext } from "react";
import { ChessContext } from "../../context/chess";
import Piece from "../Piece";
import "./style.css";
import circle from "../../assets/circle.png";

export default function Movement({ movement }) {
  const { makeMove } = useContext(ChessContext);

  if (movement.check) {
    return <Piece piece={movement}/>
  }

  if (movement.pieceOnCapture) {
    return (
      <div className="Movement red" onClick={() => makeMove(movement)}>
        <Piece piece={movement.pieceOnCapture} />
      </div>
    );
  } else {
    return (
      <div className="Movement" onClick={() => makeMove(movement)}>
        <img src={circle} alt="circle" className="circle" />
      </div>
    );
  }
}
