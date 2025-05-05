// Board.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/Board.css';
import Stone from './Stone';
import PreviewStone from './PreviewStone';
import GridLines from './GridLines';
import Labels from './Labels';

const API     = import.meta.env.VITE_API_URL;
const SIZE    = 19;
const CELL    = 30;
const LETTERS = 'ABCDEFGHJKLMNOPQRST'.split('');

export default function Board() {
  const { strategy } = useParams();

  // 사용자 색상 선택: 'black' 또는 'white'
  const [choice, setChoice] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(
    Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
  );
  const [moves, setMoves] = useState([]);
  const [userColor, setUserColor] = useState('black');
  const [aiColor, setAiColor] = useState('white');
  const [turn, setTurn] = useState('black');
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);

  // 게임 시작 요청 함수
  const startGame = async (pickedColor) => {
    // 초기화
    setBoard(Array.from({ length: SIZE }, () => Array(SIZE).fill(null)));
    setMoves([]);
    setChoice(pickedColor);

    // 서버에 시작 요청
    const res = await axios.post(`${API}/start-game`, {
      ai_strategy: strategy || 'easy',
      user_color: pickedColor
    });
    const { game_id, user_color, ai_color, first_ai_move } = res.data;

    setGameId(game_id);
    setUserColor(user_color);
    setAiColor(ai_color);

    // AI가 먼저 뒀다면 한 수 반영
    if (first_ai_move) {
      const { row, col, player } = first_ai_move;
      setBoard(b => {
        const nb = b.map(r => [...r]); nb[row][col] = player; return nb;
      });
      setMoves([{ row, col, player }]);
      setTurn(user_color);
    } else {
      // 아니면 흑돌이 기본 선공
      setTurn('black');
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
            onClick={() => startGame('black')}
            className="group cursor-pointer bg-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition hover:bg-black"
          >
            <div className="w-24 h-24 bg-black rounded-full mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-white mb-2">흑돌</h3>
            <p className="text-gray-600 text-center group-hover:text-gray-200">선공으로 시작합니다.</p>
          </div>

          {/* 백돌 카드 */}
          <div
            onClick={() => startGame('white')}
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

  


  // 이하 기존 Board 렌더링 로직
  const handleClick = async (e) => {
    if (turn !== userColor) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const col = Math.round((e.clientX - left) / CELL);
    const row = Math.round((e.clientY - top) / CELL);
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return;
    if (board[row][col]) return;

    // 유저 착수
    setBoard(b => { const nb=b.map(r=>[...r]); nb[row][col]=userColor; return nb; });
    setMoves(mv=>[...mv,{ row, col, player:userColor }]);

    try {
      const res = await axios.post(`${API}/move/${strategy}`, {
        game_id: gameId,
        row, col,
        player: userColor
      });
      // AI 응수
      if (res.data.ai_move) {
        const { row:ar, col:ac, player:ap } = res.data.ai_move;
        setBoard(b => { const nb=b.map(r=>[...r]); nb[ar][ac]=ap; return nb; });
        setMoves(mv=>[...mv,{ row:ar, col:ac, player:ap }]);
      }
      if (res.data.result==='user_win'||res.data.result==='ai_win') {
        alert(`${res.data.winner} wins!`);
        return;
      }
      setTurn(userColor);
    } catch(err) {
      console.error('POST /move 실패', err);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const col = Math.round((e.clientX - left) / CELL);
    const row = Math.round((e.clientY - top) / CELL);
    if (row>=0&&row<SIZE&&col>=0&&col<SIZE&&!board[row][col]) {
      setHoverRow(row); setHoverCol(col);
    } else { setHoverRow(null); setHoverCol(null); }
  };
  const handleMouseLeave = () => { setHoverRow(null); setHoverCol(null); };
  const getLabel = (r,c) => `${LETTERS[c]}${SIZE-r}`;

  return (
    <div className="board-container">
      <Labels SIZE={SIZE} CELL={CELL} LETTERS={LETTERS} />
      <div className="board-col">
        <div className="left-numbers">
          {Array.from({ length: SIZE }).map((_,i)=><div key={i} className="number-cell" style={{ top:`${i*CELL}px`, transform:'translate(-50%,-50%)' }}>{SIZE-i}</div>)}
        </div>
        <div className="board" onClick={handleClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <GridLines SIZE={SIZE} CELL={CELL}/>
          {board.map((row,r)=>row.map((st,c)=>st&&<Stone key={`${r}-${c}`} row={r} col={c} color={st} CELL={CELL} number={moves.findIndex(m=>m.row===r&&m.col===c)+1||null}/>))}
          {hoverRow!==null&&hoverCol!==null&&<PreviewStone row={hoverRow} col={hoverCol} turn={userColor} label={getLabel(hoverRow,hoverCol)} CELL={CELL}/>}'
        </div>
      </div>
    </div>
  );
}
