import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

// AI 선택 카드 정보
const getAILevels = () => [
  { id: "easy", name: "난이도 초급", description: "랜덤 착수 기반 AI", path: "/play/easy" },
  { id: "medium", name: "난이도 중급", description: "미니맥스 AI", path: "/play/medium" },
  { id: "hard", name: "난이도 고급", description: "딥러닝 학습형 AI", path: "/play/hard" },
];

function Landing() {
  const navigate = useNavigate();
  const aiLevels = getAILevels();

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // 드래그앤드랍 이벤트 핸들러
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".py")) {
      setFile(droppedFile);
    } else {
      alert(".py 파일만 업로드 가능합니다.");
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".py")) {
      setFile(selectedFile);
    } else {
      alert(".py 파일만 업로드 가능합니다.");
    }
  };

  const handleStart = () => {
    if (!file) return;
    // 파일 객체를 넘기진 못하므로 여기서 FormData로 업로드 요청을 보내고 응답 결과에 따라 이동
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/simulate", { state: { algoId: data.algo_id } });
        } else {
          alert("업로드 실패: " + data.message);
        }
      })
      .catch(() => {
        alert("서버 요청 실패");
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* 헤더 */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">Gomoku.AI</h1>
        <p className="text-xl text-gray-500 italic mt-2">"Play. Train. Contribute."</p>
      </header>

      {/* AI 선택 카드 */}
      <section className="w-full max-w-screen-2xl px-4 mb-16">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">AI 대결</h2>
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

          {/* PR 기반 사용자 알고리즘 */}
          <div
            onClick={() => navigate("/user-ai")}
            className="bg-yellow-50 p-6 rounded-xl border border-yellow-300 shadow hover:shadow-lg cursor-pointer transition"
          >
            <h3 className="text-lg font-bold text-yellow-800 mb-2">사용자 기여 알고리즘</h3>
            <p className="text-sm text-yellow-700">PR로 등록된 AI를 카드 형식으로 확인</p>
          </div>
        </div>
      </section>

      {/* 사용자 알고리즘 업로드 구역 */}
      <section className="w-full max-w-2xl text-center mb-12">
        <h2 className="text-xl font-bold text-gray-700 mb-4">알고리즘 대결</h2>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-dashed border-2 rounded-xl p-10 transition ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
          }`}
        >
          <p className="text-gray-600 mb-2">.py 파일을 여기에 드래그하거나 클릭하여 업로드</p>
          <input
            type="file"
            accept=".py"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded cursor-pointer hover:bg-blue-700"
          >
            파일 선택
          </label>
          {file && <p className="mt-3 text-sm text-green-700">선택된 파일: {file.name}</p>}
        </div>

        <button
          onClick={handleStart}
          disabled={!file}
          className={`mt-6 px-6 py-2 rounded text-white font-semibold ${
            file ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          대결 시작
        </button>
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
