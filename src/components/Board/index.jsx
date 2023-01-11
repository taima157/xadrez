import Square from "../Square";
import { ChessContext } from "../../context/chess";
import { useContext, useEffect } from "react";

export default function Board() {
  const { board } = useContext(ChessContext);

  return (
    <div className="board">
      {board.map((row, rowindex) => {
        return (
          <div key={rowindex} className="row-board">
            {row.map((col, colindex) => {
              return (
                <div key={colindex} className="col-board" >
                  {rowindex % 2 == 0 ? (
                    <Square
                      className={`square ${
                        colindex % 2 == 0 ? "white" : "black"
                      }`}
                      piece={col}
                    />
                  ) : (
                    <Square
                      className={`square ${
                        colindex % 2 == 0 ? "black" : "white"
                      }`}
                      piece={col}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
