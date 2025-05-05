import { useState } from 'react';
import axios from 'axios';          
import './styles/Board.css';
import Stone from './Stone';
import PreviewStone from './PreviewStone';
import GridLines from './GridLines';
import Labels from './Labels';

const API = import.meta.env.VITE_API_URL;   // 환경변수에서 읽음
const gameId = 1; // TODO: 나중에 새 게임 시작 시 실제 ID 받아오기

console.log(`${API}/move`);

const SIZE = 19;
const CELL = 30;
const LETTERS = 'ABCDEFGHJKLMNOPQRST'.split('');

export default function Board() {
  const [board, setBoard] = useState(
    Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
  );
  const [turn, setTurn] = useState('black');
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);
  const [moves, setMoves] = useState([]);


  const handleClick = async (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.round(x / CELL);
    const row = Math.round(y / CELL);
  
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return;
    if (board[row][col]) return;
    
    /* 1️⃣ 화면에 즉시 반영 (UX) */
    setBoard(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = turn;
      return next;
    });
    setMoves(prev => [...prev, { row, col, player: turn }]);
    setTurn(prev => (prev === 'black' ? 'white' : 'black'));
    
  
    /* 2️⃣ 서버에 착수 정보 전송 */
    try {
      const res = await axios.post(`${API}/move`, {
        row,
        col,
        player: turn,        // "black" 또는 "white"
        game_id: gameId   
      });
      
      /* 3️⃣ (선택) 서버가 AI 수를 반환하면 즉시 반영 */
      if (res.data?.aiMove) {
        const { row: aiR, col: aiC } = res.data.aiMove;
        setBoard(prev => {
          const next = prev.map(r => [...r]);
          next[aiR][aiC] = turn === 'black' ? 'white' : 'black';
          return next;
        });
      }
  
      /* 4️⃣ (선택) 서버가 승리 결과 주면 알림 */
      if (res.data?.win) {
        alert(`${res.data.win} wins!`);
      }
  
    } catch (err) {
      console.error('POST /move 실패', err);
    }
  };
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.round(x / CELL);
    const row = Math.round(y / CELL);

    if (row >= 0 && row < SIZE && col >= 0 && col < SIZE) {
      setHoverRow(row);
      setHoverCol(col);
    } else {
      setHoverRow(null);
      setHoverCol(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverRow(null);
    setHoverCol(null);
  };

  const getLabel = (r, c) => `${LETTERS[c]}${SIZE - r}`;

  return (
    <div className="board-container">
      <Labels SIZE={SIZE} CELL={CELL} LETTERS={LETTERS} />

      <div className="board-col">
        <div className="left-numbers">
          {Array.from({ length: SIZE }).map((_, idx) => (
            <div
              key={`number-${idx}`}
              className="number-cell"
              style={{
                top: `${idx * CELL}px`,
                left: '0',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {SIZE - idx}
            </div>
          ))}
        </div>

        <div
          className="board"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <GridLines SIZE={SIZE} CELL={CELL} />

          {board.map((row, r) =>
            row.map((stone, c) =>
              stone && <Stone
          key={`${r}-${c}`}
          row={r}
          col={c}
          color={stone}
          CELL={CELL}
          number={
            moves.findIndex(m => m.row === r && m.col === c) + 1 || null
          }
        />
        
            )
          )}

          {hoverRow !== null && hoverCol !== null && !board[hoverRow][hoverCol] && (
            <PreviewStone
              row={hoverRow}
              col={hoverCol}
              turn={turn}
              label={getLabel(hoverRow, hoverCol)}
              CELL={CELL}
            />
          )}
        </div>
      </div>
    </div>
  );
}
