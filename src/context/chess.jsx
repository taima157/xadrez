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

  const [turn, setTurn] = useState("white");
  const [board, setBoard] = useState([]);
  const [endangeredBoard, setEndangeredBoard] = useState([]);
  const [check, setCheck] = useState({
    isCheck: false,
    checkPosition: [],
    pieceThatChecked: [],
    count: 0,
  });
  const [checkCount, setCheckCount] = useState(0);

  function verifyEndangereds() {
    clearEndangered();

    board.forEach((row) => {
      row.forEach((item) => {
        if (item.type === "piece" && item.color === turn) {
          selectPiece(item, "endangeredBoard");
        }
      });
    });

    clearMoves();
  }

  function verifyCheck() {
    setCheck({ ...check, isCheck: false });

    board.forEach((row) => {
      row.forEach((item) => {
        if (item.type === "piece" && item.color === turn) {
          selectPiece(item, "board", "verify");
          clearMoves();
        }
      });
    });
  }

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

  function buildEndangeredBoard() {
    let buildableBoard = [];

    for (let i = 0; i < 8; i++) {
      buildableBoard.push([]);
      for (let j = 0; j < 8; j++) {
        buildableBoard[i].push([]);
      }
    }

    setEndangeredBoard(buildableBoard);
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

  function clearEndangered() {
    endangeredBoard.forEach((row, rindex) => {
      row.forEach((square, cindex) => {
        if (square.type === "endangered") {
          endangeredBoard[rindex][cindex] = [];
        }
      });
    });
  }

  function clearMoves() {
    // Limpa as possiveis jogadas do tabueiro
    board.forEach((row, rindex) => {
      row.forEach((square, cindex) => {
        if (square.type !== "move") {
          board[rindex][cindex] = square;

          if (board[rindex][cindex].select) {
            board[rindex][cindex].select = false;
          }

          if (!check.isCheck && board[rindex][cindex].name == "king") {
            board[rindex][cindex].check = false;
          }
        } else {
          if (square.pieceOnCapture) {
            board[rindex][cindex] = square.pieceOnCapture;
          } else if (square.select) {
            board[rindex][cindex] = [];
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

  function showMoves(piece, quantX, quantY, boardName, verifyType) {
    let handleBoard; // Cópia do tabuleiro passado nos parâmetros
    let verify = verifyType === "verify" ? true : false;

    if (boardName === "board") {
      handleBoard = [...board];
    } else {
      handleBoard = [...endangeredBoard];
    }

    let pieceX = piece.position[0]; // Posições X e Y da peça selecionada
    let pieceY = piece.position[1];
    let piecePosition = piece.position;

    let movePosition = [pieceX + quantX, pieceY + quantY]; // Posição do campo a ser movimentado

    if (boardName === "board") {
      handleBoard[pieceY][pieceX] = {
        ...handleBoard[pieceY][pieceX],
        select: true,
      };
    }

    let action; // Ação que a função irá executar

    if (boardName === "board") {
      action = {
        name: "o",
        type: "move",
        movePosition,
        piecePosition,
      };
    } else {
      action = {
        name: "x",
        type: "endangered",
        color: piece.color,
      };
    }

    if (
      isInsideTheBoard(movePosition[0]) &&
      isInsideTheBoard(movePosition[1])
    ) {
      if (occupiedSquare(movePosition).isOccupied) {
        if (occupiedSquare(movePosition).color !== piece.color) {
          if (boardName === "board" && piece.name === "king") {
            if (
              endangeredBoard[movePosition[1]][movePosition[0]].type ===
                "endangered" &&
              endangeredBoard[movePosition[1]][movePosition[0]].color !==
                piece.color
            ) {
              return {
                stop: true,
              };
            }
          }

          let pieceOnCapture = handleBoard[movePosition[1]][movePosition[0]]; // Peça a ser capturada

          if (check.isCheck && boardName === "board") {
            if (
              pieceOnCapture.position[0] ===
                check.pieceThatChecked.position[0] &&
              pieceOnCapture.position[1] === check.pieceThatChecked.position[1]
            ) {
            } else {
              return {
                stop: true,
              };
            }
          }

          if (!verify && boardName === "board") {
            let result = nextMove(piece);
            console.log(result);

            if (result.between) {
              handleBoard[movePosition[1]][movePosition[0]] = action;
            }
          } else {
            handleBoard[movePosition[1]][movePosition[0]] = action;
          }

          if (boardName !== "endangeredBoard") {
            handleBoard[movePosition[1]][movePosition[0]].pieceOnCapture =
              pieceOnCapture; // Salva a peça que pode ser capturada, caso o jogador não a capture
          }

          if (
            handleBoard[movePosition[1]][movePosition[0]].pieceOnCapture
              ?.name === "king" &&
            handleBoard[movePosition[1]][movePosition[0]].color !== piece.color
          ) {
            if (boardName !== "endangeredBoard") {
              if (boardName === "board") {
                setCheck({
                  ...check,
                  isCheck: true,
                  checkPosition: [movePosition[0], movePosition[1]],
                  pieceThatChecked: piece,
                });
              }
              return {
                stop: true,
                isCheck: true,
              };
            } else {
              if (boardName === "board") {
                setCheck({
                  ...check,
                  isCheck: false,
                  checkPosition: [],
                  pieceThatChecked: [],
                });
              }
              return {
                stop: true,
                isCheck: true,
              };
            }
          }

          if (boardName === "endangeredBoard") {
            if (board[movePosition[1]][movePosition[0]].name !== "king") {
              return {
                stop: true,
              };
            }
          } else {
            if (piece.name !== "pawn") {
              return {
                stop: true,
              };
            }
          }
        } else {
          if (boardName === "endangeredBoard") {
            handleBoard[movePosition[1]][movePosition[0]] = action;

            if (handleBoard[movePosition[1]][movePosition[0]] !== "king") {
              return {
                stop: true,
                isCheck: true,
              };
            }
          } else {
            return {
              stop: true,
              isCheck: true,
            };
          }
        }
      } else {
        if (boardName === "board" && piece.name === "king") {
          if (
            endangeredBoard[movePosition[1]][movePosition[0]].type ===
              "endangered" &&
            endangeredBoard[movePosition[1]][movePosition[0]].color !==
              piece.color
          ) {
            return {
              stop: true,
            };
          }
        }

        if (boardName === "endangeredBoard" && piece.name === "pawn") {
          handleBoard[movePosition[1]][movePosition[0]] = action;
        } else {
          if (check.isCheck && piece.name !== "king" && !verify) {
            let pieceMovePosition = {
              position: movePosition,
            };

            let king = {
              position: check.checkPosition,
            };

            if (
              pieceIsBetween(pieceMovePosition, king, check.pieceThatChecked)
                ?.itsBetween
            ) {
              handleBoard[movePosition[1]][movePosition[0]] = action;
            }
          } else {
            if (!verify && boardName === "board" && piece.name !== "king") {
              let result = nextMove(piece);

              if (result.between) {
                handleBoard[movePosition[1]][movePosition[0]] = action;
              }
            } else {
              handleBoard[movePosition[1]][movePosition[0]] = action;
            }
          }
        }
      }
    }

    if (boardName === "board") {
      setBoard(handleBoard);
    } else {
      setEndangeredBoard(handleBoard);
    }

    return {
      stop: false,
    };
  }

  function pieceIsBetween(piece, king, pieceThatChecked) {
    let piecePosition = piece.position;
    let kingPosition = king.position;
    let checkedPosition = pieceThatChecked.position;

    if (
      pieceThatChecked.name === "pawn" ||
      pieceThatChecked.name === "knight" ||
      pieceThatChecked.name === "king"
    ) {
      return {
        itsBetween: false,
      };
    }

    const aroundKing = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
      [-1, -1],
    ];

    let around = false;

    aroundKing.forEach((p) => {
      if (
        kingPosition[0] + p[0] === checkedPosition[0] &&
        kingPosition[1] + p[1] === checkedPosition[1]
      ) {
        around = true;
      }
    });

    if (around) {
      return {
        itsBetween: false,
      };
    }

    if (pieceThatChecked.name !== "bishop") {
      if (
        piecePosition[0] === kingPosition[0] &&
        piecePosition[0] === checkedPosition[0]
      ) {
        if (
          (piecePosition[1] > kingPosition[1] &&
            piecePosition[1] < checkedPosition[1]) ||
          (piecePosition[1] < kingPosition[1] &&
            piecePosition[1] > checkedPosition[1])
        ) {
          return {
            itsBetween: true,
            piece,
            king,
            pieceThatChecked,
          };
        }
      }

      if (
        piecePosition[1] === kingPosition[1] &&
        piecePosition[1] === checkedPosition[1]
      ) {
        if (
          (piecePosition[0] > kingPosition[0] &&
            piecePosition[0] < checkedPosition[0]) ||
          (piecePosition[0] < kingPosition[0] &&
            piecePosition[0] > checkedPosition[0])
        ) {
          return {
            itsBetween: true,
            piece,
            king,
            pieceThatChecked,
          };
        }
      }
    }

    let maxX = Math.max(kingPosition[0], checkedPosition[0]);
    let minX = Math.min(kingPosition[0], checkedPosition[0]);
    let maxY = Math.max(kingPosition[1], checkedPosition[1]);
    let minY = Math.min(kingPosition[1], checkedPosition[1]);

    let xValues = [];
    let yValues = [];

    for (minX; minX <= maxX; minX++) {
      xValues.push(minX);
    }

    for (minY; minY <= maxY; minY++) {
      yValues.push(minY);
    }

    if (xValues.length !== yValues.length) {
      return {
        itsBetween: false,
      };
    }

    let between = false;

    if (
      (kingPosition[0] > checkedPosition[0] &&
        kingPosition[1] < checkedPosition[1]) ||
      (kingPosition[0] < checkedPosition[0] &&
        kingPosition[1] > checkedPosition[1])
    ) {
      xValues.forEach((x, index) => {
        if (
          x === piecePosition[0] &&
          yValues[yValues.length - index - 1] === piecePosition[1]
        ) {
          between = true;
        }
      });

      if (between) {
        return {
          itsBetween: true,
          piece,
          king,
          pieceThatChecked,
        };
      } else {
        return {
          itsBetween: false,
        };
      }
    } else {
      xValues.forEach((x, index) => {
        if (x === piecePosition[0] && yValues[index] === piecePosition[1]) {
          between = true;
        }
      });

      if (between) {
        return {
          itsBetween: true,
          piece,
          king,
          pieceThatChecked,
        };
      } else {
        return {
          itsBetween: false,
        };
      }
    }
  }

  function nextMove(piece) {
    let king;

    board.forEach((row) => {
      row.forEach((item) => {
        if (item.name === "king" && item.color === piece.color) {
          king = item;
        }
      });
    });

    let itsBetween;

    board.forEach((row) => {
      row.forEach((item) => {
        if (
          item.type === "piece" &&
          item.color !== piece.color &&
          item.name !== "king"
        ) {
          let result = pieceIsBetween(piece, king, item);

          if (result.itsBetween) {
            itsBetween = result;
            return;
          }
        }
      });
    });

    let anotherItsBetween = [];

    if (itsBetween?.itsBetween) {
      board.forEach((row) => {
        row.forEach((item) => {
          if (
            item.type === "piece" &&
            item.color === piece.color &&
            item.name !== "king"
          ) {
            if (
              item.position[0] !== piece.position[0] &&
              item.position[1] !== piece.position[1]
            ) {
              let result = pieceIsBetween(
                item,
                itsBetween.king,
                itsBetween.pieceThatChecked
              );
              if (result.itsBetween) {
                anotherItsBetween.push(result);
              }
            }
          }
        });
      });
    }

    if (anotherItsBetween.length > 0) {
      return {
        between: true,
        itsBetween,
      };
    } else {
      if (itsBetween === undefined) {
        return {
          between: true,
          itsBetween,
        };
      } else {
        return {
          between: false,
          itsBetween,
        };
      }
    }
  }

  function makeMove(positionMove) {
    clearEndangered();
    clearMoves();

    let piece =
      board[positionMove.piecePosition[1]][positionMove.piecePosition[0]];

    piece.position = positionMove.movePosition;

    removePiece(positionMove.piecePosition);
    addPiece(piece);

    verifyCheck();
    verifyEndangereds();

    if (turn === "white") {
      setTurn("black");
    } else {
      setTurn("white");
    }
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

  function pawnCapture(piece, diagonals, boardName, verify) {
    if (boardName === "endangeredBoard") {
      diagonals.forEach((diagonal) => {
        return showMoves(piece, diagonal[0], diagonal[1], boardName, verify);
      });
    }

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
          return showMoves(piece, diagonal[0], diagonal[1], boardName, verify);
        }
      }
    });
  }

  function pawnMove(piece, boardName, verify) {
    let results = [];

    if (piece.color === "white") {
      if (boardName === "board") {
        if (piece.position[1] === 6) {
          let top = false;

          for (let i = 1; i < 3; i++) {
            if (!top) {
              if (
                occupiedSquare([piece.position[0], piece.position[1] - i])
                  .isOccupied &&
                occupiedSquare([piece.position[0], piece.position[1] - i])
                  .color !== piece.color
              ) {
                top = true;
                return;
              }

              let result = showMoves(piece, 0, -i, boardName, verify);
              top = result?.stop;
              results.push(result);
            }
          }
        } else {
          if (isInsideTheBoard(piece.position[1] - 1)) {
            if (
              !occupiedSquare([piece.position[0], piece.position[1] - 1])
                .isOccupied
            ) {
              let result = showMoves(piece, 0, -1, boardName, verify);
              results.push(result);
            }
          }
        }
      }

      let diagonals = [
        [1, -1],
        [-1, -1],
      ];

      let result = pawnCapture(piece, diagonals, boardName, verify);
      results.push(result);
    } else {
      if (boardName === "board") {
        if (piece.position[1] === 1) {
          let results = [];
          let bottom = false;

          for (let i = 1; i < 3; i++) {
            if (
              occupiedSquare([piece.position[0], piece.position[1] + i])
                .isOccupied &&
              occupiedSquare([piece.position[0], piece.position[1] + i])
                .color !== piece.color
            ) {
              bottom = true;
              return;
            }

            if (!bottom) {
              let result = showMoves(piece, 0, i, boardName, verify);
              bottom = result?.stop;
              results.push(result);
            }
          }
        } else {
          if (isInsideTheBoard(piece.position[1] + 1)) {
            if (
              !occupiedSquare([piece.position[0], piece.position[1] + 1])
                .isOccupied
            ) {
              let result = showMoves(piece, 0, 1, boardName, verify);
              results.push(result);
            }
          }
        }
      }

      let diagonals = [
        [-1, 1],
        [1, 1],
      ];

      let result = pawnCapture(piece, diagonals, boardName, verify);
      results.push(result);
    }

    return results;
  }

  function knightMove(piece, boardName, verify) {
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
      return showMoves(piece, position[0], position[1], boardName, verify)
        ?.isCheck;
    });
  }

  function bishopMove(piece, boardName, verify) {
    let results = [];
    let topRight = false;
    let bottomRight = false;
    let topLeft = false;
    let bottomLeft = false;

    for (let i = 1; i < board.length + 1; i++) {
      if (!topRight) {
        let result = showMoves(piece, i, -i, boardName, verify);
        topRight = result?.stop;
        results.push(result);
      }

      if (!bottomRight) {
        let result = showMoves(piece, i, i, boardName, verify);
        bottomRight = result?.stop;
        results.push(result);
      }

      if (!topLeft) {
        let result = showMoves(piece, -i, i, boardName, verify);
        topLeft = result?.stop;
        results.push(result);
      }

      if (!bottomLeft) {
        let result = showMoves(piece, -i, -i, boardName, verify);
        bottomLeft = result?.stop;
        results.push(result);
      }
    }

    return results;
  }

  function rookMove(piece, boardName, verify) {
    let results = [];
    let top = false;
    let bottom = false;
    let left = false;
    let right = false;

    for (let i = 1; i < board.length + 1; i++) {
      if (!top) {
        let result = showMoves(piece, 0, -i, boardName, verify);
        top = result?.stop;
        results.push(result);
      }

      if (!bottom) {
        let result = showMoves(piece, 0, i, boardName, verify);
        bottom = result?.stop;
        results.push(result);
      }

      if (!left) {
        let result = showMoves(piece, -i, 0, boardName, verify);
        left = result?.stop;
        results.push(result);
      }

      if (!right) {
        let result = showMoves(piece, i, 0, boardName, verify);
        right = result?.stop;
        results.push(result);
      }
    }

    return results;
  }

  function kingMove(piece, boardName, verify) {
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
      showMoves(piece, position[0], position[1], boardName, verify);
    });
  }

  function queenMove(piece, boardName, verify) {
    let results = [];
    results[0] = rookMove(piece, boardName, verify);
    results[1] = bishopMove(piece, boardName, verify);

    return results;
  }

  function selectPiece(piece, boardName, verify) {
    if (piece.color !== turn && boardName == "board") {
      return;
    }

    let pieceName = piece.name;
    clearMoves();

    switch (pieceName) {
      case "pawn":
        return pawnMove(piece, boardName, verify);
      case "knight":
        return knightMove(piece, boardName, verify);
      case "bishop":
        return bishopMove(piece, boardName, verify);
      case "queen":
        return queenMove(piece, boardName, verify);
      case "rook":
        return rookMove(piece, boardName, verify);
      case "king":
        return kingMove(piece, boardName, verify);
    }
  }

  useEffect(() => {
    mountBoard();
    buildEndangeredBoard();
  }, []);

  useEffect(() => {
    if (check.isCheck) {
      let handleBoard = [...board];
      handleBoard[check.checkPosition[1]][check.checkPosition[0]].check = true;
      setBoard(handleBoard);
    } else {
      let handleBoard = [...board];

      if (check.checkPosition.length !== 0) {
        handleBoard[check.checkPosition[1]][
          check.checkPosition[0]
        ].check = false;
        setBoard(handleBoard);
      }
    }
  }, [check]);

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
        check,
        endangeredBoard,
      }}
    >
      {children}
    </ChessContext.Provider>
  );
}
