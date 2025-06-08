import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Stone from './Stone';
import PreviewStone from './PreviewStone';
import GridLines from './GridLines';
import Labels from './Labels';
import './styles/Board.css';

import {
  BOARD_SIZE,
  CELL_SIZE,
  LETTERS,
  COLORS,
} from '../constants';

import { isValidBoardCoord, getPositionLabel, getBoardCoords } from '../utils';
import { useGame } from '../hooks/useGame';
import { useHover } from '../hooks/useHover';

export default function Board() {
  // --- 게임 상태 및 훅 초기화 ---
  const { strategy } = useParams();
  const {
    choice,
    board,
    moves,
    userColor,
    aiColor,
    turn,
    gameOver,
    moveNumbers,
    startGame,
    makeMove,
    resultType, // 'user_win', 'ai_win', 'draw', null
  } = useGame(strategy);

  const {
    hoverRow,
    hoverCol,
    handleMouseMove,
    handleMouseLeave,
  } = useHover();

  const [showPopup, setShowPopup] = useState(false);
  const dashboardRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- 게임 종료 시 팝업 표시 ---
  useEffect(() => {
    if (gameOver) setShowPopup(true);
  }, [gameOver]);

  // --- 바둑판 클릭 핸들러 ---
  const handleClick = async (e) => {
    if (gameOver || turn !== userColor) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { row, col } = getBoardCoords(e.clientX, e.clientY, rect);
    if (isValidBoardCoord(row, col) && !board[row][col]) {
      await makeMove(row, col);
    }
  };

  // --- 결과 팝업 확인 버튼 핸들러 ---
  const handlePopupConfirm = () => {
    setShowPopup(false);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // --- 게임 통계 계산 ---
  const myMoves = moves.filter(m => m.player === userColor).length;
  const aiMoves = moves.filter(m => m.player === aiColor).length;

  // --- 게임 결과 메시지 매핑 ---
  const resultMessages = {
    user_win: { emoji: '🏆', msg: '🎉 축하합니다! 당신이 이겼습니다!' },
    ai_win: { emoji: '🤖', msg: 'AI가 승리했습니다!' },
    draw: { emoji: '🤝', msg: '무승부입니다! 멋진 대결이었습니다.' },
  };
  const result = resultMessages[resultType] || {};

  // --- 로딩 오버레이 컴포넌트 ---
  const LoadingOverlay = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
    <div className="flex flex-col items-center">
      {/* Tailwind 기본 스피너 */}
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8"></div>
      <div className="text-xl font-bold text-blue-700 text-center">
        로딩 중입니다...
      </div>
    </div>
  </div>
);







  // --- 오직 로딩 오버레이만 보여주기 ---
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // --- 돌 색상 선택 UI ---
  if (!choice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">돌 색상을 선택하세요</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          {/* 흑돌 카드 */}
          <div
            onClick={async () => {
              setIsLoading(true);
              const start = Date.now();
              await startGame(COLORS.BLACK);
              const elapsed = Date.now() - start;
              const minDelay = 2000;
              if (elapsed < minDelay) {
                setTimeout(() => setIsLoading(false), minDelay - elapsed);
              } else {
                setIsLoading(false);
              }
            }}
            className={`group cursor-pointer bg-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition hover:bg-black ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="w-24 h-24 bg-black rounded-full mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-white mb-2">흑돌</h3>
            <p className="text-gray-600 text-center group-hover:text-gray-200">선공으로 시작합니다.</p>
          </div>
          {/* 백돌 카드 */}
          <div
            onClick={async () => {
              setIsLoading(true);
              const start = Date.now();
              await startGame(COLORS.WHITE);
              const elapsed = Date.now() - start;
              const minDelay = 2000;
              if (elapsed < minDelay) {
                setTimeout(() => setIsLoading(false), minDelay - elapsed);
              } else {
                setIsLoading(false);
              }
            }}
            className={`group cursor-pointer bg-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition hover:bg-white ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="w-24 h-24 bg-white rounded-full border border-gray-300 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">백돌</h3>
            <p className="text-gray-600 text-center">후공으로 시작합니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- 바둑판 및 게임 UI 렌더링 ---
  return (
    <div className="board-container">
      {/* 바둑판 라벨 */}
      <Labels SIZE={BOARD_SIZE} CELL={CELL_SIZE} LETTERS={LETTERS} />
      <div className="board-col">
        {/* 바둑판 왼쪽 숫자 라벨 */}
        <div className="left-numbers">
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <div
              key={i}
              className="number-cell"
              style={{
                top: `${i * CELL_SIZE}px`,
                transform: 'translate(-50%,-50%)',
              }}
            >
              {BOARD_SIZE - i}
            </div>
          ))}
        </div>
        {/* 바둑판 그리드 및 돌 렌더링 */}
        <div
          className="board"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <GridLines SIZE={BOARD_SIZE} CELL={CELL_SIZE} />
          {board.map((row, r) =>
            row.map(
              (st, c) =>
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
          {/* 마우스 오버 시 미리보기 돌 */}
          {hoverRow !== null && hoverCol !== null && (
            <PreviewStone
              row={hoverRow}
              col={hoverCol}
              turn={userColor}
              label={getPositionLabel(hoverRow, hoverCol)}
              CELL={CELL_SIZE}
            />
          )}
        </div>
      </div>

      {/* --- 게임 종료 팝업 --- */}
      {gameOver && showPopup && (
        <div className="popup-overlay">
          <div className="popup-content popup-slide-in">
            <p style={{ fontSize: "1.25rem", marginBottom: "1.2rem" }}>
              {result.msg || '게임 종료'}
            </p>
            <button className="modal-btn" onClick={handlePopupConfirm}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* --- 게임 종료 대시보드 --- */}
      <div ref={dashboardRef} />
      {gameOver && !showPopup && (
        <div className="result-dashboard-normal">
          <div className="result-dashboard-inner">
            <span className="result-emoji">{result.emoji || ''}</span>
            <span className="result-title">{result.msg || '게임 종료'}</span>
            <span className="result-stats">
              총 착수: <b>{moves.length}</b> | 내 착수: <b>{myMoves}</b> | AI 착수: <b>{aiMoves}</b>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
