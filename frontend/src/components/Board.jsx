import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/Board.css';
import Stone from './Stone';
import PreviewStone from './PreviewStone';
import GridLines from './GridLines';
import Labels from './Labels';

import {
  API_URL,
  BOARD_SIZE,
  CELL_SIZE,
  LETTERS,
  COLORS,
  STRATEGIES,
  GAME_RESULT,
} from '../constants';

import {
  createEmptyBoard,
  getPositionLabel,
  getBoardCoords,
  createMoveNumberMap,
  isValidBoardCoord,
} from '../utils';

export default function Board() {
  const { strategy } = useParams();

  // 사용자 색상 선택: 'black' 또는 'white'
  const [choice, setChoice] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(createEmptyBoard());
  const [moves, setMoves] = useState([]);
  const [userColor, setUserColor] = useState(COLORS.BLACK);
  const [aiColor, setAiColor] = useState(COLORS.WHITE);
  const [turn, setTurn] = useState(COLORS.BLACK);
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const moveNumbers = useMemo(() => createMoveNumberMap(moves), [moves]);

  // 게임 시작 요청 함수
  const startGame = async (pickedColor) => {
    setGameOver(false); 
    setBoard(createEmptyBoard());
    setMoves([]);
    setChoice(pickedColor);

    const res = await axios.post(`${API_URL}/start-game`, {
      ai_strategy: strategy || STRATEGIES.EASY,
      user_color: pickedColor
    });
    const { game_id, user_color, ai_color, first_ai_move } = res.data;

    setGameId(game_id);
    setUserColor(user_color);
    setAiColor(ai_color);

    if (first_ai_move) {
      const { row, col, player } = first_ai_move;
      setBoard(b => {
        const nb = b.map(r => [...r]); nb[row][col] = player; return nb;
      });
      setMoves([{ row, col, player }]);
      setTurn(prev => prev === userColor ? aiColor : userColor);
    } else {
      setTurn(COLORS.BLACK);
    }
  };

  // 색상 선택 카드 UI
  if (!choice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">돌 색상을 선택하세요</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          {/* 흑돌 카드 */}
          <div
            onClick={() => startGame(COLORS.BLACK)}
            className="group cursor-pointer bg-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition hover:bg-black"
          >
            <div className="w-24 h-24 bg-black rounded-full mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-white mb-2">흑돌</h3>
            <p className="text-gray-600 text-center group-hover:text-gray-200">선공으로 시작합니다.</p>
          </div>

          {/* 백돌 카드 */}
          <div
            onClick={() => startGame(COLORS.WHITE)}
            className="group cursor-pointer bg-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition hover:bg-white"
          >
            <div className="w-24 h-24 bg-white rounded-full border border-gray-300 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">백돌</h3>
            <p className="text-gray-600 text-center">후공으로 시작합니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // 턴 전환 함수
  const toggleTurn = () => {
    setTurn(prev => (prev === userColor ? aiColor : userColor));
  };

  // 이하 기존 Board 렌더링 로직
  const handleClick = async (e) => {
    if (gameOver || turn !== userColor) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const { row, col } = getBoardCoords(e.clientX, e.clientY, rect);
    if (!isValidBoardCoord(row, col)) return;
    if (board[row][col]) return;

    // 유저 착수
    setBoard(b => { const nb=b.map(r=>[...r]); nb[row][col]=userColor; return nb; });
    setMoves(mv=>[...mv,{ row, col, player:userColor }]);
    toggleTurn();

    try {
      const res = await axios.post(`${API_URL}/move/${strategy}`, {
        game_id: gameId,
        row, col,
        player: userColor
      });
      // AI 응수
      if (res.data.ai_move) {
        const { row:ar, col:ac, player:ap } = res.data.ai_move;
        setBoard(b => { const nb=b.map(r=>[...r]); nb[ar][ac]=ap; return nb; });
        setMoves(mv=>[...mv,{ row:ar, col:ac, player:ap }]);
        toggleTurn();
      }
      if (res.data.result===GAME_RESULT.USER_WIN||res.data.result===GAME_RESULT.AI_WIN) {
        alert(`${res.data.winner} wins!`);
        setGameOver(true);
        return;
      }
    } catch(err) {
      toggleTurn();
      console.error('POST /move 실패', err);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { row, col } = getBoardCoords(e.clientX, e.clientY, rect);
    if (isValidBoardCoord(row, col) && !board[row][col]) {
      setHoverRow(row); setHoverCol(col);
    } else {
      setHoverRow(null); setHoverCol(null);
    }
  };
  const handleMouseLeave = () => { setHoverRow(null); setHoverCol(null); };
  const getLabel = (r,c) => getPositionLabel(r, c);

  return (
    <div className="board-container">
      <Labels SIZE={BOARD_SIZE} CELL={CELL_SIZE} LETTERS={LETTERS} />
      <div className="board-col">
        <div className="left-numbers">
          {Array.from({ length: BOARD_SIZE }).map((_,i)=>
            <div key={i} className="number-cell" style={{ top:`${i*CELL_SIZE}px`, transform:'translate(-50%,-50%)' }}>
              {BOARD_SIZE-i}
            </div>
          )}
        </div>
        <div className="board" onClick={handleClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <GridLines SIZE={BOARD_SIZE} CELL={CELL_SIZE}/>
          {board.map((row, r) =>
            row.map((st, c) =>
              st && (
                <Stone
                  key={`${r}-${c}`}
                  row={r}
                  col={c}
                  color={st}
                  CELL={CELL_SIZE}
                  number={moveNumbers.get(`${r}-${c}`) || null}
                  isLast={
                    moves.length > 0 &&
                    moves[moves.length - 1].row === r &&
                    moves[moves.length - 1].col === c
                  }
                />
              )
            )
          )}
          {hoverRow!==null&&hoverCol!==null&&
            <PreviewStone
              row={hoverRow}
              col={hoverCol}
              turn={userColor}
              label={getLabel(hoverRow,hoverCol)}
              CELL={CELL_SIZE}
            />}
        </div>
      </div>
    </div>
  );
}
