import './styles/Stone.css';

export default function Stone({ row, col, color, CELL }) {
  return (
    <div
      className={`stone ${color}`}
      style={{
        top: `${row * CELL}px`,
        left: `${col * CELL}px`
      }}
    >
    </div>
  );
}
