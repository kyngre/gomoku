import './styles/Labels.css';

export default function Labels({ SIZE, CELL, LETTERS }) {
  return (
    <>
      <div className="top-letters">
        {LETTERS.map((ch, idx) => (
          <div
            key={`letter-${ch}`}
            className="letter-cell"
            style={{
              left: `${idx * CELL}px`,
              top: '0',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {ch}
          </div>
        ))}
      </div>

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
    </>
  );
}
