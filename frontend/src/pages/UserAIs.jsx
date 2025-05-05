import { useEffect, useState } from "react";

const mockData = [
  {
    id: "alpha123",
    name: "AlphaHunter",
    author: "user001",
    winrate: "72%",
    description: "알파베타 프루닝 기반 전략 AI",
  },
  {
    id: "mcts42",
    name: "MonteMaster",
    author: "dev_kim",
    winrate: "64%",
    description: "MCTS로 강화된 전술형 AI",
  },
  {
    id: "rl-genius",
    name: "RL-Genius",
    author: "gomokuPro",
    winrate: "89%",
    description: "강화학습 기반 자가학습 AI",
  },
];

function UserAIs() {
  const [aiList, setAiList] = useState([]);

  useEffect(() => {
    // 향후: API 연동
    setAiList(mockData);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        등록된 사용자 알고리즘
      </h1>

      {/* 카드 영역 */}
      <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {aiList.map((ai) => (
          <div
            key={ai.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-2">{ai.name}</h2>
            <p className="text-sm text-gray-600 mb-1">
              작성자: <span className="font-mono">{ai.author}</span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              승률: <span className="text-green-600 font-bold">{ai.winrate}</span>
            </p>
            <p className="text-sm text-gray-700 mb-4">{ai.description}</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded">
              대국하기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserAIs;
