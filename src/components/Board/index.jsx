import { ChessContext } from "../../context/chess";
import { useContext } from "react";
import Piece from "../Piece";
import Movement from "../Movement";
import "./style.css";

export default function Board() {
  const { board } = useContext(ChessContext);

  return (
    <div className="Board">
      {board.map((row, rowindex) => {
        return (
          <div key={rowindex} className="row-board">
            {row.map((item, colindex) => {
              let classSquare = "";

              if (rowindex % 2 == 0) {
                if (colindex % 2 == 0) {
                  classSquare = "square white";
                } else {
                  classSquare = "square black";
                }
              } else {
                if (colindex % 2 == 0) {
                  classSquare = "square black";
                } else {
                  classSquare = "square white";
                }
              }

              return (
                <div key={colindex} className={classSquare}>
                  {item.type == "piece" ? (
                    <Piece piece={item} />
                  ) : item.type == "move" ? (
                    <Movement movement={item} />
                  ) : null}
                </div>
              );

            })}
          </div>
        );
      })}
    </div>
  );
}
