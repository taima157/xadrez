import { useContext, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import { ChessContext } from "./context/chess";

function App() {
  const { clearBoard, mountBoard, addPiece } = useContext(ChessContext);

  const [piece, setPiece] = useState({
    name: "pawn",
    type: "piece",
    color: "white",
    position: [0, 0],
  });

  function positionHandler(e, index) {
    let array = piece.position;
    array[index] = Number(e.target.value);
    setPiece({ ...piece, position: array });
  }

  return (
    <div className="App">
      <Board />
      <div className="menu-config">
        <button onClick={mountBoard}>Resetar Tabuleiro</button>
        <button onClick={clearBoard}>Limpar Tabuleiro</button>
        <div className="add-piece">
          <div className="piece-type">
            <select
              onChange={(e) => setPiece({ ...piece, name: e.target.value })}
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
              onChange={(e) => setPiece({ ...piece, color: e.target.value })}
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
                value={piece.position[0]}
                onChange={(e) => positionHandler(e, 0)}
                min={0}
                max={7}
              />
            </label>
            <label>
              Y
              <input
                type="number"
                value={piece.position[1]}
                onChange={(e) => positionHandler(e, 1)}
                min={0}
                max={7}
              />
            </label>
          </div>

          <button onClick={() => addPiece(piece)}>Add Peça</button>
        </div>
      </div>
    </div>
  );
}

export default App;
