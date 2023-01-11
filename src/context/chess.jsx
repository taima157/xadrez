import { createContext, useState, useEffect } from "react";

export const ChessContext = createContext();

export function ChessProvider({ children }) {
  const initialPiecesPositions = {
    king: {
      white: [[4, 7]],
      black: [[4, 0]],
    },
    queen: {
      white: [[3, 7]],
      black: [[3, 0]],
    },
    bishop: {
      white: [
        [2, 7],
        [5, 7],
      ],
      black: [
        [2, 0],
        [5, 0],
      ],
    },
    knight: {
      white: [
        [1, 7],
        [6, 7],
      ],
      black: [
        [1, 0],
        [6, 0],
      ],
    },
    rook: {
      white: [
        [0, 7],
        [7, 7],
      ],
      black: [
        [0, 0],
        [7, 0],
      ],
    },
    pawn: {
      white: [
        [0, 6],
        [1, 6],
        [2, 6],
        [3, 6],
        [4, 6],
        [5, 6],
        [6, 6],
        [7, 6],
      ],
      black: [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 1],
        [7, 1],
      ],
    },
  };

  const [board, setBoard] = useState([]);

  function setPieces(array) {
    let handleArray = array;

    Object.keys(initialPiecesPositions).forEach((piece) => {
      Object.keys(initialPiecesPositions[piece]).forEach((color) => {
        initialPiecesPositions[piece][color].forEach((position) => {
          handleArray[position[1]][position[0]] = {
            name: piece,
            type: "piece",
            color,
            position,
            select: false,
          };
        });
      });
    });

    return handleArray;
  }

  function mountBoard() {
    let buildableBoard = [];

    for (let i = 0; i < 8; i++) {
      buildableBoard.push([]);
      for (let j = 0; j < 8; j++) {
        buildableBoard[i].push([]);
      }
    }

    buildableBoard = setPieces(buildableBoard);

    setBoard(buildableBoard);
  }

  function clearBoard() {
    let buildableBoard = [];

    for (let i = 0; i < 8; i++) {
      buildableBoard.push([]);
      for (let j = 0; j < 8; j++) {
        buildableBoard[i].push([]);
      }
    }

    setBoard(buildableBoard);
  }

  function clearMoves() {
    board.forEach((row, rindex) => {
      row.forEach((square, cindex) => {
        if (square.type !== "move") {
          board[rindex][cindex] = square;
          board[rindex][cindex].select = false;
        } else {
          if (square.pieceOnCapture) {
            board[rindex][cindex] = square.pieceOnCapture;
          } else {
            board[rindex][cindex] = [];
          }
        }
      });
    });
  }

  function occupiedSquare(position) {
    let square = board[position[1]][position[0]];

    if (square.length === 0) {
      return {
        isOccupied: false,
      };
    } else {
      return {
        isOccupied: true,
        color: square.color,
      };
    }
  }

  function isInsideTheBoard(index) {
    if (index >= 0 && index < board.length) {
      return true;
    } else {
      return false;
    }
  }

  function movement(piece, quantX, quantY) {
    const handleBoard = [...board];

    let movePosition = [piece.position[0] + quantX, piece.position[1] + quantY];

    handleBoard[piece.position[1]][piece.position[0]].select = true;

    let movement = {
      name: "o",
      type: "move",
      movePosition,
      piecePosition: piece.position,
    };

    if (
      isInsideTheBoard(piece.position[0] + quantX) &&
      isInsideTheBoard(piece.position[1] + quantY)
    ) {
      if (occupiedSquare(movePosition).isOccupied) {
        if (occupiedSquare(movePosition).color !== piece.color) {
          let pieceOnCapture = handleBoard[movePosition[1]][movePosition[0]];
          handleBoard[movePosition[1]][movePosition[0]] = movement;

          handleBoard[movePosition[1]][movePosition[0]].pieceOnCapture =
            pieceOnCapture;

          if (piece.name !== "pawn") {
            return true;
          }
        } else {
          return true;
        }
      } else {
        handleBoard[movePosition[1]][movePosition[0]] = movement;
      }
    }

    setBoard(handleBoard);
  }

  function makeMove(positionMove) {
    clearMoves();

    let piece =
      board[positionMove.piecePosition[1]][positionMove.piecePosition[0]];

    piece.position = positionMove.movePosition;

    removePiece(positionMove.piecePosition);
    addPiece(piece);
  }

  function addPiece(piece) {
    let handleBoard = [...board];

    board[piece.position[1]][piece.position[0]] = piece;

    setBoard(handleBoard);
  }

  function removePiece(position) {
    let handleBoard = [...board];

    handleBoard[position[1]][position[0]] = [];

    setBoard(handleBoard);
  }

  function pawnCapture(piece, diagonals) {
    diagonals.forEach((diagonal) => {
      if (
        isInsideTheBoard(piece.position[0] + diagonal[0]) &&
        isInsideTheBoard(piece.position[1] + diagonal[1])
      ) {
        if (
          occupiedSquare([
            piece.position[0] + diagonal[0],
            piece.position[1] + diagonal[1],
          ]).isOccupied
        ) {
          movement(piece, diagonal[0], diagonal[1]);
        }
      }
    });
  }

  function pawnMove(piece) {
    if (piece.color === "white") {
      if (piece.position[1] === 6) {
        let top = false;

        for (let i = 1; i < 3; i++) {
          if (!top) {
            top = movement(piece, 0, -i);
          }
        }
      } else {
        if (isInsideTheBoard(piece.position[1] - 1)) {
          if (
            !occupiedSquare([piece.position[0], piece.position[1] - 1])
              .isOccupied
          ) {
            movement(piece, 0, -1);
          }
        }
      }
      let diagonals = [
        [1, -1],
        [-1, -1],
      ];

      pawnCapture(piece, diagonals);
    } else {
      if (piece.position[1] === 1) {
        let bottom = false;

        for (let i = 1; i < 3; i++) {
          if (!bottom) {
            bottom = movement(piece, 0, i);
          }
        }
      } else {
        if (isInsideTheBoard(piece.position[1] + 1)) {
          if (
            !occupiedSquare([piece.position[0], piece.position[1] + 1])
              .isOccupied
          ) {
            movement(piece, 0, 1);
          }
        }
      }

      let diagonals = [
        [-1, 1],
        [1, 1],
      ];

      pawnCapture(piece, diagonals);
    }
  }

  function knightMove(piece) {
    const movesPosition = [
      [2, 1],
      [-2, 1],
      [2, -1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ];

    movesPosition.forEach((position) => {
      movement(piece, position[0], position[1]);
    });
  }

  function bishopMove(piece) {
    let topRight = false;
    let bottomRight = false;
    let topLeft = false;
    let bottomLeft = false;

    for (let i = 1; i < board.length + 1; i++) {
      if (!topRight) {
        topRight = movement(piece, i, -i);
      }

      if (!bottomRight) {
        bottomRight = movement(piece, i, i);
      }

      if (!topLeft) {
        topLeft = movement(piece, -i, i);
      }

      if (!bottomLeft) {
        bottomLeft = movement(piece, -i, -i);
      }
    }
  }

  function rookMove(piece) {
    let top = false;
    let bottom = false;
    let left = false;
    let right = false;

    for (let i = 1; i < board.length + 1; i++) {
      if (!top) {
        top = movement(piece, 0, -i);
      }

      if (!bottom) {
        bottom = movement(piece, 0, i);
      }

      if (!left) {
        left = movement(piece, -i, 0);
      }

      if (!right) {
        right = movement(piece, i, 0);
      }
    }
  }

  function kingMove(piece) {
    const movesPosition = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
      [-1, -1],
    ];

    movesPosition.forEach((position) => {
      movement(piece, position[0], position[1]);
    });
  }

  function queenMove(piece) {
    rookMove(piece);
    bishopMove(piece);
  }

  function selectPiece(piece) {
    let pieceName = piece.name;

    clearMoves();

    switch (pieceName) {
      case "pawn":
        pawnMove(piece);
        break;
      case "knight":
        knightMove(piece);
        break;
      case "bishop":
        bishopMove(piece);
        break;
      case "queen":
        queenMove(piece);
        break;
      case "rook":
        rookMove(piece);
        break;
      case "king":
        kingMove(piece);
        break;
    }
  }

  useEffect(() => {
    mountBoard();
  }, []);

  return (
    <ChessContext.Provider
      value={{
        selectPiece,
        makeMove,
        mountBoard,
        setPieces,
        clearBoard,
        addPiece,
        board,
      }}
    >
      {children}
    </ChessContext.Provider>
  );
}
