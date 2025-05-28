import os
import importlib.util
from flask import Blueprint, jsonify

user_ai_bp = Blueprint('user_ai', __name__)

@user_ai_bp.route('/contributions', methods=['GET'])
def get_user_ais():
    print("=== 사용자 AI 목록 API 호출 ===")
    ai_list = []
    
    user_ai_dir = "./app/strategies/contributions"
    print(f"폴더 경로: {user_ai_dir}")
    
    if not os.path.exists(user_ai_dir):
        print("폴더가 존재하지 않음")
        return jsonify([])
    
    files = os.listdir(user_ai_dir)
    print(f"폴더 내 파일들: {files}")
    
    for fname in files:
        if fname.endswith('.py') and not fname.startswith('__'):
            print(f"처리 중인 파일: {fname}")
            path = os.path.join(user_ai_dir, fname)
            
            try:
                # 동적 모듈 로딩
                spec = importlib.util.spec_from_file_location(fname[:-3], path)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                
                # meta 정보 추출
                if hasattr(module, 'meta'):
                    meta = module.meta.copy()
                    meta['file_id'] = fname[:-3]  # 파일명 (확장자 제외)
                    ai_list.append(meta)
                    print(f"성공적으로 로드: {meta}")
                else:
                    print(f"meta가 없음: {fname}")
                    
            except Exception as e:
                print(f"로딩 실패 {fname}: {e}")
    
    print(f"최종 AI 목록: {ai_list}")
    return jsonify(ai_list)
