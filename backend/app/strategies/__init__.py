# app/strategies/__init__.py
from app.strategies.random_ai import get_random_move
from app.strategies.mini_max_ai import get_mini_max_move
from app.strategies.cnn_ai import get_cnn_move
import os
import importlib.util

def get_strategy(name):
    print(f"전략 요청: '{name}'")
    
    # 기본 전략 먼저 확인
    base_strategies = {
        "easy": get_random_move,
        "medium": get_mini_max_move,
        "hard": get_cnn_move,
    }
    
    if name in base_strategies:
        print(f"기본 전략 반환: {name}")
        return base_strategies[name]
    
    # 사용자 AI 처리
    print(f"사용자 AI로 처리: {name}")
    return load_user_ai(name)

def load_user_ai(file_id):
    """사용자 AI 동적 로딩"""
    user_ai_dir = "./app/strategies/contributions"
    file_path = os.path.join(user_ai_dir, f"{file_id}.py")
    
    print(f"사용자 AI 파일 경로: {file_path}")
    print(f"파일 존재 여부: {os.path.exists(file_path)}")
    
    if not os.path.exists(file_path):
        print(f"파일이 존재하지 않음: {file_path}")
        if os.path.exists(user_ai_dir):
            files = os.listdir(user_ai_dir)
            print(f"contributions 폴더 내 파일들: {files}")
        return None
        
    try:
        spec = importlib.util.spec_from_file_location(file_id, file_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        
        if hasattr(module, 'get_move'):
            print(f"사용자 AI 로딩 성공: {file_id}")
            return module.get_move
        else:
            print(f"get_move 함수가 없음: {file_id}")
    except Exception as e:
        print(f"사용자 AI 로딩 실패 {file_id}: {e}")
        import traceback
        traceback.print_exc()
    
    return None
