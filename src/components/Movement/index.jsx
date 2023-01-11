import { useContext } from "react";
import { ChessContext } from "../../context/chess";
import "./style.css"

export default function Movement({movement}) {
  const {makeMove} = useContext(ChessContext)

  return <div className="Movement" onClick={() => makeMove(movement)}></div>
}