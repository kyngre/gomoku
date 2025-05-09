from app import create_app, db

app = create_app()

# DB 테이블 생성용
with app.app_context():
    db.create_all()
    print("✅ DB 테이블 생성 완료 또는 이미 존재")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
