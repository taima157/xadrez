import { useContext, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import { ChessContext } from "./context/chess";

function App() {
  const { clearBoard, mountBoard, addPiece, endangeredBoard } =
    useContext(ChessContext);

  const [pieceToPlace, setPieceToPlace] = useState({
    name: "pawn",
    type: "piece",
    color: "white",
    position: [0, 0],
  });

  function positionHandler(e, index) {
    let array = pieceToPlace.position;
    array[index] = Number(e.target.value);
    setPieceToPlace({ ...pieceToPlace, position: array });
  }

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div className="App">
      <div className="full-board">
        <div className="top-board">
          <div className="left-board">
            {numbers.map((number, index) => {
              return (
                <div key={index} className="number">
                  {number}
                </div>
              );
            })}
          </div>
          <Board />
        </div>
        <div className="bottom-board">
          {letters.map((letter, index) => {
            return (
              <div key={index} className="letter">
                {letter}
              </div>
            );
          })}
        </div>
      </div>
      <div className="menu-config">
        <button onClick={mountBoard}>Resetar Tabuleiro</button>
        <button onClick={clearBoard}>Limpar Tabuleiro</button>
        <div className="add-piece">
          <div className="piece-type">
            <select
              onChange={(e) =>
                setPieceToPlace({ ...pieceToPlace, name: e.target.value })
              }
            >
              <option value="pawn">Peão</option>
              <option value="king">Rei</option>
              <option value="queen">Rainha</option>
              <option value="bishop">Bispo</option>
              <option value="knight">Cavalo</option>
              <option value="rook">Torre</option>
            </select>
          </div>

          <div className="piece-color">
            <select
              onChange={(e) =>
                setPieceToPlace({ ...pieceToPlace, color: e.target.value })
              }
            >
              <option value="white">Branco</option>
              <option value="black">Preto</option>
            </select>
          </div>

          <div className="piece-position">
            <label>
              X
              <input
                type="number"
                value={pieceToPlace.position[0]}
                onChange={(e) => positionHandler(e, 0)}
                min={0}
                max={7}
              />
            </label>
            <label>
              Y
              <input
                type="number"
                value={pieceToPlace.position[1]}
                onChange={(e) => positionHandler(e, 1)}
                min={0}
                max={7}
              />
            </label>
          </div>

          <button onClick={() => addPiece(pieceToPlace)}>Add Peça</button>
        </div>
      </div>
      <div className="board-danger">
        {endangeredBoard.map((row, rindex) => {
          return (
            <div key={rindex} className="row-danger">
              {row.map((item, cindex) => {
                return <div key={cindex} className="danger-item">{item.color}</div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
