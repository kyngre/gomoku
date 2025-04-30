import './styles/PreviewStone.css';

export default function PreviewStone({ row, col, turn, label, CELL }) {
  return (
    <>
      <div
        className={`preview-stone ${turn}`}
        style={{
          top: `${row * CELL}px`,
          left: `${col * CELL}px`
        }}
      />
      <div
        className="hover-preview"
        style={{
          top: `${row * CELL}px`,
          left: `${col * CELL}px`
        }}
      >
        {label}
      </div>
    </>
  );
}
