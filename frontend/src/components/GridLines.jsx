import React from 'react';
import './styles/GridLines.css';

export default function GridLines({ SIZE, CELL }) {
  return (
    <>
      {/* 격자선 */}
      {Array.from({ length: SIZE }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="v-line" style={{ left: `${i * CELL}px` }} />
          <div className="h-line" style={{ top: `${i * CELL}px` }} />
        </React.Fragment>
      ))}

      {/* 외곽 테두리 */}
      <div className="border-line top" />
      <div className="border-line bottom" />
      <div className="border-line left" />
      <div className="border-line right" />
    </>
  );
}