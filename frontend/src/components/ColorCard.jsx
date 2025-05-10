// ColorCard.jsx

import React from 'react';

function ColorCard({ color, label, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer bg-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition ${
        color === 'black' ? 'hover:bg-black' : 'hover:bg-white'
      }`}
    >
      <div className={`w-24 h-24 rounded-full mb-4 ${
        color === 'black'
          ? 'bg-black'
          : 'bg-white border border-gray-300'
      }`} />
      <h3 className={`text-xl font-semibold mb-2 ${
        color === 'black'
          ? 'text-gray-800 group-hover:text-white'
          : 'text-gray-800'
      }`}>
        {label}
      </h3>
      <p className={`text-center ${
        color === 'black'
          ? 'text-gray-600 group-hover:text-gray-200'
          : 'text-gray-600'
      }`}>
        {description}
      </p>
    </div>
  );
}

export default ColorCard;
