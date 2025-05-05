import { useNavigate, useParams } from "react-router-dom";
import Board from '../components/Board';

function Play() {
  const navigate = useNavigate();
  const { strategy: level } = useParams();  // ✅ 경로 기반 전략 추출


  // 🔁 난이도에 따른 UI 정보 설정
  let aiName = "랜덤AI";
  let aiMessage = "돌 놓는 건 운빨도 중요하죠!";
  let avatar = "/assets/beginner.jpeg";

  if (level === "medium") {
    aiName = "MiniMax AI";
    aiMessage = "한 수, 한 수가 전략입니다.";
    avatar = "/assets/medium.png";
  } else if (level === "hard") {
    aiName = "Supervised-CNN";
    aiMessage = "깊이 있는 수읽기를 보여드리죠.";
    avatar = "/assets/hard.webp";
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 relative">
      
      {/* 🤖 AI 말풍선 + 캐릭터 (우측 상단) */}
      <div className="absolute top-6 right-6 flex flex-col items-center">
        <div className="bg-yellow-100 text-gray-800 text-sm px-4 py-1 rounded-full shadow mb-2">
          {`"${aiMessage}"`}
        </div>
        <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-300 shadow-md bg-gray-100">
          <img
            src={avatar}
            alt="AI 캐릭터"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">{aiName}</div>
      </div>

      {/* 🧩 Board 영역 */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg w-fit mb-6">
        <Board />
      </div>

      {/* ℹ️ 상태 메시지 */}
      <div className="text-sm text-gray-600 italic mb-4">
        AI가 생각 중입니다...
      </div>

      {/* 🔁 버튼 영역 */}
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          다시하기
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-300 text-gray-800 px-5 py-2 rounded shadow hover:bg-gray-400 transition"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}

export default Play;
