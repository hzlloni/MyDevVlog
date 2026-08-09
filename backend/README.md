# 🚀 minimal-blog FastAPI Backend Server

이 폴더는 `minimal-blog` 프론트엔드 서비스와 통신하는 **FastAPI + SQLite + SQLAlchemy** 백엔드 API 서버입니다.

---

## 🛠️ 개발 환경 설정 및 실행 방법

맥(Mac) 환경 기준 터미널에서 아래 단계를 순서대로 실행하여 파이썬 가상환경을 활성화하고 서버를 구동합니다.

### 1. 백엔드 폴더 진입
터미널을 열고 `backend` 폴더가 위치한 경로로 들어갑니다.
```bash
cd /Users/jeonhyewon/Desktop/Study/MyVlog
```

### 2. 가상환경(venv) 생성 및 활성화
파이썬 라이브러리 충돌을 방지하기 위해 가상환경을 생성하고 가동합니다.
```bash
python3 -m venv venv
source venv/bin/activate
```
*(가상환경이 켜지면 터미널 프롬프트 맨 앞에 `(venv)` 표시가 나타납니다.)*

### 3. 필수 패키지 설치
`requirements.txt`에 명시된 필수 외부 패키지들을 다운로드합니다.
```bash
pip install -r backend/requirements.txt
```

### 4. 백엔드 API 서버 기동
서버 기동 스크립트를 작동시켜 API 서버를 실행합니다.
```bash
python3 -m backend.main
```
실행이 성공하면 아래와 같은 로그가 출력됩니다:
```text
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
🌱 Seeding initial posts to database...
🚀 DB Seeding completed successfully.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

이제 브라우저에서 `http://127.0.0.1:8000/docs` 로 접속하시면, FastAPI가 자동으로 만들어준 실시간 대화형 **Swagger UI API 테스트 명세서** 화면이 나타납니다!

---

## 💾 데이터베이스 정보

### 1) 기본 데이터베이스 (SQLite)
* **기본값**: 아무런 설정을 하지 않으면 `MyVlog` 폴더 밑에 `blog.db` 파일이 자동으로 생성되어 간편하게 작동합니다.

### 2) 상용 데이터베이스 (PostgreSQL) 연동 방법
만약 로컬 혹은 원격 **PostgreSQL**과 연결하여 상용 수준으로 배포 및 저장하고 싶다면, 터미널 환경 변수로 `DATABASE_URL`을 지정한 상태로 서버를 가동하기만 하면 됩니다.

1. **로컬 PostgreSQL에 데이터베이스 생성**
   PostgreSQL 쉘이나 클라이언트(DBeaver, pgAdmin 등)에서 사용할 빈 데이터베이스를 먼저 생성합니다:
   ```sql
   CREATE DATABASE minimal_blog;
   ```

2. **환경변수를 주입하여 서버 가동**
   터미널에서 `DATABASE_URL`을 아래 형식으로 선언하고 백엔드 서버를 실행합니다:
   ```bash
   # 포맷: postgresql://<유저명>:<비밀번호>@<호스트>:<포트>/<디비명>
   export DATABASE_URL="postgresql://postgres:your_password@localhost:5432/minimal_blog"
   
   # 서버 실행 (FastAPI가 테이블을 자동으로 생성하고 더미 데이터를 적재합니다)
   python3 -m backend.main
   ```

* **CORS 설정**: `http://localhost:3000` (Next.js 로컬 주소) 요청을 안전하게 허용하도록 미들웨어가 기본 탑재되어 있습니다.
