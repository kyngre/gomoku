import { useNavigate } from "react-router-dom";

// Dynamically defined AI levels (could be fetched from an API)
const getAILevels = () => [
  { id: "easy", name: "난이도 초급", description: "랜덤 착수 기반 AI", path: "/play/easy" },
  { id: "medium", name: "난이도 중급", description: "미니맥스 AI", path: "/play/medium" },
  { id: "hard", name: "난이도 고급", description: "딥러닝 학습형 AI", path: "/play/hard" },
];

function Landing() {
  const navigate = useNavigate();
  const aiLevels = getAILevels(); // Dynamically get AI levels

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* 헤더 */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">Gomoku.AI</h1>
        <p className="text-xl text-gray-500 italic mt-2">"Play. Train. Contribute."</p>
      </header>

      {/* 카드 섹션 */}
      <section className="w-full max-w-screen-2xl px-4 mb-16">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">AI 선택</h2>

        {/* 반응형 카드 정렬 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {aiLevels.map((level) => (
            <div
              key={level.id}
              onClick={() => navigate(level.path)}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg cursor-pointer transition"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{level.name}</h3>
              <p className="text-sm text-gray-600">{level.description}</p>
            </div>
          ))}

          {/* 사용자 기여 알고리즘 */}
          <div
            onClick={() => navigate("/user-ai")}
            className="bg-yellow-50 p-6 rounded-xl border border-yellow-300 shadow hover:shadow-lg cursor-pointer transition"
          >
            <h3 className="text-lg font-bold text-yellow-800 mb-2">사용자 기여 알고리즘</h3>
            <p className="text-sm text-yellow-700">PR로 등록된 AI를 카드 형식으로 확인</p>
          </div>
        </div>
      </section>

      {/* 안내문 */}
      <div className="text-sm text-gray-500 text-center space-y-1 mb-12">
        <p>✔ 룰 기반 AI부터 학습형까지 다양한 상대 제공</p>
        <p>✔ 나만의 알고리즘을 PR로 제출해 등록 가능</p>
        <p>✔ 실시간 대국 결과, 승률 통계 제공 예정</p>
      </div>

      {/* 푸터 */}
      <footer className="text-xs text-gray-400 text-center space-x-3">
        <a href="https://github.com/kyngre/gomoku" className="hover:underline">GitHub</a>
      </footer>
    </div>
  );
}

export default Landing;