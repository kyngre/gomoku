import './styles/Stone.css';

export default function Stone({ row, col, color, CELL, number, isLast }) {
  return (
    <div
      className={`stone ${color} ${isLast ? 'last-move' : ''}`}
      style={{
        top: `${row * CELL}px`,
        left: `${col * CELL}px`
      }}
    >
      <span className="stone-number">{number}</span>
    </div>
  );
}

