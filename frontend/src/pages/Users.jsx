import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Users() {
  const [aiList, setAiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAIs();
  }, []);

  const fetchUserAIs = async () => {
    try {
      console.log("API 호출 시작");
      const response = await axios.get("http://localhost:5050/contributions");
      console.log("API 응답:", response.data);
      setAiList(response.data);
    } catch (error) {
      console.error("API 호출 실패:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">로딩 중...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-600">에러: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen w-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        등록된 사용자 알고리즘
      </h1>


      {aiList.length === 0 ? (
        <div className="text-center text-gray-600">
          등록된 사용자 AI가 없습니다.
        </div>
      ) : (
        <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {aiList.map((ai) => (
            <div
              key={ai.file_id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition"
            >
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
              
              <p className="text-sm text-gray-700 mb-4">{ai.description}</p>
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
