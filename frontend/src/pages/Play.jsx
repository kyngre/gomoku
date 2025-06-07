// src/pages/Play.jsx

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Board from '../components/Board';
import { API_URL } from '../constants';

function Play() {
  const navigate = useNavigate();
  const { strategy: level } = useParams();
  
  // 사용자 AI 정보 상태
  const [loading, setLoading] = useState(false);
  const [aiInfo, setAiInfo] = useState({
    name: "랜덤AI",
    message: "돌 놓는 건 운빨도 중요하죠!",
    avatar: "/assets/beginner.jpeg",
    githubUrl: null
  });

  useEffect(() => {
    console.log("Play 컴포넌트 로딩, strategy:", level);
    
    // 사용자 AI 체크 (user_ prefix가 있거나 기본 전략이 아닌 경우)
    if (level && !['easy', 'medium', 'hard'].includes(level)) {
      // 사용자 AI인 경우 정보 가져오기
      fetchUserAiInfo();
    } else {
      // 기존 AI 정보 설정
      setBasicAiInfo();
    }
  }, [level]);

  const fetchUserAiInfo = async () => {
    setLoading(true);
    try {
      console.log("사용자 AI 정보 로딩 시작");
      // Users.jsx와 동일한 엔드포인트 사용
      const response = await axios.get(`${API_URL}/contributions`);
      
      // file_id로 매칭 (user_ prefix 제거)
      const fileId = level.startsWith('user_') ? level.replace('user_', '') : level;
      const userAi = response.data.find(ai => ai.file_id === fileId);
      
      if (userAi) {
        console.log("사용자 AI 정보 로딩 성공:", userAi);
        setAiInfo({
          name: userAi.name,
          message: userAi.description,
          avatar: "/assets/user_ai.png", // 기본 사용자 AI 아바타
          githubUrl: `https://${userAi.addr}` // Users.jsx와 동일하게 addr 사용
        });
      } else {
        console.warn("사용자 AI를 찾을 수 없음:", fileId);
        // 기본값으로 설정
        setAiInfo({
          name: "사용자 AI",
          message: "사용자가 제작한 AI입니다.",
          avatar: "/assets/user_ai.png",
          githubUrl: null
        });
      }
    } catch (error) {
      console.error("사용자 AI 정보 로딩 실패:", error);
      // 기본값으로 설정
      setAiInfo({
        name: "사용자 AI",
        message: "사용자가 제작한 AI입니다.",
        avatar: "/assets/user_ai.png",
        githubUrl: null
      });
    } finally {
      setLoading(false);
    }
  };

  const setBasicAiInfo = () => {
    if (level === "medium") {
      setAiInfo({
        name: "MiniMax AI",
        message: "한 수, 한 수가 전략입니다.",
        avatar: "/assets/medium.png",
        githubUrl: null
      });
    } else if (level === "hard") {
      setAiInfo({
        name: "Supervised-CNN",
        message: "깊이 있는 수읽기를 보여드리죠.",
        avatar: "/assets/hard.webp",
        githubUrl: null
      });
    } else {
      // easy 또는 기본값
      setAiInfo({
        name: "랜덤AI",
        message: "돌 놓는 건 운빨도 중요하죠!",
        avatar: "/assets/beginner.jpeg",
        githubUrl: null
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">AI 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 relative">
      
      {/* 🤖 AI 말풍선 + 캐릭터 (우측 상단) */}
      <div className="absolute top-6 right-6 flex flex-col items-center">
        <div className="bg-yellow-100 text-gray-800 text-sm px-4 py-1 rounded-full shadow mb-2">
          {`"${aiInfo.message}"`}
        </div>
        <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-300 shadow-md bg-gray-100">
          <img
            src={aiInfo.avatar}
            alt="AI 캐릭터"
            className="object-cover w-full h-full"
            onError={(e) => {
              // 이미지 로딩 실패 시 기본 이미지로 대체
              e.target.src = "/assets/beginner.jpeg";
            }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">{aiInfo.name}</div>
        
        {/* 사용자 AI인 경우 GitHub 링크 */}
        {aiInfo.githubUrl && (
          <a
            href={aiInfo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            📝 소스코드
          </a>
        )}
      </div>

      {/* 🧩 Board 영역 */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg w-fit mb-6">
        <Board strategy={level} />  {/* strategy props 전달 */}
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
        
        {/* 사용자 AI인 경우 AI 목록으로 돌아가기 버튼 */}
        {level && !['easy', 'medium', 'hard'].includes(level) && (
          <button
            onClick={() => navigate('/users')} // Users 페이지로 이동
            className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 transition"
          >
            AI 목록
          </button>
        )}
      </div>
    </div>
  );
}

export default Play;
