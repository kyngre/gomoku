import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../constants';

/**
 * Users 컴포넌트: 등록된 사용자 AI 목록을 보여주고, 대국 시작 및 홈 이동 기능 제공
 */
function Users() {
  // 사용자 AI 목록 상태
  const [aiList, setAiList] = useState([]);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 에러 메시지 상태
  const [error, setError] = useState('');
  // 페이지 이동을 위한 navigate 함수
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 AI 목록 불러오기
  useEffect(() => {
    fetchUserAIs();
  }, []);

  /**
   * 사용자 AI 목록을 API에서 불러오는 함수
   */
  const fetchUserAIs = async () => {
    try {
      console.log("API 호출 시작");
      const response = await axios.get(`${API_URL}/contributions`);
      console.log("API 응답:", response.data);
      setAiList(response.data); // 데이터 상태에 저장
    } catch (error) {
      console.error("API 호출 실패:", error);
      setError(error.message); // 에러 상태에 저장
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  /**
   * 대국하기 버튼 클릭 시 호출되는 함수
   * 해당 AI와의 대국 페이지로 이동
   */
  const handlePlayGame = (ai) => {
    try {
      console.log(`${ai.name}과 대국 시작`);
      // Play 페이지로 이동
      navigate(`/play/${ai.file_id}`);
    } catch (error) {
      console.error("게임 시작 실패:", error);
      alert("게임 시작에 실패했습니다.");
    }
  };

  // 로딩 중일 때 표시
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">로딩 중...</div>
    </div>
  );
  
  // 에러 발생 시 표시
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-600">에러: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen w-screen bg-gray-50 py-12 px-4">
      {/* 상단 바: 홈 버튼 + 타이틀 */}
      <div className="w-full max-w-screen-2xl mx-auto flex items-center mb-12">
        {/* 홈으로 이동하는 버튼 */}
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 font-bold text-lg mr-4"
        >
          홈
        </button>
        {/* 페이지 타이틀 */}
        <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">
          등록된 사용자 알고리즘
        </h1>
      </div>

      {/* AI 목록이 없을 때 메시지 표시 */}
      {aiList.length === 0 ? (
        <div className="text-center text-gray-600">
          등록된 사용자 AI가 없습니다.
        </div>
      ) : (
        // AI 목록 그리드로 표시
        <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {aiList.map((ai) => (
            <div
              key={ai.file_id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              {/* AI 이름(외부 링크) */}
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                <a 
                  href={`https://${ai.addr}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {ai.name}
                </a>
              </h2>
              
              {/* AI 설명 */}
              <p className="text-sm text-gray-700 mb-4">{ai.description}</p>
              {/* 대국하기 버튼 */}
              <button 
                onClick={() => handlePlayGame(ai)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded w-full"
              >
                대국하기
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
